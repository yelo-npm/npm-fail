var E = require('./nestedElement')
,	Style = require('./style')
;

var Attributes = E.Class(E,{
	constructor:function(attrs){
		Attributes.Super.call(this,attrs);
	}
,	prop:function(prop,value){
		if(prop == 'class'){prop = 'classes';}
		return Attributes.Super.prototype.prop.apply(this,E.toArgs(arguments));
	}
,	style:function(prop,value){
		var l = arguments.length;
		if(!this._attributes.style){
			this._attributes.style = new Style();
		}
		if(!l){return this._attributes.style};
		if(l==1){
			if(is.object(prop)){
				this._attributes.style.props(prop);
				return this;
			}
			return this._attributes.style.prop(prop);
		}
		this._attributes.style.prop(prop,value);
		return this;
	}
,	class_toString:function(){
		return 'caca'
		//return this.classes().join(' ');
	}
,	classes:function(classes){
		if(!this._attributes['class']){this._attributes['class'] = [];}
		if(arguments.length){
			if(is.string(classes)){
				classes = classes.split(' ');
			}else if(arguments.length > 1){
				classes = Array.prototype.slice.call(arguments);
			}
			this._attributes['class'].concat(classes);
			return this;
		}
		return this._attributes['class'];
	}
,	_defaultPropToString:function(prop,value){
		if((prop=='checked' || prop=='selected') && !value){return '';}
		return prop+'="'+value+'"';
	}
})
Attributes.prototype['class'] = Attributes.prototype.classes;

module.exports = Attributes;