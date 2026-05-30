const fs = require('fs/promises');
const path = require('path');

const storagePath = process.env.JSON_STORAGE || path.join(__dirname, '..', '..', 'database.json');
const defaultData = {
  tenants: [],
  users: [],
  contacts: [],
  deals: [],
  activities: [],
  counters: { tenants: 0, users: 0, contacts: 0, deals: 0, activities: 0 }
};
let writeQueue = Promise.resolve();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeStore(data) {
  const normalized = { ...clone(defaultData), ...(data || {}) };
  normalized.counters = { ...defaultData.counters, ...(normalized.counters || {}) };

  for (const collectionName of ['tenants', 'users', 'contacts', 'deals', 'activities']) {
    normalized[collectionName] = Array.isArray(normalized[collectionName]) ? normalized[collectionName] : [];
    const maxId = normalized[collectionName].reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    normalized.counters[collectionName] = Math.max(Number(normalized.counters[collectionName]) || 0, maxId);
  }

  return normalized;
}

async function ensureStore() {
  try {
    await fs.access(storagePath);
  } catch {
    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    await fs.writeFile(storagePath, JSON.stringify(defaultData, null, 2));
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(storagePath, 'utf8');
  return raw.trim() ? normalizeStore(JSON.parse(raw)) : clone(defaultData);
}

async function writeStore(data) {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    await fs.writeFile(storagePath, JSON.stringify(normalizeStore(data), null, 2));
  });
  return writeQueue;
}

function now() {
  return new Date().toISOString();
}

function matchesWhere(item, where = {}) {
  return Object.entries(where).every(([key, value]) => String(item[key]) === String(value));
}

function createModel(collectionName) {
  return {
    async findAll(options = {}) {
      const data = await readStore();
      let rows = [...(data[collectionName] || [])];
      if (options.where) rows = rows.filter((item) => matchesWhere(item, options.where));
      return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    },

    async findOne(options = {}) {
      const rows = await this.findAll(options);
      return rows[0] || null;
    },

    async count(options = {}) {
      const rows = await this.findAll(options);
      return rows.length;
    },

    async bulkCreate(items) {
      const created = [];
      for (const item of items) created.push(await this.create(item));
      return created;
    },

    async create(item) {
      const data = await readStore();
      data[collectionName] ||= [];
      data.counters ||= {};
      data.counters[collectionName] = Number(data.counters[collectionName] || 0) + 1;
      const timestamp = now();
      const record = { id: data.counters[collectionName], ...item, createdAt: timestamp, updatedAt: timestamp };
      data[collectionName].push(record);
      await writeStore(data);
      return clone(record);
    },

    async findByPk(id, options = {}) {
      const data = await readStore();
      const record = (data[collectionName] || []).find((item) => String(item.id) === String(id) && matchesWhere(item, options.where));
      if (!record) return null;
      const hydrated = clone(record);
      hydrated.toJSON = () => clone(record);
      hydrated.update = async (updates) => {
        const latest = await readStore();
        const index = (latest[collectionName] || []).findIndex((item) => String(item.id) === String(id) && matchesWhere(item, options.where));
        if (index === -1) return null;
        latest[collectionName][index] = { ...latest[collectionName][index], ...updates, id: latest[collectionName][index].id, updatedAt: now() };
        await writeStore(latest);
        Object.assign(hydrated, clone(latest[collectionName][index]));
        hydrated.toJSON = () => clone(latest[collectionName][index]);
        return hydrated;
      };
      return hydrated;
    },

    async destroy({ where }) {
      const data = await readStore();
      const originalLength = (data[collectionName] || []).length;
      data[collectionName] = (data[collectionName] || []).filter((item) => !matchesWhere(item, where));
      await writeStore(data);
      return originalLength - data[collectionName].length;
    }
  };
}

module.exports = { createModel, readStore, writeStore, defaultData, normalizeStore, storagePath };
