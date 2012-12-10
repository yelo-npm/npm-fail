var is = require('is')
,	Class = require('myclass')
;

var isRenderable = function(obj){
	return obj && (obj instanceof Tree || (obj.render && is.function(obj.render)));
}



var Tree = Class({
	STATIC:{
		map:{}
	}
,	constructor:function(props){
		this._value = '';
		this._rendered = '';
		this._helpers = {};
		this._joinCharacter = '';
		this._propertyJoinSkin = '%key%= %value%'
		this._skin = '%value% %children% %key%';
		if(props){this.set(props);}
	}
,	get:function(prop){
		if(!arguments.length){return this._value;}
		if(!prop){return '';}
		if(this._helpers[prop]){
			return this._helpers[prop].get();
		}
		return false;
	}
,	set:function(prop,val){
		if(!arguments.length || prop.indexOf('_')==0){return this;}
		if(arguments.length == 1){
			if(is.object(prop)){
				for(var n in prop){
					this.set(n,prop[n]);
				}
				return this;
			}
			this._value = prop;
			return this;
		}
		if(!(prop in this)){this._helpers[prop] = new Tree();}
		if((prop in this) && !this[prop]){
			var className = Tree.map[prop] || Tree;
			this[prop] = new className();
		}
		this._helpers[prop].set(val);
		return this;
	}
,	delete:function(prop){
		if(!arguments.length){this.value = '';}
		else if(prop in this._helpers){this._helpers[prop].delete();}
		return this;
	}
,	render:function(refresh,myKey){
		if(!this._rendered || refresh){
			myKey = myKey || ('getKey' in this ? this.getKey() : '');
			var s = {value:this._value,key:myKey}
			,	h = this._helpers
			,	n
			;
			for(n in h){
				if(n.indexOf('_')==0){continue;}
				s[n] = isRenderable(h[n]) ?
					h[n].render(refresh,n)
					:
					(h[n]!==false && h[n]!==null && (typeof h[n])!=='undefined') ? 
						print(this._propertyJoinSkin,{key:n,value:h[n].toString()})
						:
						''
				;
			}
			if(!s.length){
				this._rendered = print(this._skin,{value:this._value,key:myKey})
			}
			for(n in s){

			}
			this._rendered = print(this._skin,{value:this._value,children:s,key:myKey});
		}
		return this._rendered;
	}
,	toString:function(){
		return this.render();
	}
})

Tree.is = is;
Tree.Class = Class;
Tree.isRenderable = isRenderable;
Tree.print = print;
Tree.map.tree = Tree;

module.exports = Tree;