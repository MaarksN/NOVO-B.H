const { readStore, storagePath } = require('../data/jsonStore');

module.exports = {
  storagePath,
  async authenticate() {
    await readStore();
  },
  async sync() {
    await readStore();
  }
};
