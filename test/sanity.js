'use strict';
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

describe('Mocha', function(){
	it('should have assert', function(){
		expect(assert).to.be.ok;
	});
});
