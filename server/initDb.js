const datastore = require('./config/database');
const Contact = require('./models/Contact');
const Deal = require('./models/Deal');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const { hashPassword } = require('./security/passwords');

const DEFAULT_TENANT_ID = 'birthhub-demo';
const DEFAULT_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'ana@birthhub.com';
const DEFAULT_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || '123456';

function withTenant(record) {
  return { tenantId: DEFAULT_TENANT_ID, ...record };
}

async function ensureLegacyRowsHaveTenant(model) {
  const rows = await model.findAll();
  for (const row of rows) {
    if (!row.tenantId) {
      const persisted = await model.findByPk(row.id);
      await persisted.update({ tenantId: DEFAULT_TENANT_ID });
    }
  }
}

async function initDb() {
  try {
    await datastore.authenticate();
    console.log('Datastore connection established.');

    await datastore.sync();
    console.log('Datastore synced.');

    const tenant = await Tenant.findOne({ where: { tenantId: DEFAULT_TENANT_ID } });
    if (!tenant) {
      console.log('Seeding default tenant...');
      await Tenant.create({ tenantId: DEFAULT_TENANT_ID, name: 'Birth Hub 360 Demo', plan: 'demo' });
    }

    const admin = await User.findOne({ where: { email: DEFAULT_ADMIN_EMAIL } });
    if (!admin) {
      console.log('Seeding default admin user...');
      await User.create({
        tenantId: DEFAULT_TENANT_ID,
        name: 'Ana Silva',
        email: DEFAULT_ADMIN_EMAIL,
        role: 'admin',
        passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD)
      });
    }

    await ensureLegacyRowsHaveTenant(Contact);
    await ensureLegacyRowsHaveTenant(Deal);

    const contactCount = await Contact.count({ where: { tenantId: DEFAULT_TENANT_ID } });
    if (contactCount === 0) {
      console.log('Seeding initial contacts...');
      await Contact.bulkCreate([
        withTenant({ name: 'Bruno Alves', company: 'InovaTech', owner: 'Ana', email: 'bruno@inovatech.com' }),
        withTenant({ name: 'Carla Dias', company: 'SoftSolutions', owner: 'Ana', email: 'carla@softsolutions.com' }),
        withTenant({ name: 'Roberto Lima', company: 'AgroData', owner: 'Carlos', email: 'roberto@agrodata.com' })
      ]);
    }

    const dealCount = await Deal.count({ where: { tenantId: DEFAULT_TENANT_ID } });
    if (dealCount === 0) {
      console.log('Seeding initial deals...');
      await Deal.bulkCreate([
        withTenant({ title: 'Implantação na Empresa Alfa', value: 75000, stage: 'qualificacao', owner: 'Ana', company: 'Empresa Alfa' }),
        withTenant({ title: 'Consultoria de Processos', value: 50000, stage: 'qualificacao', owner: 'Ana', company: 'Beta Corp' }),
        withTenant({ title: 'Expansão de Contrato', value: 90000, stage: 'demonstracao', owner: 'Ana', company: 'InovaTech' }),
        withTenant({ title: 'Licença Premium', value: 12000, stage: 'ganho', owner: 'Ana', company: 'StartUp Z' })
      ]);
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Unable to connect to the datastore:', error);
    throw error;
  }
}

module.exports = initDb;
