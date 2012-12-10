var Composite = require('./composite').Composite
,	CompositeIterator = require('./composite').CompositeIterator
,	CompositePublisher = require('./composite').CompositePublisher
,	Class = Composite.Class
,	is = Composite.is
;


var Classes = Class(Composite, {
	constructor:function(){
		Classes.Super.call(this);
		this._value = [];
	}
,	set:function(name,opts){
		if(!opts){opts = name; name = null;}
		this.add(opts);
	}
,	add:function(className){
		this._value = this._value.concat(className);
		return this;
	}
,	remove:function(className){
		if(is.array(className)){
			for(var i = 0; i<className.length; i++){
				this.remove(className[i]);
			}
			return this;
		}
		var i = this._value.indexOf(className);
		if(i>=0){
			this._value.splice(i,1);
		}
		return this;
	}
,	_render:function(children){
		return this._value.join(' ').trim();
	}	
});
Composite.map.Classes = Classes;

var Style = Class(Composite, {
	constructor:function(){
		Style.Super.call(this);
	}
,	_render_child:function(name,result){
		return name+':'+result;
	}
,	_render:function(children){
		var r = [];
		for(var n in children){
			r.push(children[n]);
		}
		return r.join(';');
	}	
});
Composite.map.Style = Style;

var TextProperty = Class(Composite.map.Leaf, {
	constructor:function(){
		TextProperty.Super.call(this);
	}
,	_render:function(children){
		return this._value;
	}
,	_isSelfClosing:function(){
		return false;
	}
});
Composite.map.TextProperty = TextProperty;

var Tag = Class(Composite.map.Leaf, {
	constructor:function(){
		Tag.Super.call(this);
		this._value = 'span';
	}
,	_render:function(children){
		return this._value.toLowerCase();
	}
});
Composite.map.Tag = Tag;

var XMLProperties = Class(Composite, {
	constructor:function(){
		XMLProperties.Super.call(this);
		this.classes = 'Classes';
		this.style = 'Style';
		this._allowUnitializedProperties = true;
		this._defaultChild = 'TextProperty';
	}
,	_render_child:function(name,result){
		if(name == 'classes'){name = 'class';}
		return name+'="'+result+'"';
	}
,	_render:function(children){
		var r = [];
		for(var n in children){
			r.push(children[n]);
		}
		return r.join(' ');
	}
});
Composite.map.XMLProperties = XMLProperties;

var XMLChildren = Class(Composite,{
	constructor:function(){
		XMLChildren.Super.call(this);
		this._defaultChild = 'XML';
		this._value = [];
	}
,	set:function(name,opts){
		if(!opts){opts = name; name = null;}
		this.add(opts);
	}
,	add:function(className){
		this._value = this._value.concat(className);
		return this;
	}
,	remove:function(className){
		if(is.array(className)){
			for(var i = 0; i<className.length; i++){
				this.remove(className[i]);
			}
			return this;
		}
		var i = this._value.indexOf(className);
		if(i>=0){
			this._value.splice(i,1);
		}
		return this;
	}
,	_render_child:function(name,result){
		return result;
	}
,	_render:function(children){
		return this._value.join(' ').trim();
	}	
})

var XML = Class(Composite, {
	constructor:function(){
		XML.Super.call(this);
		this.props = 'XMLProperties';
		this.tag = 'Tag';
		this._isSelfClosing = false;
		this._defaultChild = 'XML';
		this.children = new XMLChildren();
	}
,	_render_child:function(name,result){
		return result;
	}
,	_render:function(children){
		var r = '', tag, props;
		if(children.tag){tag = children.tag;delete children.tag;}
		if(children.props){props = children.props; delete children.props;}
		if(tag){
			r+= '<'+tag+(props? ' '+props:'')+(this._isSelfClosing?'/':'')+'>'+ (this._value?this._value:'');
		}
		for(var n in children){
			r+=children[n];
		}
		if(tag && !this._isSelfClosing){
			r+='</'+tag+'>';
		}
		return r;
	}
});

module.exports = Composite.map.XML = XML;