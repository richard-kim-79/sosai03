import { NextResponse } from 'next/server';
import { initDatabase } from '@/utils/database';
import { encrypt, decrypt } from '@/utils/security';
import { log, monitorApi, monitorRisk } from '@/utils/monitoring';

describe('API Endpoints', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  describe('Database Initialization', () => {
    it('should initialize database successfully', async () => {
      const response = await fetch('http://localhost:3000/api/init', {
        method: 'POST',
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Database initialized successfully');
    });
  });

  describe('Encryption/Decryption', () => {
    const testData = { message: 'Test message' };

    it('should encrypt data successfully', async () => {
      const response = await fetch('http://localhost:3000/api/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: testData }),
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.encryptedData).toBeDefined();
    });

    it('should decrypt data successfully', async () => {
      const encryptedData = encrypt(JSON.stringify(testData));
      const response = await fetch('http://localhost:3000/api/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData }),
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(testData);
    });
  });

  describe('Monitoring', () => {
    it('should log activity successfully', async () => {
      const logEntry = {
        level: 'info' as const,
        message: 'Test log message',
        timestamp: new Date(),
        metadata: { test: true },
      };
      await log(logEntry);
      // Verify log entry in database
    });

    it('should monitor API metrics successfully', async () => {
      await monitorApi('/api/test', 'GET', 200, 100);
      // Verify API metrics in database
    });

    it('should monitor risk metrics successfully', async () => {
      await monitorRisk('high', 80, ['test', 'keyword'], 'Test reason');
      // Verify risk metrics in database
    });
  });
}); 