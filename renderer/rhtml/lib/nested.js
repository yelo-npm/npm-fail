var Tree = require('./tree')
,	Class = Tree.Class
,	is = Tree.is
,	map = Tree.map
,	isRenderable = Tree.isRenderable
;

var Children = Class(Tree,{
	STATIC:{
		map:map
	}
,	constructor:function(props){
		Children.Super.call(this);
		this._helpers = [];
		this._joinCharacter = ''
		this._propertyJoinSkin = '%2$s'
		this._skin = '%1$s%2$s';
		if(props){this.set(props);}
	}
,	get:function(prop){
		if(!arguments.length){return this._value;}
		if(!prop){return '';}
		if(this._helpers[prop]){
			return this._helpers[prop];
		}
		return false;
	}
,	set:function(prop,val){
		if(!arguments.length || prop.indexof('_')==0){return this;}
		if(arguments.length == 1){
			this._helpers.push(prop);
			return this;
		}
		this._helpers[prop] = val;
		return this;
	}
,	delete:function(prop){
		if(!arguments.length){this._helpers = [];}
		if(this._helpers[prop]){this._helpers.splice(prop,1);}
		return this;
	}
})

map.children = Children;

var Nested = Class(Tree,{
	STATIC:{
		map: map
	}
,	constructor:function(props){
		Nested.Super.call(this);
		this._helpers.children = new Children();
	}
,	addChild:function(n,child){
		if(!arguments.length){throw new Error('need at least 1 parameter');}
		if(arguments.length == 1){this.helpers.children.set(n);return this;}
		this._helpers.children.set(n,child);
		return this;
	}
,	removeChild:function(n){
		this._helpers.children.delete(n);
		return this;
	}
,	getChild:function(n){
		return this._helpers.children.get(n);
	}
,	children:function(){
		return this._helpers.children;
	}
});


map.nested = Nested

module.exports = Nested;