var Class = require('myclass')
,	is = require('is')
,	slice = Array.prototype.slice;
;

var Chunk = module.exports = Class({

	constructor:function(){

	}
,	render:function(skin,obj,options,key){
		if(key && options[key] && is(options[key],Function)){return options[key](skin,obj,options);}
		switch(is(obj)){
			case 'object':
			case 'json':
				return this.render_object(skin,obj,options,key);
				break;
			case 'array':
				return this.render_array(skin,obj,options,key);
				break;
			case 'arguments':
				obj = slice.call(obj);
				return this.render_array(skin,obj,options,key);
				break;
			case 'date':
				return this.render_date(skin,obj,options,key);
				break;
			case 'number':
				return this.render_number(skin,obj,options,key);
				break;
			case 'boolean':
				return this.render_boolean(skin,obj,options,key);
				break;
			case 'string':
				return this.render_string(skin,obj,options,key);
				break;
			case 'null':
			case 'undefined':
				return '';
			default:
				return this.render_string(skin,obj.toString(),options,key);
				break;
		}
	}
,	render_number:function(){

	}
,	render_boolean:function(){

	}
,	render_function:function(){

	}
,	render_array:function(skin,obj,options,key){
		var i = 0, l = obj.length,curr,res='';
		for(i;i<l;i++) {
			curr = obj[i];
			res+= this.render(skin,obj,options,i);
		};
		return res;
	}
,	render_object:function(skin,obj,options,key){
	}
,	render_value:function(skin,obj,options,key){
		
	}
,	render_string:function(){

	}
,	render_date:function(){
	
	}
});