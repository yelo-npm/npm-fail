var is = require('../is')
,	E = require('./nestedElement')
,	Attributes = require('./attributes')
,	Style = require('./style')
;

var XmlElement = E.Class(E,{
	STATIC:{
		RegisteredConstructors: {}
	,	RegisterConstructor:function(name,classObj){
			XmlElement.RegisteredConstructors[name] = classObj;
		}
	}
,	constructor:function(tag,attrs){
		if(is.object(tag)){
			attrs = tag;
			tag = null;
		}
		if(!tag){tag = this._defaultTag(attrs);}
		XmlElement.Super.call(this,attrs);
		this.tag(tag);
		this._attributes.children = [];
	}
,	addChild:function(tag,props){
		var c
		,	def = this._defaultChild(tag, props);
		if(is.string(tag)){
			def = XmlElement.RegisteredConstructors[tag];
		}
		c = new def(tag,props);
		return this._attributes.children.push(c);
	}
,	getChildAt:function(n){
		return this._attributes.children[n];
	}
,	children:function(){
		return this._attributes.children;
	}
,	children_toString:function(){
		var c = this._attributes.children
		,	l = c.length
		,	i = 0
		,	str = []
		;
		for(i;i<l;i++){
			str.push(c[i].toString());
		}
		return str.join('');
	}
,	tag:function(tag){
		if(arguments.length){
			this._attributes.tag = tag;
			return this;
		}
		return this._attributes.tag || '';
	}
,	tag_toString:function(){
		return this._attributes.tag || '';
	}
,	attr:function(prop,value){
		var l = arguments.length;
		if(!this._attributes.attributes){
			this._attributes.attributes = new Attributes();
		}
		if(!l){return this._attributes.attributes};
		if(l==1){
			if(is.object(prop)){
				this._attributes.attributes.props(prop);
				return this;
			}
			return this._attributes.attributes.prop(prop);
		}
		this._attributes.attributes.prop(prop,value);
		return this;
	}
,	text:function(text){
		if(arguments.length){
			this._attributes.text = text;
			return this;
		}
		return this._attributes.text || '';
	}
,	text_toString:function(){
		return this._attributes.text || '';
	}
,	toString:function(){
		var str = ''
		,	tag = this.tag_toString()
		;
		if(tag){
			str =  [];
			for(var n in this._attributes){
				if(n=='tag' || n=='children' || n=='text'){continue;}
				str.push(this.propToString(n));
			}
			str = '<'+tag+(str.length?' '+this._defaultPropJoin(str):'')+'>';
		}
		str+=this.text_toString()+this.children_toString();
		if(tag){
			str+='</'+tag+'>';
		}
		return str;
	}
,	_defaultPropToString:function(prop,value){
		return prop+'="'+value+'"';
	}
,	_defaultPropJoin:function(attrs){
		return attrs.join(' ');
	}
,	_defaultTag:function(){
		return 'element';
	}
,	_defaultChild:function(tag,props){
		return XmlElement;
	}
})

module.exports = XmlElement;