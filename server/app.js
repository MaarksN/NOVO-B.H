const fs = require('fs/promises');
const path = require('path');
const Contact = require('./models/Contact');
const Deal = require('./models/Deal');
const User = require('./models/User');
const Activity = require('./models/Activity');
const { verifyPassword } = require('./security/passwords');
const { createToken, verifyToken } = require('./security/tokens');

const clientDir = path.join(__dirname, '..', 'client');
const VALID_STAGES = new Set(['qualificacao', 'demonstracao', 'proposta', 'negociacao', 'ganho', 'perdido']);
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Tenant-Id'
};

function sendJson(res, status, payload) {
  res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendEmpty(res, status = 204) {
  res.writeHead(status, CORS_HEADERS);
  res.end();
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Invalid JSON payload');
    error.statusCode = 400;
    throw error;
  }
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, toJSON, update, ...safeUser } = user;
  return safeUser;
}

function authContext(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) return null;

  const requestedTenant = req.headers['x-tenant-id'];
  if (requestedTenant && requestedTenant !== payload.tenantId) return null;
  return {
    userId: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    tenantId: payload.tenantId
  };
}

function requireAuth(req, res) {
  const context = authContext(req);
  if (!context) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return null;
  }
  return context;
}

function normalizeContactPayload(payload, context) {
  return {
    tenantId: context.tenantId,
    name: typeof payload.name === 'string' ? payload.name.trim() : '',
    company: typeof payload.company === 'string' ? payload.company.trim() : '',
    email: typeof payload.email === 'string' ? payload.email.trim() : null,
    phone: typeof payload.phone === 'string' ? payload.phone.trim() : null,
    owner: typeof payload.owner === 'string' && payload.owner.trim() ? payload.owner.trim() : context.name || 'Ana'
  };
}

function normalizeDealPayload(payload, context) {
  const parsedValue = Number(payload.value);
  return {
    tenantId: context.tenantId,
    title: typeof payload.title === 'string' ? payload.title.trim() : '',
    value: Number.isFinite(parsedValue) ? parsedValue : NaN,
    stage: typeof payload.stage === 'string' && payload.stage.trim() ? payload.stage.trim() : 'qualificacao',
    owner: typeof payload.owner === 'string' && payload.owner.trim() ? payload.owner.trim() : context.name || 'Ana',
    company: typeof payload.company === 'string' ? payload.company.trim() : ''
  };
}

function validateDeal(data) {
  if (!data.title || !Number.isFinite(data.value)) return 'Title and Value are required';
  if (data.value < 0) return 'Value must be greater than or equal to zero';
  if (!VALID_STAGES.has(data.stage)) return 'Invalid stage';
  return null;
}

async function recordActivity(context, action, entityType, entityId, details = {}) {
  await Activity.create({
    tenantId: context.tenantId,
    userId: context.userId,
    userEmail: context.email,
    action,
    entityType,
    entityId,
    details
  });
}

async function handleAuth(req, res, segments) {
  if (req.method === 'POST' && segments[0] === 'login') {
    const { email, password } = await readJson(req);
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendJson(res, 401, { error: 'Invalid credentials' });
    }
    const safeUser = publicUser(user);
    const token = createToken({ sub: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId });
    return sendJson(res, 200, { token, user: safeUser, tenantId: user.tenantId });
  }

  if (req.method === 'GET' && segments[0] === 'me') {
    const context = requireAuth(req, res);
    if (!context) return;
    return sendJson(res, 200, { user: context, tenantId: context.tenantId });
  }

  return sendJson(res, 404, { error: 'Not Found' });
}

