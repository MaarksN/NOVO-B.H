require('./loadEnv');

const http = require('http');
const createApp = require('./app');
const initDb = require('./initDb');

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();
  const server = http.createServer(createApp());
  server.listen(PORT, () => {
    console.log(`Birth Hub 360 running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Unable to start Birth Hub 360:', error);
  process.exit(1);
});
