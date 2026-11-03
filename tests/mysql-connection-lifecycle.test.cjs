const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');

function fixture() {
  const connections = [];
  const logs = [];
  class FakeConnection extends EventEmitter {
    constructor(config) {
      super(); this.config = config; this.queries = [];
    }
    query(sql, parameters, callback) {
      this.queries.push({ sql, parameters, callback });
    }
  }
  const exports = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../build/modules/mod_dataaccess.js'), 'utf8'), {
    exports, console: { log() {}, error(...args) { logs.push(args); } },
    require(name) {
      if (name === 'mysql2') return { createConnection(config) {
        const connection = new FakeConnection(config);
        connections.push(connection);
        return connection;
      } };
      if (name === '../controllers/conf_default_config') return {
        getMSConfig: () => ({ mscode: 'fixture', msinstance: 'one', msdb: 'fixture_db' }),
        getMySQLConfig: () => ({ host: '127.0.0.1', user: 'fixture', password: 'unused-synthetic-value' })
      };
      if (name === './mod_dataupdater') return { mod_dataupdater: class {} };
      throw new Error('Unexpected fixture dependency: ' + name);
    }
  }, { filename: 'mod_dataaccess.js' });
  return { ...exports, connections, logs };
}

test('both raw factories handle idle fatal errors without exposing driver details', () => {
  for (const factory of ['obtenerConexion', 'obtenerConfigBase']) {
    const f = fixture(); const model = new f.mod_dataaccess();
    const connection = model[factory](false);
    const failure = Object.assign(new Error('synthetic driver details must not be logged'), { fatal: true });
    assert.doesNotThrow(() => connection.emit('error', failure));
    assert.doesNotThrow(() => connection.emit('error', failure));
    assert.equal(f.isConnectionUsable(connection), false);
    assert.equal(f.connections.length, 1);
    assert.equal(connection.queries.length, 0);
    assert.equal(f.logs.length, 1);
    assert.equal(JSON.stringify(f.logs).includes(failure.message), false);
    assert.equal(JSON.stringify(f.logs).includes(connection.config.password), false);
  }
});

test('a generic cache is replaced lazily after idle failure, without poisoning other instances', () => {
  const f = fixture(); const first = new f.mod_dataaccess_generico(); const second = new f.mod_dataaccess_generico();
  const failed = first.obtenerConexionado(false);
  const other = second.obtenerConexionado(false);
  assert.doesNotThrow(() => failed.emit('error', Object.assign(new Error('idle'), { fatal: true })));
  assert.equal(f.connections.length, 2);
  const replacement = first.obtenerConexionado(false);
  assert.notEqual(replacement, failed);
  assert.equal(second.obtenerConexionado(false), other);
  assert.doesNotThrow(() => failed.emit('error', Object.assign(new Error('late idle'), { fatal: true })));
  assert.equal(first.obtenerConexionado(false), replacement);
  assert.equal(f.isConnectionUsable(replacement), true);
  assert.equal(f.connections.length, 3);
  assert.equal(failed.queries.length, 0);
});

test('a failed in-flight write rejects once and is never automatically replayed', async () => {
  const f = fixture(); const model = new f.mod_dataaccess_generico();
  const operation = model.crearDatos('items', { value: 7 });
  const connection = f.connections[0]; const failure = Object.assign(new Error('uncertain write'), { fatal: true });
  let rejected = 0;
  const settled = operation.then(() => assert.fail('failed write resolved'), error => {
    rejected += 1; assert.equal(error, failure);
  });
  assert.doesNotThrow(() => connection.emit('error', failure));
  connection.queries[0].callback(failure);
  await settled;
  assert.equal(rejected, 1);
  assert.equal(connection.queries.length, 1);
  assert.equal(f.connections.length, 1);
  const replacement = model.obtenerConexionado(true);
  assert.notEqual(replacement, connection);
  assert.equal(replacement.queries.length, 0);
  assert.equal(connection.queries.length, 1);
});

test('normal connection identity, options and successful write results remain unchanged', async () => {
  const f = fixture(); const model = new f.mod_dataaccess_generico('fixture', 'one', 'owned_db');
  const connection = model.obtenerConexionado(true);
  assert.equal(model.obtenerConexionado(true), connection);
  assert.equal(connection.config.database, 'owned_db');
  assert.equal(connection.config.multipleStatements, true);
  const operation = model.crearDatos('items', { value: 7 });
  const result = { insertId: 42, affectedRows: 1 };
  assert.equal(connection.queries.length, 1);
  assert.equal(connection.queries[0].parameters[0], 7);
  connection.queries[0].callback(null, result);
  assert.equal(await operation, result);
  assert.equal(model.obtenerConexionado(false), connection);
  const base = new f.mod_dataaccess();
  assert.equal(base.obtenerConexion().config.multipleStatements, false);
  assert.equal(base.obtenerConfigBase(false).config.multipleStatements, true);
});

test('an ended cached connection is replaced on the next operation only', () => {
  const f = fixture(); const model = new f.mod_dataaccess_generico();
  const ended = model.obtenerConexionado(false);
  ended.emit('end');
  assert.equal(f.connections.length, 1);
  assert.equal(f.isConnectionUsable(ended), false);
  assert.notEqual(model.obtenerConexionado(false), ended);
  assert.equal(f.connections.length, 2);
});