async function handleContacts(req, res, segments, context) {
  const tenantScope = { tenantId: context.tenantId };
  if (req.method === 'GET' && segments.length === 0) return sendJson(res, 200, await Contact.findAll({ where: tenantScope }));
  if (req.method === 'POST' && segments.length === 0) {
    const data = normalizeContactPayload(await readJson(req), context);
    if (!data.name || !data.company) return sendJson(res, 400, { error: 'Name and Company are required' });
    const created = await Contact.create(data);
    await recordActivity(context, 'created', 'contact', created.id, { name: created.name, company: created.company });
    return sendJson(res, 201, created);
  }
  if (segments.length === 1 && req.method === 'PATCH') {
    const contact = await Contact.findByPk(segments[0], { where: tenantScope });
    if (!contact) return sendJson(res, 404, { error: 'Contact not found' });
    const data = normalizeContactPayload({ ...contact.toJSON(), ...(await readJson(req)) }, context);
    if (!data.name || !data.company) return sendJson(res, 400, { error: 'Name and Company are required' });
    await contact.update(data);
    await recordActivity(context, 'updated', 'contact', contact.id, { name: contact.name, company: contact.company });
    return sendJson(res, 200, contact);
  }
  if (segments.length === 1 && req.method === 'DELETE') {
    const deleted = await Contact.destroy({ where: { id: segments[0], ...tenantScope } });
    if (!deleted) return sendJson(res, 404, { error: 'Contact not found' });
    await recordActivity(context, 'deleted', 'contact', segments[0]);
    return sendEmpty(res);
  }
  return sendJson(res, 404, { error: 'Not Found' });
}

async function handleDeals(req, res, segments, context) {
  const tenantScope = { tenantId: context.tenantId };
  if (req.method === 'GET' && segments.length === 0) return sendJson(res, 200, await Deal.findAll({ where: tenantScope }));
  if (req.method === 'POST' && segments.length === 0) {
    const data = normalizeDealPayload(await readJson(req), context);
    const validationError = validateDeal(data);
    if (validationError) return sendJson(res, 400, { error: validationError });
    const created = await Deal.create(data);
    await recordActivity(context, 'created', 'deal', created.id, { title: created.title, stage: created.stage, value: created.value });
    return sendJson(res, 201, created);
  }
  if (segments.length === 1 && req.method === 'PATCH') {
    const deal = await Deal.findByPk(segments[0], { where: tenantScope });
    if (!deal) return sendJson(res, 404, { error: 'Deal not found' });
    const before = deal.toJSON();
    const data = normalizeDealPayload({ ...before, ...(await readJson(req)) }, context);
    const validationError = validateDeal(data);
    if (validationError) return sendJson(res, 400, { error: validationError });
    await deal.update(data);
    await recordActivity(context, 'updated', 'deal', deal.id, { before: { stage: before.stage, value: before.value }, after: { stage: deal.stage, value: deal.value } });
    return sendJson(res, 200, deal);
  }
  if (segments.length === 1 && req.method === 'DELETE') {
    const deleted = await Deal.destroy({ where: { id: segments[0], ...tenantScope } });
    if (!deleted) return sendJson(res, 404, { error: 'Deal not found' });
    await recordActivity(context, 'deleted', 'deal', segments[0]);
    return sendEmpty(res);
  }
  return sendJson(res, 404, { error: 'Not Found' });
}

