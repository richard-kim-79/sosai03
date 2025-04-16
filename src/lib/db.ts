import { Pool, PoolClient, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  const patchedClient = client as PoolClient & { lastQuery?: string };
  
  patchedClient.query = (...args: any[]) => {
    patchedClient.lastQuery = args[0];
    return originalQuery.apply(client, args);
  };

  patchedClient.release = () => {
    // Clear the timeout
    clearTimeout(timeout);
    // Set the methods back to their original un-monkey-patched version
    patchedClient.query = originalQuery;
    patchedClient.release = originalRelease;
    return originalRelease.apply(client);
  };

  return patchedClient;
}; 