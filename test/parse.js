'use strict';
var parser = require('../src/parser');
var expect = require('chai').expect;
var sinon = require('sinon');


describe('Parser', function(){

	it('should detect a Badtype comment', function(){
		var val = parser.isBadtypeComment(':! Number');
		expect(val).to.be.true;
	});

	it('should get Badtype type', function(){
		var val = parser.getBadType(':! Number');
		expect(val).to.equal('Number');
	});

	it('should get Badtype with lots of spaces', function(){
		var val = parser.getBadType(':!    Number');
		expect(val).to.equal('Number');
	});

	describe('Travere', function(){
		it('should traverse the tree', function(){
			var ast = parser.parse('var a = 5;');
			var spy = sinon.spy();
			parser.traverseAST(spy, ast);

			//console.log(spy);
			expect(spy.callCount).to.equal(5);
			console.log(JSON.stringify(ast, null, 4));
		});
	});

});

