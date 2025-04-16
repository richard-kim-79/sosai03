import { prisma } from '@/lib/prisma';

interface RiskAnalysis {
  id: number;
  sessionId: string;
  messageId: number;
  riskLevel: string;
  riskFactors: string;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
  message: {
    content: string;
    role: string;
  };
}

interface DashboardData {
  totalSessions: number;
  highRiskSessions: number;
  recentAnalyses: (RiskAnalysis & {
    message: {
      content: string;
      role: string;
    };
  })[];
}

async function getDashboardData(): Promise<DashboardData> {
  const [totalSessions, highRiskSessions, recentAnalyses] = await Promise.all([
    prisma.riskAnalysis.count({
      select: {
        sessionId: true,
      },
      distinct: ['sessionId'],
    }),
    prisma.riskAnalysis.count({
      where: {
        riskLevel: 'HIGH',
      },
      select: {
        sessionId: true,
      },
      distinct: ['sessionId'],
    }),
    prisma.riskAnalysis.findMany({
      where: {
        riskLevel: 'HIGH',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        message: {
          select: {
            content: true,
            role: true,
          },
        },
      },
    }),
  ]);

  return {
    totalSessions: totalSessions.sessionId,
    highRiskSessions: highRiskSessions.sessionId,
    recentAnalyses,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">전체 세션</h2>
          <p className="text-3xl font-bold">{data.totalSessions}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">고위험 세션</h2>
          <p className="text-3xl font-bold text-red-500">{data.highRiskSessions}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">고위험 비율</h2>
          <p className="text-3xl font-bold">
            {((data.highRiskSessions / data.totalSessions) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">최근 고위험 분석</h2>
        <div className="space-y-4">
          {data.recentAnalyses.map((analysis) => (
            <div key={analysis.id} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">세션 ID: {analysis.sessionId}</span>
                <span className="text-sm text-gray-500">
                  {new Date(analysis.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600 mb-1">사용자 메시지:</p>
                <p className="mb-2">{analysis.message.content}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                    위험도: {analysis.riskLevel}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    신뢰도: {(analysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 