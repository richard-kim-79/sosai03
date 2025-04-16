import { query } from './database';

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const log = async (entry: LogEntry) => {
  try {
    await query(
      `INSERT INTO logs (level, message, timestamp, metadata) 
       VALUES ($1, $2, $3, $4)`,
      [entry.level, entry.message, entry.timestamp, entry.metadata]
    );
  } catch (error) {
    console.error('Failed to log entry:', error);
  }
};

export const monitorApi = async (
  endpoint: string,
  method: string,
  status: number,
  duration: number
) => {
  try {
    await query(
      `INSERT INTO api_metrics (endpoint, method, status, duration, timestamp) 
       VALUES ($1, $2, $3, $4, $5)`,
      [endpoint, method, status, duration, new Date()]
    );
  } catch (error) {
    console.error('Failed to log API metric:', error);
  }
};

export const monitorRisk = async (
  level: string,
  score: number,
  keywords: string[],
  reason: string
) => {
  try {
    await query(
      `INSERT INTO risk_metrics (level, score, keywords, reason, timestamp) 
       VALUES ($1, $2, $3, $4, $5)`,
      [level, score, keywords, reason, new Date()]
    );
  } catch (error) {
    console.error('Failed to log risk metric:', error);
  }
}; 