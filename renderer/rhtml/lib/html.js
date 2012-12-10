var Tree = require('./tree')
,	Nested = require('./nested')
,	XML = require('./xml')
,	Class = Tree.Class
,	is = Tree.is
,	map = Tree.map
,	isRenderable = Tree.isRenderable
;

var Style = Class(Tree,{
	STATIC:{
		map:map
	}
,	constructor:function(props){
		Style.Super.call(this);
		this._joinCharacter = ';'
		this._propertyJoinSkin = '%1$s:\'%2$s\''
		this._skin = '%3$s="%2$s"';
		if(props){this.set(props);}
	}
})

map.style = Style;

var Classes = Class(map.children,{
	STATIC:{
		map:map
	}
,	constructor:function(props){
		Classes.Super.call(this);
		this._joinCharacter = ' '
		this._skin = '%3$s="%2$s"';
		if(props){this.set(props);}
	}
})

map.classes = Classes;
map['class'] = Classes;

var Attributes = Class(map.attributes,{
	STATIC:{
		map:map
	}
,	constructor:function(props){
		Attributes.Super.call(this);
		this._helpers.style = false;
		this._helpers['class'] = false;
		if(props){this.set(props);}
	}	
})

map.htmlAttributes = Attributes;

var HTML = Class(XML,{
	STATIC:{
		map:map
	}
,	constructor:function(props){
		HTML.Super.call(this);
		this._helpers.attributes = false;
		this._tag = 'span';
		this._selfClosingSkin = ''
		if(props){this.set(props);}
	}
});


map.HTML = HTML;

module.exports = HTML;