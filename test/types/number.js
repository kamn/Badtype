'use strict';
describe('Number', function(){

	describe('Assignment', function(){
		it('should detect a variable assignment of a number', function(){
			expect(false).to.be.true;
		});

		it('should detect reassignment to non-number in same scope', function(){
			expect(false).to.be.true;
		});

		it('should detect reassignment to non-number in sub function scope', function(){
			expect(false).to.be.true;
		});

		it('should detect reassignment to non-number in deep sub function scope', function(){
			expect(false).to.be.true;
		});
	});

	describe('Objects with Ints', function(){
		it('should be detected', function(){
			expect(false).to.be.true;
		});
	
		it('should detect reassignment', function(){
			expect(false).to.be.true;
		});
	});

	describe('Function Argument', function(){
		it('should detect an argument to be a number', function(){
			expect(false).to.be.true;
		});
	});

});
