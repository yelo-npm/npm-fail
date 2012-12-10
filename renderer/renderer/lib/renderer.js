var Class = require('myclass')
,	is = require('is')
;

regEscape= function(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var Renderer = module.exports = Class({

	STATIC:{
		delimiters:{
			delimiter_start:'{'
		,	delimiter_end:'}'
		,	section_end:'/'
		,	section_object:'#'
		,	section_array:'@'
		,	inside:'[\\w.]*'
		}
	,	regexes:false
	,	initRegexes:function(refresh){
			if(!Renderer.regexes || refresh){
				var anything = '.*'
				r = {};
				r.ds = regEscape(Renderer.delimiters.delimiter_start);
				r.de = regEscape(Renderer.delimiters.delimiter_end);
				r.se = regEscape(Renderer.delimiters.section_end);
				r.so = regEscape(Renderer.delimiters.section_object);
				r.sa = regEscape(Renderer.delimiters.section_array);
				r.c  = Renderer.delimiters.inside;
				r.value = '('+r.ds+'('+r.c+')'+r.de+')';
				r.object = '('+r.ds+r.so+'('+r.c+')'+r.de+')'
				r.array = '('+r.ds+r.sa+'('+r.c+')'+r.de+')'
				r.regex = new RegExp([r.value,r.object,r.array].join('|'),'g');
				r.delimiterRemove = new RegExp([r.ds,r.de,r.se,r.so,r.sa].join('|'),'g');
				r.tempStart = '(({-----|{{[[------__xxx';
				r.tempEnd =   'xxx__------]]}}|-----}))';
				Renderer.regexes = r;
			}
			return Renderer.regexes;
		}
	,	
	}
,	constructor:function(){
		var r = Renderer.initRegexes();
		;
		this.r = r;
	}
,	getByPath:function(obj, path){ 
		var keys = path.split(".")
		,	keyLen = keys.length
		,	i = 0
		,	key
		;

		while(i < keyLen && obj){
			key = keys[i]; 
			obj = obj[key];
			i++;
		}

		if(i < keyLen){
			obj = null;
		}

		return obj;
}
,	out: function(skin,vars,options,cb){
		var r = this.r.regex
		,	match
		,	matches = []
		,	obj
		,	i,l
		,	chunks = []
		,	chunk
		,	endPart
		,	start
		,	end
		,	nextIndex
		,	previousStart = 0
		,	stringLen
		,	ret = ''
		;
		if(is.function(options)){cb = options; options = null;}
		
		r.lastIndex = 0;
		
		while(match = r.exec(skin)){
			matches.push({
				k:match[1] || match[3]
			,	p:match[2] || match[4] || match[6]
			,	a:match[4] ? true : false
			,	o:match[6] ? true : false
			,	i: match.index
			});
		}
		if(matches.length){
			l = matches.length, i = 0
			while(i<l){
				match = matches[i];
				start = match.i;
				nextIndex = i+1;
				stringLen = match.k.length;
				obj = this.getByPath(vars,match.p);
				if(start>previousStart){
					chunks.push({
						text: skin.slice(previousStart,start)
					,	type: 'string'
					})
				}
				end = start+stringLen;
				if(match.o || match.a){					
					endPart = new RegExp(this.r.ds+this.r.se+match.p+this.r.de);
					endPart.lastIndex = start
					end = endPart.exec(skin).index;
					chunks.push({
						text: skin.slice(start+stringLen,end)
					,	type: match.o ? 'object' : 'array'
					,	value:obj
					});
					end+=stringLen;
				}else{
				chunks.push({
						text: skin.slice(start,end)
					,	value: obj
					,	type:'value'
					});
				}
				previousStart = end;
				i++;
			}
			if(end<skin.length){
				chunks.push(skin.slice(end));
			}
		}
		while(matches.length){
			match = matches.shift();
			switch(match.type){
				case 'object':
					ret+=this.render_object(match.text,match.value,match,options)
					break;
				case 'array':
					ret+=this.render_array(match.text,match.value,match,options);
					break
				case 'value':
					ret+=this.render_string(match.text,match.value,match,options);
					break;
				case 'string':
				default:
					ret+=match.text;
					break;
			}
		}
		if(cb){cb(ret);}
		return ret;
	}
,	render_object:function(skin,obj,match,options){
		if(options &&  options.render_object){return options.render_object(skin,obj,match,options);}
		if(is.function(obj)){obj = obj(match);}
		if(!obj){return '';}
		if(is.array(obj)){return this.render_array(skin,obj,match,options);}
		return this.out(skin,obj,options);
	}
,	render_array:function(skin,obj,match,options){
		if(options &&  options.render_array){return options.render_array(skin,obj,match,options);}
		if(is.function(obj)){obj = obj(match);}
		if(!obj){return '';}
		if(is.object(obj)){return this.render_object(skin,obj,match,options);}
		if(!is.array(obj)){return '';}
		var i = 0, l = obj.length, curr;
		for(i;i<l;i++){
			curr = obj[i];
			if(is.object(curr)){
				curr = this.render_object(skin,curr,null,options);
				continue;
			}
			if(is.array(curr)){
				
			}
		}
	}
,	render_string:function(skin,obj,match,options){
		if(options &&  options.render_string){return options.render_string(skin,obj,match,options);}
		if(is.function(obj)){obj = obj(match);}
		if(!obj){return '';}
		
	}
});