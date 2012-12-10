var E = require('./nestedElement');

var Style = E.Class(E,{
	constructor:function(attrs){
		Style.Super.call(this,attrs);
	}
,	_defaultPropToString:function(prop,value){
		return prop+':'+value;
	}
,	_defaultPropJoin:function(attrs){
		attrs.join(';');
	}
})

module.exports = Style;