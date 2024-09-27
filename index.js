export function print() {
    console.log('Hello, World!');
  }

 
exports.sch_afip = require('./src/schemas/sch_config');
exports.prmsg = function (msg) {
    console.log(msg);
}