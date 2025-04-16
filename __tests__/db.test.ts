import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// 테스트용 환경 변수 로드
dotenv.config({ path: '.env.test' });

// 테스트용 DB 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

describe('DB 저장 및 조회 테스트', () => {
  beforeAll(async () => {
    // 테스트 전 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_data (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        value INTEGER
      )
    `);
  });

  afterAll(async () => {
    // 테스트 후 테이블 삭제
    await pool.query('DROP TABLE IF EXISTS test_data');
    await pool.end();
  });

  test('데이터 저장 후 조회 검증', async () => {
    // 테스트 데이터 저장
    const insertResult = await pool.query(
      'INSERT INTO test_data (name, value) VALUES ($1, $2) RETURNING *',
      ['test', 123]
    );
    const insertedId = insertResult.rows[0].id;

    // 저장된 데이터 조회
    const selectResult = await pool.query(
      'SELECT * FROM test_data WHERE id = $1',
      [insertedId]
    );

    // 검증
    expect(selectResult.rows.length).toBe(1);
    expect(selectResult.rows[0].name).toBe('test');
    expect(selectResult.rows[0].value).toBe(123);
  });

  test('여러 데이터 저장 후 전체 조회 검증', async () => {
    // 여러 테스트 데이터 저장
    const testData = [
      ['data1', 100],
      ['data2', 200],
      ['data3', 300]
    ];

    for (const [name, value] of testData) {
      await pool.query(
        'INSERT INTO test_data (name, value) VALUES ($1, $2)',
        [name, value]
      );
    }

    // 전체 데이터 조회
    const selectResult = await pool.query('SELECT * FROM test_data ORDER BY id DESC LIMIT 3');

    // 검증
    expect(selectResult.rows.length).toBe(3);
    expect(selectResult.rows[0].name).toBe('data3');
    expect(selectResult.rows[0].value).toBe(300);
    expect(selectResult.rows[1].name).toBe('data2');
    expect(selectResult.rows[1].value).toBe(200);
    expect(selectResult.rows[2].name).toBe('data1');
    expect(selectResult.rows[2].value).toBe(100);
  });
}); 