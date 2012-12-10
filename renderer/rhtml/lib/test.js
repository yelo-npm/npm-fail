var is = require('is')
,	Class = require('myclass')
;


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

var clean = function(arr){
	var newArr = [];
	for(var n in arr){
		newArr.push(arr[n]);
	}
	return newArr.filter(function(elem, pos){
    	return newArr.indexOf(elem) == pos;
	});
}

var normalize = function(obj){
	obj.tag = obj.tag || obj.tagName || '';
	obj.attr = extend({},obj.attr,obj.attributes);

	obj.attr['class'] = clean([].concat(obj.attr['class'],obj.attr.classes,obj['class'],obj.classes));
	if(obj.attr['classes']){delete obj.attr['classes'];}
	if(is(obj.attr['class'],Array)){
		obj.attr['class'] = clean(obj.attr['class']).join(' ');
	}


	obj.attr.style = clean([].concat(obj.attr.style,obj.style));
	if(obj.attr.style){delete obj.attr.style;}

	if((obj.value || obj.text) && obj.tag && obj.tag == 'input'){
		obj.attr.value = obj.value || obj.text;
		delete(obj.value);
		delete(obj.text);
	}
	else if(obj.value){
		obj.text = obj.value;
		delete(obj.value);
	}

	if(obj.attr.checked && obj.attr.checked == true){
		obj.attr.checked = 'checked';
	}

	return obj;
}

var HTML = function(obj){

	obj = normalize(obj);

	var res = ''
	,	n
	;

	if(obj.tag){
		res+='<'+obj.tag;
		if(obj.attr){
			for(n in obj.attr){
				res+=' '+n+'="'+obj.attr[n]+'"';
			}
		}
		if(obj.style){
			res+=' style="';
			for(n in obj.style){
				res+=n+':'+obj.style[n]+';'
			}
			res+='"'
		}
		res+=(obj.selfClosing? '/':'' )+'>'
	}

	if(obj.text){
		res+=obj.text;
	}

	if(obj.children){
		for(var n in obj.children){
			res+=HTML(obj.children[n]);
		}
	}

	if(obj.tag && !obj.selfClosing){
		res+='</'+obj.tag+'>';
	}

	return res;

}


var a = HTML({
	tag:'input'
,	classes:['a','b','c']
,	value:'yey'
,	style:{width:20}
,	attributes:{
		id:'aaa'
	}
})

console.log(a)