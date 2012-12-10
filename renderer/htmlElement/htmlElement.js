var is = require('../is')
,	E = require('./nestedElement')
,	Attributes = require('./attributes')
,	Style = require('./style')
,	XmlElement = require('./xmlElement')
;

var HtmlElement = E.Class(XmlElement,{
	constructor:function(tag,attrs){
		HtmlElement.Super.call(this,tag,attrs);
	}
,	style:function(prop,value){
		var l = arguments.length
		,	attr = this.attr()
		;
		if(!l){return attr.style();};
		if(l==1){
			attr.style(prop)
		}
		attr.style(prop,value);
		return this;
	}
,	classes:function(classes){
		var l = arguments.length
		,	attr = this.attr()
		;
		if(!l){return attr.classes();};
		if(l==1){
			attr.classes(prop)
		}
		attr.classes(prop,value);
		return this;
	}
,	_defaultTag:function(){
		return 'span';
	}
,	_defaultChild:function(tag,props){
		return HtmlElement;
	}
})

HtmlElement.Attributes = require('./attributes');
HtmlElement.Style = require('./style');
HtmlElement.NestedElement = require('./nestedElement');
HtmlElement.XmlElement = require('./xmlElement');

module.exports = HtmlElement;