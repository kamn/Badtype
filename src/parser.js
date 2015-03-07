var esprima = require('esprima');

//Generates an ast from esprima
var parse = function(code){
	return esprima.parse(code);
};

//Traverses the AST and trys to figure out if Badtypes need to be assigned
var typeParse = function(ast){
	//TODO: Traverse the tree looking to see if comments can be added into types
	return ast;
};

//Looks to see if a comment is a bad type comment
var isBadtypeComment = function(str){
	//TODO: Check that the string starts with //:!
	return str.indexOf('//:!') === 0
};

//NOTE: example comment
//:! (Number, String, Function) -> Object
//:! (Num, Str, Fn) -> Obj
//Checks if it s a function type definition
var isBadtypeFunctionComment = function(str){
	return false;
};

//Note: Example comment
//:! data PosNum = 0..

var isBadtypeNewTypeComment = function(str){
	return false;
};




module.exports.parse = parse;
module.exports.typeParse = typeParse;
module.exports.isBadtypeComment = isBadtypeComment;
