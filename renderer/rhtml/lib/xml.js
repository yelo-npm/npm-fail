var Tree = require('./tree')
,	Nested = require('./nested')
,	Class = Tree.Class
,	is = Tree.is
,	map = Tree.map
,	isRenderable = Tree.isRenderable
;

var Attributes = Class(Tree,{
	STATIC:{
		map:map
	}
,	constructor:function(props){
		Attributes.Super.call(this);
		this._joinCharacter = ' '
		this._propertyJoinSkin = '%1$s="%2$s"'
		this._skin = '%1$s %2$s';
		if(props){this.set(props);}
	}
});

map.attributes = Attributes;

var XML = Class(Nested,{
	STATIC:{
		map: map
	}
,	constructor:function(tag,props){
		XML.Super.call(this);
		this._joinCharacter = ' '
		this._propertyJoinSkin = '%2$s'
		this._skin = '<%3$s %1$s>%2$s</%3$s>';
		this._selfClosingSkin = '<%3$s %1$s/>%2$s';
		this._tag = 'element';
		if(props){this.set(props);}
	}
,	getKey:function(){
		return this._tag;
	}
,	tag:function(tag){
		if(arguments.length){
			this._tag = tag;
			return this;
		}
		return this._tag;
	}
})

map.xml = XML;

module.exports = XML;