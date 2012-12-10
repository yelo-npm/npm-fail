var Class = require('myclass')
,   is = require('is');
;

var map = {};

var createComposite = function(type,options){
	if(type instanceof Composite){
		return options ? type.feed(options) : type;
	}
	if(!(typeof type == 'string')){options = type; type = null;}
	if(!type){type = (options && options.type) ? options.type : 'default';}
	var className = (type in map)? map[type] : map['default'];
	var c = new className();
	c.set(options);
	return c;
}

var extend = function(target, other) {
	var args = Array.prototype.slice.call(arguments);
	target = args.shift();
	while(args.length){
		other = args.shift();
		if(!other || (other.length && other.length == 0)){continue;}
		for (var prop in other) {
			if (is.object(other[prop])){
				if(is.object(target[prop])){
		 			target[prop] = extend(target[prop], other[prop]);
		 		}else{
		 			target[prop] = other[prop];
		 		}
		 	}else if(is.array(target[prop])){
		 		if(is.array(target[prop])){
		 			target[prop] = target[prop].concat(other[prop]);
		 		}
		 		else{
		 			target[prop].push(other[prop]);
		 		}
			}else{
				target[prop] = source[prop];
			}
		}
	}
	return target;
}

var CompositeValidator = Class({
	constructor:function(){

	}
,	validate:function(){
		return true;
	}
})

var CompositePublisher = Class({
	constructor:function(comp){
		this._comp = comp;
		this._subscribers = [];
	}
,	notify:function(val,name){
		var s = this._subscribers, i = 0, l = s.length;
		if(l){
			for(i;i<l;i++){
				s[i](this._comp,val,name);
			}
		}
		return this._comp;
	}
,	subscribe:function(name,fn){
		if(!fn){fn = name; name == null;}
		var obj = this._comp.get(name,true);
		if(obj){
			obj.publisher()._subscribers.push(fn);
		}
		return this._comp;
	}
});
CompositePublisher.prototype.on = CompositePublisher.prototype.subscribe;

var CompositeIterator = Class({
	constructor:function(comp){
		this._comp = comp;
		this._subs = [];
		this._index = 0;
		for(var n in comp){
			if(n.indexOf('_') == 0){continue;}
			if(comp.hasOwnProperty(n)){
				this._subs.push(n);
			}
		}
	}
,	next:function(){
		if(this._index + 1<=this._subs.length){this._index++;}
		return this;
	}
,	previous:function(){
		if(this._index - 1>=-1){this._index--;}
		return this;
	}
,	current:function(asObject){
		return this.get(this._index);
	}
,	reset:function(){
		this._index = 0;
	}
,	remove:function(name){
		if(is(name,String)){
			name = this._subs.indexOf(name);
		}
		if(name>=0){
			this._subs = this._subs.splice(name,1);
		}
		this.reset();
		return this;
	}
,	last:function(){
		return this._subs[this._subs.length-1];
	}
,	first:function(){
		return this._subs[0];
	}
,	index:function(){
		return this._index;
	}
,	length:function(){
		return this._subs.length;
	}
,	get:function(index,asObject){
		if(arguments.length){
			if(this._subs[index]){
				return asObject ? this._comp[this._subs[index]] : this._comp[this._subs[index]].get();
			}
		}
		return null;
	}
});

var isAllowed = function(name){
	if(!name || name.match(Composite.restricted)){return false;}
	return true;
}

var propAllowed = function(obj,name,force){
	var permissive = obj._allowUnitializedProperties || force;
	return isAllowed(name) && (permissive || name in obj);
}

var setCompositeProperty = function(parent,name,type,options){
	var c = Composite.create(type,options);
	c._parent = parent;
	c._name = name;
	parent[name] = c;
	return c;
}

