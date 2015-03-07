var p = require('../../src/parser');

console.log(p);

var program1 = 'var a = 5;';

console.log(p.parse(program1));
