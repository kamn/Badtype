#! /usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var badtype = require('./src/parser');

//TODO: Take a list of files or folder

var file = process.argv[2];

var filepath = path.join(__dirname, file);

var data = fs.readFileSync(filepath);

var parsed = badtype.typeParse(data);

badtype.typeCheckParse(parsed, []);
