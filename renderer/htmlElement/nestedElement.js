var is = require('../is')
,	Class = require('../myclass')
;

var NestedElement = Class({
	constructor:function(props){
		this._attributes = {};	
		if(props){
			this.props(props);
		}
	}
,	prop:function(prop,value){
		if(is.function(this[prop])){
			if(arguments.length > 1){return this[prop].apply(this,NestedElement.toArgs(arguments));}
			return this[prop]();
		}else if(arguments.length > 1){
			this._attributes[prop] = value;
			return this;
		}
		return this._propibutes[prop] || null;
	}
,	props:function(props){
		var obj,n;
		for(n in props){
			obj = props[n];
			if(this[n] && this[n] instanceof NestedElement){
				if(is.object(obj)){
					this[n].props(obj);
				}
			}else if(is.function(this[n])){
				this[n](obj);
			}else{
				this._attributes[n] = obj;
			}
		}
		return this;
	}
,	propToString:function(prop){
		console.log(prop+'_toString');
		if(this[prop+'_toString']){
			console.log(prop);
			return this[prop+'_toString']();
		}
		else if(this._attributes[prop] && this._attributes[prop] instanceof NestedElement){
			return this._attributes[prop].toString();
		}
		else if(this._attributes[prop]){
			return this._defaultPropToString(prop,this._attributes[prop]);
		}
		return '';
	}
,	toString:function(){
		var str = [];
		for(var n in this._attributes){
			str.push(this.propToString(n));
		}
		return this._defaultPropJoin(str);
	}
,	_defaultPropToString:function(prop,value){
		return prop+':"'+value+'"';
	}
,	_defaultPropJoin:function(props){
		return props.join(' ');
	}
,	data:function(){
		return this._attributes;
	}
})
NestedElement.Class = Class;
NestedElement.is = is;
NestedElement.toArgs = function(args){
	return Array.prototype.slice.call(args);
}
module.exports = NestedElement;