function aiResponse(toolId, body) {
  if (toolId === 'revenue-predictor') {
    const initialMrr = Number(body.mrr || 0);
    const growth = Number(body.growth_rate || 0) / 100;
    const churn = Number(body.churn_rate || 0) / 100;
    const period = Number.parseInt(body.months || 12, 10);
    const months = [], revenue = [], optimistic = [];
    let base = initialMrr, opt = initialMrr;
    for (let i = 1; i <= period; i++) {
      months.push(`Mês ${i}`);
      base *= 1 + growth - churn;
      opt *= 1 + growth * 1.2 - churn * 0.8;
      revenue.push(Math.round(base));
      optimistic.push(Math.round(opt));
    }
    return { months, revenue, optimistic, summary: { final_mrr: Math.round(base), total_growth: Math.round(((base - initialMrr) / Math.max(initialMrr, 1)) * 100) } };
  }
  if (toolId === 'ghostwriter-ai') return { email: `Assunto: Ideia para ${body.company_name || 'sua empresa'}\n\nOlá ${body.prospect_name || 'lead'}, podemos conversar sobre ${body.pain_point || 'crescimento'} com uma abordagem ${body.tone || 'consultiva'}?` };
  if (toolId === 'dealstrategy-ai') return { riskLevel: body.stage === 'negotiation' ? 'Crítico' : 'Médio', riskAnalysis: 'Análise simulada do contexto comercial.', nextAction: 'Agendar próximo passo com decisor.', talkingPoints: ['ROI', 'Risco de inação', 'Prova social'] };
  if (toolId === 'churnpreventer') return { risk_score: 72, factors: ['Queda de uso', 'Baixo engajamento executivo'], actions: ['Agendar QBR', 'Criar plano de sucesso', 'Revalidar objetivos'] };
  if (toolId === 'leadprioritize-ai') return { score: 86, summary: 'Lead priorizado por intenção, orçamento e urgência.', checklist: [{ checked: true, text: 'ICP compatível' }, { checked: true, text: 'Sinal de intenção ativo' }, { checked: Boolean(body.budget), text: 'Orçamento declarado' }] };
  if (toolId === 'campaignroi-ai') { const revenue = Number(body.revenue || body.receita || 100000); const cost = Number(body.cost || body.custo || 25000); return { roi: Math.round(((revenue - cost) / Math.max(cost, 1)) * 100), net_profit: revenue - cost, summary: 'Campanha com retorno estimado positivo no cenário informado.' }; }
  if (toolId === 'coachinginsights') return { score: 81, insights: ['Perguntas abertas acima da média', 'Melhorar fechamento de próximos passos'], action_plan: ['Revisar objeções', 'Treinar call de descoberta'] };
  if (toolId === 'productled-growth') return { opportunities: ['Ativar usuários dormentes', 'Expandir contas com limite próximo'], experiments: ['Onboarding guiado', 'Prompt de upgrade contextual'] };
  return { title: 'Simulação executada', summary: `Ferramenta ${toolId} processada com sucesso.`, recommendations: ['Priorizar próximo passo', 'Registrar aprendizado no CRM', 'Acompanhar métrica principal'] };
}

async function handleAi(req, res, segments, context) {
  if (req.method !== 'POST' || segments.length !== 1) return sendJson(res, 404, { error: 'Not Found' });
  const body = await readJson(req);
  const result = aiResponse(segments[0], body);
  await recordActivity(context, 'executed', 'ai-tool', segments[0], { toolId: segments[0] });
  return sendJson(res, 200, result);
}

async function handleActivities(req, res, segments, context) {
  if (req.method === 'GET' && segments.length === 0) {
    const activities = await Activity.findAll({ where: { tenantId: context.tenantId } });
    return sendJson(res, 200, activities.slice(0, 100));
  }
  return sendJson(res, 404, { error: 'Not Found' });
}

async function serveStatic(res, pathname) {
  const safePath = path.normalize(decodeURIComponent(pathname === '/' ? '/index.html' : pathname)).replace(/^([/\\])+/, '');
  const filePath = path.join(clientDir, safePath);
  if (!filePath.startsWith(clientDir)) return sendJson(res, 403, { error: 'Forbidden' });
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.js' ? 'text/javascript; charset=utf-8' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch {
    sendJson(res, 404, { error: 'Not Found' });
  }
}

function createApp() {
  return async (req, res) => {
    try {
      if (req.method === 'OPTIONS') return sendEmpty(res, 204);
      const url = new URL(req.url, 'http://localhost');
      const segments = url.pathname.split('/').filter(Boolean);
      if (url.pathname === '/api/status') return sendJson(res, 200, { status: 'online', timestamp: new Date().toISOString(), version: '1.2.0', service: 'Birth Hub 360 API', auth: 'enabled' });
      if (segments[0] === 'api' && segments[1] === 'auth') return handleAuth(req, res, segments.slice(2));
      if (segments[0] === 'api') {
        const context = requireAuth(req, res);
        if (!context) return;
        if (segments[1] === 'contacts') return handleContacts(req, res, segments.slice(2), context);
        if (segments[1] === 'deals') return handleDeals(req, res, segments.slice(2), context);
        if (segments[1] === 'ai') return handleAi(req, res, segments.slice(2), context);
        if (segments[1] === 'activities') return handleActivities(req, res, segments.slice(2), context);
        return sendJson(res, 404, { error: 'Not Found' });
      }
      return serveStatic(res, url.pathname);
    } catch (error) {
      console.error('Unhandled application error:', error);
      sendJson(res, error.statusCode || 500, { error: error.statusCode ? error.message : 'Internal Server Error' });
    }
  };
}

module.exports = createApp;
