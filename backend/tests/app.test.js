import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

const BASE_URL = 'http://localhost:3001';
let server;

// Helper function to make HTTP requests
const makeRequest = (path, method = 'GET') => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
};

describe('Backend API Tests', () => {
  before(async () => {
    // Start the server before tests
    const { default: app } = await import('../src/app.js');
    server = app.listen(3001);
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  after(() => {
    // Close server after tests
    if (server) {
      server.close();
    }
  });

  describe('Health Endpoint', () => {
    it('should return 200 OK on /health', async () => {
      const response = await makeRequest('/health');
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.status, 'ok');
      assert.ok(response.body.timestamp);
      assert.strictEqual(response.body.service, 'interview-monitoring-backend');
    });
  });

  describe('API Root', () => {
    it('should return API info on /api', async () => {
      const response = await makeRequest('/api');
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.message, 'AI Interview Monitoring API');
      assert.ok(response.body.version);
      assert.ok(response.body.endpoints);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await makeRequest('/nonexistent');
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.body.status, 'error');
      assert.ok(response.body.message.includes('Cannot GET /nonexistent'));
    });

    it('should return 404 for unknown API routes', async () => {
      const response = await makeRequest('/api/nonexistent');
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.body.status, 'error');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in response', async () => {
      const response = await makeRequest('/health');
      assert.ok(response.headers['access-control-allow-origin']);
    });
  });

  describe('Error Handling', () => {
    it('should format errors consistently', async () => {
      const response = await makeRequest('/api/trigger-error');
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.body.status, 'error');
      assert.ok(response.body.timestamp);
      assert.ok(response.body.message);
    });
  });
});
