const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { Writable } = require('node:stream');
const nodemailer = require('nodemailer');

// Load the shipped helper without reading configuration or opening log files.
function fixture() {
  const sent = [];
  const mailConfig = { from: 'sender@example.invalid', auth: { user: 'auth@example.invalid' } };
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const output = new Writable({ write(_chunk, _encoding, done) { done(); } });
  const exports = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../build/controllers/con_log.js'), 'utf8'), {
    exports, console, require(name) {
      if (name === 'fs') return { createWriteStream: () => output };
      if (name === './conf_default_config') return {
        getLocalDirConfig: () => ({ logdir: 'unused', logfile: 'out', errorfile: 'err' }),
        getMailConfig: () => mailConfig
      };
      if (name === 'nodemailer') return { createTransport: () => ({ async sendMail(options) {
        sent.push(options);
        if (options.subject === 'synthetic-failure') throw new Error('synthetic transport failure');
        const info = await transport.sendMail(options);
        sent.push(info);
        return { ...info, response: 'synthetic accepted' };
      } }) };
      return require(name);
    }
  }, { filename: 'con_log.js' });
  return { mail: exports.AgesLog, sent };
}

test('default sender and no attachments retain the success-string API', async () => {
  const { mail, sent } = fixture();
  assert.equal(await mail.sendMail('to@example.invalid', 'synthetic', 'hello'), 'Correo enviado: synthetic accepted');
  assert.equal(sent[0].from, 'sender@example.invalid');
  assert.equal(Object.hasOwn(sent[0], 'attachments'), false);
  assert.match(sent[1].message.toString(), /hello/);
});

test('explicit address and display name retain sender selection', async () => {
  const { mail, sent } = fixture();
  await mail.sendMail('to@example.invalid', 'synthetic', 'hello', '', '', 'override@example.invalid');
  assert.equal(sent[0].from, 'override@example.invalid');
  await mail.sendMail('to@example.invalid', 'synthetic', 'hello', '', '', 'Fixture Display');
  assert.equal(sent[2].from, '"Fixture Display" <sender@example.invalid>');
});

test('two synthetic attachment payloads survive real Nodemailer composition', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ages-mail-test-'));
  // Keep scratch outside the checkout; operator cleanup is a separate action.
  const files = ['one.txt', 'two.txt'].map((name, index) => {
    const file = path.join(directory, name).replaceAll('\\', '/');
    fs.writeFileSync(file, `synthetic attachment ${index}`);
    return file;
  });
  const { mail, sent } = fixture();
  assert.equal(await mail.sendMail('to@example.invalid', 'synthetic', 'hello', ...files), 'Correo enviado: synthetic accepted');
  assert.equal(sent[0].attachments.length, 2);
  assert.equal(sent[0].attachments[0].filename, 'one.txt');
  assert.equal(sent[0].attachments[1].filename, 'two.txt');
  const message = sent[1].message.toString();
  for (let index = 0; index < 2; index++) {
    assert.ok(message.includes(Buffer.from(`synthetic attachment ${index}`).toString('base64')));
  }
});

test('transport rejection resolves the established error string', async () => {
  const { mail } = fixture();
  assert.equal(await mail.sendMail('to@example.invalid', 'synthetic-failure', 'hello'),
    'Error al enviar el correo:Error: synthetic transport failure');
});
