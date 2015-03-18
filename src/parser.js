'use strict';
var esprima = require('esprima');

//Generates an ast from esprima

//:! data AST = Obj

//:! (String) -> AST
var parse = function(code){
	return esprima.parse(code, {
		comment: true,
		attachComment: true
	});
};

//Traverses the AST and trys to figure out if Badtypes need to be assigned
//:! (AST) -> AST
var typeParse = function(ast){
	var typeAST = parse(ast);
	traverseAST(typeAssignment, typeAST);
	return typeAST;
	//TODO: Traverse the tree looking to see if comments can be added into types
	//return ast;
};

//Looks to see if a comment is a bad type comment
//:! (String) -> Bool
var isBadtypeComment = function(str){
	//TODO: Check that the string starts with //:!
	return str.indexOf(':!') === 0;
};

//NOTE: example comment
//:! (Number, String, Function) -> Object
//:! (Num, Str, Fn) -> Obj
//Checks if it s a function type definition
var isBadtypeFunctionComment = function(str){
	return str;
};

//Note: Example comment
//:! data PosNum = 0..

var isBadtypeNewTypeComment = function(str){
	return str;
};


var isNotEmptyStr = function(str){
	return str !== '';
};

//Get the marked type
var getBadType = function(str){

	var split_str = str.split(' ').filter(isNotEmptyStr);
	//TODO: Find first ':!'

	return split_str[1];
};

//
var parseBadtypeComment = function(str){
	return str;
};

var typeAssignment = function(node){
	if(isDeclarator(node)){
		var type = getDeclaratorTypeFromInit(node);

		node.id.badtype = {
			type: type
		};
	}
};

var typeCheckParse = function(ast, prevBlocks){
	//Get a block level ast
	//prevBlocks are the previous scopes in an array

	//TODO: Get the blockVars
	var blockVars = getBlockVars(ast, {});
	//TODO: search prevBlocks for vars and functions out of scope
	prevBlocks.push(blockVars);

	var typeCheckFn = function(node){
		if(node.type === 'FunctionExpression' ||
			node.type === 'FunctionDeclaration'){
			//*
			var walk = function(n){
				traverseAST(typeCheckFn, n);
			}
;
			for (var key in node){
				if(node.hasOwnProperty(key)){
					var child = node[key];
					if(Array.isArray(child)){
						child.forEach(walk);
					} else if(child !== null && child !== undefined && typeof child.type === 'string'){
						walk(child)
					}
				}
			}//*/

			return false;
		}

		if(node.type === 'AssignmentExpression'){
			//Get object's identity
			var ident = node.left.name;

			//TODO: Search the chain
			var typeInfo = searchForVar(ident, prevBlocks);

			//Check type
			var type = getDeclaratorType(node.right);

			//Check type
			if(type !== typeInfo.id.badtype.type){
				throw Error('Mismatch');
			}
		}
	};

	traverseAST(typeCheckFn, ast);

	return true;
};

//
var searchForVar = function(ident, varBlocks){
	return varBlocks.reduce(function(r, x){
		return x[ident];
	}, undefined)
};

//:! (AST, Obj) -> Obj
var getBlockVars = function(ast, varObj){
	//TODO: Scan entire block.
	//TODO: Skip functions
	//TODO: Also I like the bect idea for lookup it's not the best idea...
	//TODO: Make a deep copy of the object and reset it after a set in the tree?
	//TODO: 

	var getBlockVariable = function(node){
		if(node.type === 'FunctionExpression' ||
			node.type === 'FunctionDeclaration'){
			return false;
		}

		if(node.type === 'VariableDeclarator'){
			var name = node.id.name;
			varObj[name] = node;
		}
	};

	traverseAST(getBlockVariable, ast);

	return varObj;
};

var traverseWithStack = function(){
	var stack = [];
	var walk = function(){
		stack.push(1);
	};
	walk();
};

//:! (Function, AST) -> ?
var traverseAST = function(fn, node){
	if(!node){
		return;
	}

	var cont = fn(node);

	var walk = function(n){
		traverseAST(fn, n);
	};

	//TODO: Have the function return true or false
	if(cont === false){
		return false;
	}

	for (var key in node){
		if(node.hasOwnProperty(key)){
			var child = node[key];
			if(Array.isArray(child)){
				child.forEach(walk);
			} else if(child !== null && child !== undefined && typeof child.type === 'string'){
				walk(child);
			}
		}
	}
};

//:! (AST) -> Bool
var isDeclarator = function(node){
	return node.type === 'VariableDeclarator';
};


var getDeclaratorTypeFromInit = function (node){
	return getDeclaratorType(node.init);
};

//:! (AST) -> String
var getDeclaratorType = function(node){
	var type = node.type;
	if(type === 'Literal'){
		var val = node.value;
		if(typeof val === 'number'){
			return 'Number';
		}else if(typeof val === 'string'){
			return 'String';
		}
	}else if(type === 'ObjectExpression'){
		return 'Object';
	}else if(type === 'ArrayExpression'){
		return 'Array';//Determine type?
	}else if(type === 'FunctionExpression'){
		return 'Function';//Determine type?
	}
};



module.exports.parse = parse;
module.exports.typeParse = typeParse;
module.exports.typeCheckParse = typeCheckParse;
module.exports.isBadtypeComment = isBadtypeComment;
module.exports.isBadtypeFunctionComment = isBadtypeFunctionComment;
module.exports.parseBadtypeComment = parseBadtypeComment;
module.exports.isBadtypeNewTypeComment = isBadtypeNewTypeComment;
module.exports.getBadType = getBadType;
module.exports.traverseAST = traverseAST;
module.exports.traverWithStack = traverseWithStack;
module.exports.getDeclaratorType = getDeclaratorType;
module.exports.getDeclaratorTypeFromInit = getDeclaratorTypeFromInit;
module.exports.getBlockVars = getBlockVars;
