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

	it('should detect a badtype function', function(){
		var val = parser.isBadtypeFunctionComment(':! (Number, String) -> Boolean');
		expect(val).to.be.true;
	});

	it('should get args from function (simple)', function(){
		var args = parser.getFnArgs2('(Number, String) -> Boolean');
		expect(args).to.eql(['Number', 'String']);
	});

	it('should get args from function (with function)', function(){
		var args = parser.getFnArgs2('((Number) -> String, String) -> Boolean');
		expect(args).to.eql(['(Number)->String', 'String']);
	});

	it('should get args from function (with another function)', function(){
		var args = parser.getFnArgs2('((Number, String) -> Boolean, String) -> Boolean');
		expect(args).to.eql(['(Number, String)->Boolean', 'String']);
	});

	describe('Travere', function(){
		it('should traverse the tree', function(){
			var ast = parser.parse('var a = 5;');
			var spy = sinon.spy();
			parser.traverseAST(spy, ast);

			expect(spy.callCount).to.equal(13);
		});

		


		it('should traverse a tree and not fail on null', function(){
			var ast = parser.typeParse('var a = 1; var b = "2"; var c = {}');
			ast = parser.getBlockVars(ast, {});
			//expect(parser.traverseAST).to.not.throw();
			//parser.traverseAST(spy, ast);
			//console.log(JSON.stringify(ast, null, 4));
			});

		it('should traverse a tree and test', function(){
			//var ast = parser.typeParse('var a = 1; a = "b";');
			//var ast = parser.typeParse('function(){ var f = [], a = 5; \n var b = "z"; }');
			//expect(parser.traverseAST).to.not.throw();
			//parser.traverseAST(spy, ast);
			//console.log(spy.callCount);
			//expect(spy.callCount).to.equal(25);
			//console.log(JSON.stringify(ast, null, 4));
			});

});

	describe('Auto-detection', function(){
		it('should detect a Number', function(){
			var ast = parser.parse('var a = 5');
			var declarator = ast.body[0].declarations[0];

			var type = parser.getDeclaratorTypeFromInit(declarator);
			expect(type).to.equal('Number');
		});

		it('should detect a String', function(){
			var ast = parser.parse('var a = "a"');
			var declarator = ast.body[0].declarations[0];

			var type = parser.getDeclaratorTypeFromInit(declarator);
			expect(type).to.equal('String');

		});

		it('should detect a Boolean', function(){
			var ast = parser.parse('var a = true;');
			var declarator = ast.body[0].declarations[0];

			var type = parser.getDeclaratorTypeFromInit(declarator);
			expect(type).to.equal('Boolean');
		});


		it('should detect a Object', function(){
			var ast = parser.parse('var a = {}');
			var declarator = ast.body[0].declarations[0];

			var type = parser.getDeclaratorTypeFromInit(declarator);
			expect(type).to.equal('Object');
		});

		it('should detect an Array', function(){
			var ast = parser.parse('var a = []');
			var declarator = ast.body[0].declarations[0];

			var type = parser.getDeclaratorTypeFromInit(declarator);
			expect(type).to.equal('Array');
		});

		it('should detect a Function', function(){
			var ast = parser.parse('var a = function(){}');
			var declarator = ast.body[0].declarations[0];

			var type = parser.getDeclaratorTypeFromInit(declarator);
			expect(type).to.equal('Function');
		});

	});


	describe('Re-assignments', function(){

		it('should ignore valid assignments', function(){
			var ast = parser.typeParse('var a = 1; a = 5;');
			expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
		});

		it('should detect a variable is being reassigned to another type', function(){
			var ast = parser.typeParse('var a = 1; a = "b";');
			expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
		});

		it('should detect a variable in parent scope being reassigned', function(){
			var ast = parser.typeParse('var a = 1; function test(){ a = "b"}');
			expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();

		});

		it('should allow a variable with same name in sub scope to be different type', function(){
			var ast = parser.typeParse('var a = 1; function test(){ var a = "b"; a = "c"}');
			expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
		});

		it('should detect wrong assignment is deep sub functions', function(){
			var ast = parser.typeParse('var a = 1; function test(){ var b = "a"; function c(){  a = "B";}}');
			expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
		});
	});

	describe('Expressions', function(){

		describe('(-)', function(){
			it('should accept valid numeric operations', function(){
				var ast = parser.typeParse('var a = 1; a = a - 1;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid numeric operations', function(){
				var ast = parser.typeParse('var a = 1; a = a - "1";');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
	
			it('should accept valid numeric operations between two vars', function(){
				var ast = parser.typeParse('var a = 1; var b = 2; a = a - b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid numberi ops between vars', function(){
				var ast = parser.typeParse('var a = 1; var b = "2"; a = a - b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
	
			it('should detect valid, multi ops', function(){
				var ast = parser.typeParse('var a = 1; a = a - 1 - 2 - 3;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid, multi ops', function(){
				var ast = parser.typeParse('var a = 1; a = a - 1 - 2 - 3 - "4";');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});

			it('should allow valid, multi ops with vars', function(){
				var ast = parser.typeParse('var a = 1; var b = 2; a = a - 1 - b - 3;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});

			it('should detect invalid, multi ops with vars', function(){
				var ast = parser.typeParse('var a = 1; var b = "4"; a = a - 1 - 2 - 3 - b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
		});
		describe('(*)', function(){
			it('should accept valid numeric operations', function(){
				var ast = parser.typeParse('var a = 1; a = a * 1;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid numeric operations', function(){
				var ast = parser.typeParse('var a = 1; a = a * "1";');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
	
			it('should accept valid numeric operations between two vars', function(){
				var ast = parser.typeParse('var a = 1; var b = 2; a = a * b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid numberi ops between vars', function(){
				var ast = parser.typeParse('var a = 1; var b = "2"; a = a * b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
	
			it('should detect valid, multi ops', function(){
				var ast = parser.typeParse('var a = 1; a = a * 1 * 2 * 3;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid, multi ops', function(){
				var ast = parser.typeParse('var a = 1; a = a * 1 * 2 * 3 * "4";');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});

			it('should allow valid, multi ops with vars', function(){
				var ast = parser.typeParse('var a = 1; var b = 2; a = a * 1 * b * 3;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});

			it('should detect invalid, multi ops with vars', function(){
				var ast = parser.typeParse('var a = 1; var b = "4"; a = a * 1 * 2 * 3 * b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
		});
		describe('(/)', function(){
			it('should accept valid numeric operations', function(){
				var ast = parser.typeParse('var a = 1; a = a / 1;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid numeric operations', function(){
				var ast = parser.typeParse('var a = 1; a = a / "1";');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
	
			it('should accept valid numeric operations between two vars', function(){
				var ast = parser.typeParse('var a = 1; var b = 2; a = a / b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid numberi ops between vars', function(){
				var ast = parser.typeParse('var a = 1; var b = "2"; a = a / b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
	
			it('should detect valid, multi ops', function(){
				var ast = parser.typeParse('var a = 1; a = a / 1 / 2 / 3;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});
	
			it('should detect invalid, multi ops', function(){
				var ast = parser.typeParse('var a = 1; a = a / 1 / 2 / 3 / "4";');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});

			it('should allow valid, multi ops with vars', function(){
				var ast = parser.typeParse('var a = 1; var b = 2; a = a / 1 / b / 3;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.not.throw();
			});

			it('should detect invalid, multi ops with vars', function(){
				var ast = parser.typeParse('var a = 1; var b = "4"; a = a / 1 / 2 / 3 / b;');
				expect(parser.typeCheckParse.bind(parser, ast, [])).to.throw();
			});
		});
	});
});

