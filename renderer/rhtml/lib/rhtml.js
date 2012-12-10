var HTML = require('./renderer');

var n = new HTML;

console.log(
	n.out('this is just a {test} for a {that.nested.deep} and an {#arr} why oh why sdfsdfdsf {/arr}',{
		test:'works'
	,	arr:'dfsdf'
	,	that:{
			nested:{
				deep:'woooow'
			}
		}
	})
)



