const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

process.env.JSON_STORAGE = path.join(os.tmpdir(), `birth-hub-360-test-${process.pid}.json`);
process.env.AUTH_SECRET = 'test-secret';

const createApp = require('../app');
const initDb = require('../initDb');

async function startTestServer() {
  await initDb();
  const app = createApp();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve))
  };
}

async function login(baseUrl) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ana@birthhub.com', password: '123456' })
  });
  assert.equal(response.status, 200);
  const session = await response.json();
  assert.ok(session.token);
  assert.equal(session.tenantId, 'birthhub-demo');
  return session;
}

function authHeaders(session, extra = {}) {
  return {
    Authorization: `Bearer ${session.token}`,
    'X-Tenant-Id': session.tenantId,
    ...extra
  };
}

test('status endpoint is public and protected APIs require auth', async (t) => {
  const server = await startTestServer();
  t.after(async () => {
    await server.close();
  });

  const statusResponse = await fetch(`${server.baseUrl}/api/status`);
  assert.equal(statusResponse.status, 200);
  const body = await statusResponse.json();
  assert.equal(body.status, 'online');
  assert.equal(body.auth, 'enabled');

  const unauthenticatedDeals = await fetch(`${server.baseUrl}/api/deals`);
  assert.equal(unauthenticatedDeals.status, 401);
});

test('auth login returns a tenant-scoped session and rejects invalid credentials', async (t) => {
  const server = await startTestServer();
  t.after(async () => {
    await server.close();
  });

  const invalidResponse = await fetch(`${server.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ana@birthhub.com', password: 'wrong' })
  });
  assert.equal(invalidResponse.status, 401);

  const session = await login(server.baseUrl);
  const meResponse = await fetch(`${server.baseUrl}/api/auth/me`, { headers: authHeaders(session) });
  assert.equal(meResponse.status, 200);
  const me = await meResponse.json();
  assert.equal(me.tenantId, 'birthhub-demo');
});

test('deals API validates, creates, updates and records activity', async (t) => {
  const server = await startTestServer();
  t.after(async () => {
    await server.close();
  });
  const session = await login(server.baseUrl);

  const invalidResponse = await fetch(`${server.baseUrl}/api/deals`, {
    method: 'POST',
    headers: authHeaders(session, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title: '', value: -1 })
  });
  assert.equal(invalidResponse.status, 400);

  const createResponse = await fetch(`${server.baseUrl}/api/deals`, {
    method: 'POST',
    headers: authHeaders(session, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title: 'Piloto Hospitalar', value: 42000, stage: 'qualificacao', company: 'Clínica Nova' })
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.title, 'Piloto Hospitalar');
  assert.equal(created.tenantId, session.tenantId);

  const patchResponse = await fetch(`${server.baseUrl}/api/deals/${created.id}`, {
    method: 'PATCH',
    headers: authHeaders(session, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ stage: 'proposta' })
  });
  assert.equal(patchResponse.status, 200);
  const patched = await patchResponse.json();
  assert.equal(patched.stage, 'proposta');

  const activitiesResponse = await fetch(`${server.baseUrl}/api/activities`, { headers: authHeaders(session) });
  assert.equal(activitiesResponse.status, 200);
  const activities = await activitiesResponse.json();
  assert.ok(activities.some((activity) => activity.entityType === 'deal' && activity.action === 'updated'));
});

test('contacts API and AI route are authenticated and tenant-bound', async (t) => {
  const server = await startTestServer();
  t.after(async () => {
    await server.close();
  });
  const session = await login(server.baseUrl);

  const contactResponse = await fetch(`${server.baseUrl}/api/contacts`, {
    method: 'POST',
    headers: authHeaders(session, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ name: 'Marina Costa', company: 'HealthOps', email: 'marina@example.com' })
  });
  assert.equal(contactResponse.status, 201);
  const contact = await contactResponse.json();
  assert.equal(contact.owner, 'Ana Silva');
  assert.equal(contact.tenantId, 'birthhub-demo');

  const wrongTenantResponse = await fetch(`${server.baseUrl}/api/contacts`, {
    headers: authHeaders(session, { 'X-Tenant-Id': 'other-tenant' })
  });
  assert.equal(wrongTenantResponse.status, 401);

  const aiResponse = await fetch(`${server.baseUrl}/api/ai/leadprioritize-ai`, {
    method: 'POST',
    headers: authHeaders(session, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ company_size: 'enterprise', engagement_level: 'high', budget: 'high', urgency: 'now' })
  });
  assert.equal(aiResponse.status, 200);
  const ai = await aiResponse.json();
  assert.equal(typeof ai.score, 'number');
  assert.ok(Array.isArray(ai.checklist));
});
