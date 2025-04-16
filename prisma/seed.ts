import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 테스트 사용자 생성
  const user1 = await prisma.user.upsert({
    where: { email: 'test1@example.com' },
    update: {},
    create: {
      email: 'test1@example.com',
      name: '홍길동',
      emergencyContacts: {
        create: [
          {
            name: '홍부모',
            phone: '010-1234-5678',
            relationship: '부모'
          },
          {
            name: '홍형제',
            phone: '010-8765-4321',
            relationship: '형제'
          }
        ]
      },
      emergencyAlerts: {
        create: [
          {
            location: '서울시 강남구',
            status: 'resolved'
          }
        ]
      }
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test2@example.com' },
    update: {},
    create: {
      email: 'test2@example.com',
      name: '김철수',
      emergencyContacts: {
        create: [
          {
            name: '김부모',
            phone: '010-2222-3333',
            relationship: '부모'
          }
        ]
      },
      emergencyAlerts: {
        create: [
          {
            location: '서울시 서초구',
            status: 'pending'
          }
        ]
      }
    }
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 