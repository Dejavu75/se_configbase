const assert = require('node:assert/strict');
const test = require('node:test');
const pkg = require('../package.json');

test('mail uses the patched Nodemailer major and development runner stays explicit', () => {
  assert.equal(pkg.dependencies.nodemailer, '^10.1.4');
  assert.ok(pkg.devDependencies['ts-node-dev']);
  assert.equal(pkg.dependencies['ts-node-dev'], undefined);
  assert.equal(pkg.scripts.tsc, 'node node_modules/typescript/bin/tsc');
});

test('shared contracts resolve to the reviewed immutable revision', () => {
  assert.equal(pkg.dependencies.se_contractholder, 'git+https://github.com/Dejavu75/se_contractholder.git#8f5857b070a60efea1590783e64f2b6798d674d1');
});

test('the install lock preserves reviewed contracts and development-only tools', () => {
  const lock = require('../package-lock.json');
  assert.equal(lock.lockfileVersion, 3);
  assert.equal(lock.packages[''].dependencies.se_contractholder, pkg.dependencies.se_contractholder);
  const holder = lock.packages['node_modules/se_contractholder'];
  assert.equal(holder.resolved, 'git+ssh://git@github.com/Dejavu75/se_contractholder.git#8f5857b070a60efea1590783e64f2b6798d674d1');
  assert.match(holder.integrity, /^sha512-/);
  assert.equal(holder.dependencies.se_configbase, undefined);
  for (const name of ['typescript', 'ts-node-dev']) {
    assert.equal(lock.packages[`node_modules/${name}`].dev, true);
  }
});
