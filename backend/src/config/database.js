import { MongoClient } from 'mongodb';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017';
const DEFAULT_DB_NAME = 'interview_monitoring';
const SERVER_SELECTION_TIMEOUT_MS = 5000;

let client = null;
let db = null;
let connectionState = 'disconnected';

export const getDatabaseName = () => process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;

export const sanitizeUri = (uri) => {
  try {
    const parsed = new URL(uri);
    if (parsed.username) parsed.username = '***';
    if (parsed.password) parsed.password = '***';
    return parsed.toString();
  } catch {
    return '<unparsed-uri>';
  }
};

export const connectDatabase = async () => {
  if (connectionState === 'connected' && db) return db;

  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  const dbName = getDatabaseName();

  connectionState = 'connecting';
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS });
    await client.connect();
    db = client.db(dbName);
    connectionState = 'connected';
    console.log(`[db] MongoDB connected: ${sanitizeUri(uri)} (database: ${dbName})`);
    return db;
  } catch (error) {
    db = null;
    connectionState = 'disconnected';
    console.error(`[db] MongoDB connection failed: ${error.message}`);
    return null;
  }
};

export const getDatabase = () => db;

export const isDatabaseConnected = () => connectionState === 'connected' && db !== null;

export const getDatabaseState = () => ({
  state: connectionState,
  database: db ? db.databaseName : null,
});

export const requireDatabase = () => {
  if (!isDatabaseConnected()) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return db;
};

export const closeDatabase = async () => {
  if (client) {
    try {
      await client.close();
      console.log('[db] MongoDB connection closed');
    } catch (error) {
      console.error(`[db] MongoDB close error: ${error.message}`);
    }
    client = null;
    db = null;
    connectionState = 'disconnected';
  }
};