var Composite = Class({
	STATIC:{
		map:map
	,	extend:extend
	,	delimiter:'.'
	,   create:createComposite
	,	restricted:/^setProperty$|^set$|^get$|^iterator$|^validator$|^publisher$|^visit$|^del$|^render$|^toString$|^_/
	,	isAllowed:isAllowed
	,	id:0
	,	meta:{}
	,	Class:Class
	}
,   constructor:function(){
		if (!(this instanceof Composite)){return new Composite();}
		this._value = null;
		this._uid = Composite.id++;
		this._defaultChild = 'default';
		this._meta = Composite.meta[this._uid] = {};
		this._allowUnitializedProperties = false;
	}
,   setProperty:function(name,type,options){
		if(is.object(name)){
			for(var n in name){
				this.setProperty(n,name[n]);
			}
			return this;
		}
		if(!isAllowed(name)){return this;}
		if(is(type,Object)){
			if(options && is(options,Object)){
				type = extend(type,options);
			}
			else{
				options = type;
				type = null;
			}
		}
		if(!this.hasOwnProperty(name)){
			setCompositeProperty(this,name,type,options);
		}else{
			if(is.string(this[name])){
				if(!type && (!options || !options.type)){
					type = this[name];
				}
				this[name] = setCompositeProperty(this,name,this[name],options);
			}
			this[name].set(type);
		}
		return this;
	}
,   set:function(name,opts){
		var n, prop;
		if(!opts){opts = name; name = null;}
		if(!opts){return this;}
		if(name && name.length && name!=="value"){
			if(prop = this.get(name,true)){
				prop.set(opts);	
			}
			return this;
		}
		if(is.object(opts)){
			for(n in opts){
				if(n == 'value'){
					this.set(opts[n]);
				}
				if(prop = this.get(n,true)){
					prop.set(opts[n]);	
				}
			}
			return this;
		}
		else if(opts instanceof Composite){
			for(n in opts){
				if(prop = this.get(n,true)){
					prop.set(opts[n].get());
				}
			}
			return this;
		}
		if(!this._meta.validator || this.validator().validate(opts,this._name)){
			this._value = opts;
			if(this._meta.publisher){
				this.publisher().notify(this._value,this._name);
			}
		}
		return this;
	}
,   get:function(name,asObj,bePermissive){
		if(name && name.length){
			if(!is(name,Array)){name = name.split(Composite.delimiter);}
			var n = name.shift();
			if(propAllowed(this,n,bePermissive)){
				if(!this.hasOwnProperty(n)){
					this[n] = setCompositeProperty(this,n,this._defaultChild);
				}
				else if(is.string(this[n])){
					this[n] = setCompositeProperty(this,n,this[n]);
				}
				return this[n].get(name,asObj,bePermissive);
			}
		}
		return asObj ? this : this._value;
	}
,	del:function(name,destroy){
		if(name===false){destroy = false;name=null;}
		if(name && name.length){
			if(!is(name,Array)){name = name.split(Composite.delimiter);}
			var n = name.shift();
			if(!isAllowed(n)){return this;}
			if(this.hasOwnProperty(n)){
				this[n].del(name,destroy);
			}
			return this;
		}
		var parent = this._meta.parent;
		if(parent){
			if(parent._meta.iterator){parent._meta.iterator.remove(this._name);}
		}
		if(destroy!==false){
			delete this._meta;
			delete Composite.meta[this._uid];
			for(var n in this){
				if(this.hasOwnProperty(n)){
					this[n] = null;
				}
			}
		}
		return this;
	}
,	publisher:function(publisher){
		if(!this._meta.publisher){this._meta.publisher = publisher || this._createPublisher();}
		return this._meta.publisher;
	}
,	_createPublisher:function(){
		return new CompositePublisher(this);
	}
,	iterator:function(iterator){
		if(!this._meta.iterator){this._meta.iterator = iterator || this._createIterator();}
		return this._meta.iterator
	}
,	_createIterator:function(){
		return new CompositeIterator(this);
	}
,	validator:function(validator){
		if(!this._meta.validator){this._meta.validator = validator || this._createValidator();}
		return this._meta.validator
	}
,	_createValidator:function(){
		return new CompositeValidator(this);
	}
,   render:function(refresh, max, recursions){
		var s, n, r;
		if(!is.defined(recursions)){recursions = 0;}
		if(max && recursions >= max){return '';}
		if(!this._meta.rendered || refresh){
			s = {};
			for(n in this){
				if(propAllowed(this,n) && (this[n] instanceof Composite)){
					r = this[n].render(refresh,max,recursions+1);
					if(!r){continue;}
					s[n] = (this._render_child(n,r));
				}
			}
			
			this._meta.rendered = this._render(s);
		}
		return this._meta.rendered;
	}
,	_render_child:function(name,result){
		return result;
	}
,	_render:function(children){
		var r = this._value ? this._value : '[no value]';
		var c = '';
		for(var n in children){
			c+=n+'='+children[n];
		}
		if(c){
			c = '{'+c+'}';
		}
		return r+c;
	}
,	visit:function(visitor,callback,res){
		if(callback && !is.function(callback)){
			res = callback || {};
			callback = null;
		}
		if(!res){res = {};}
		if(visitor && is(visitor,Function)){
			for(var n in this){
				if(this.hasOwnProperty(n) && isAllowed(n)){
					this[n].visit(visitor,null,res);
				}
			}
			visitor(this, res);
			if(callback){callback(res);}
		}
		return res;
	}
,	toString:function(){
		return this.render();
	}
});

var Leaf = Class(Composite,{
	constructor:function(){
		Leaf.Super.call(this);
	}
,	setProperty:function(){
		return this;
	}
,	set:function(name,opts){
		if(!opts){opts = name; name = null;}
		this._value = opts;
	}
,	get:function(name,asObj,bePermissive){
		return asObj ? this : this._value;
	}
,	render:function(refresh){
		if(!this._meta.rendered || refresh){
			this._meta.rendered = this._render();
		}
		return this._meta.rendered;
	}
,	_render:function(){
		return this._value.toString();
	}
});

map.default = Composite;
map.Composite = Composite;
map.Leaf = Leaf;
module.exports.Composite = Composite;
module.exports.CompositeIterator = CompositeIterator;
module.exports.CompositePublisher = CompositePublisher;