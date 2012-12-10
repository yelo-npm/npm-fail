var XML = require('./xml');
;

var a = new XML();
a.set('tag','div');
a.set('props.classes','a')
a.set('props.test','b');
a.set('yeeeeeeeeeeeeeey');
a.props.classes.add('b');
a.set('lazy',{
	tag:'span'
,	value:"sdff"
,	props:{
		classes:['a','b','c']
	}
,	children:[
		{
			tag:'ul'
		,	children:[
				{tag:'li',value:'fudje'}
			]
		}
	]
})
console.log(a.render());
