'use strict';
var esprima = require('esprima');

//Generates an ast from esprima
var parse = function(code){
	return esprima.parse(code, {
		comment: true,
		attachComment: true
	});
};

//Traverses the AST and trys to figure out if Badtypes need to be assigned
var typeParse = function(ast){
	//TODO: Traverse the tree looking to see if comments can be added into types
	return ast;
};

//Looks to see if a comment is a bad type comment
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

var typeAssignment = function(){
	
};


var traverseAST = function(fn, node){
	if(!node){
		return;
	}

	fn(node);

	for (var key in node){
		var child = node[key];
		if(Array.isArray(child)){
			child.forEach(function(n){
				traverseAST(fn, n);
			});
		} else if(child != null && typeof child.type === 'string'){
			traverseAST(fn, child);
		}
	}
};

var isDeclarator = function(node){
	return node.type === 'VariableDeclarator';
};

var getDeclaratorType = function(node){
	var type = node.init.type;
	if(type === 'Literal'){
		var val = node.init.value;
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
}



module.exports.parse = parse;
module.exports.typeParse = typeParse;
module.exports.isBadtypeComment = isBadtypeComment;
module.exports.isBadtypeFunctionComment = isBadtypeFunctionComment;
module.exports.parseBadtypeComment = parseBadtypeComment;
module.exports.isBadtypeNewTypeComment = isBadtypeNewTypeComment;
module.exports.getBadType = getBadType;
module.exports.traverseAST = traverseAST;
module.exports.getDeclaratorType = getDeclaratorType;
