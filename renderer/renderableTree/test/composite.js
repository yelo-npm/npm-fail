var expect = require('chai').expect
//,	assert = require('chai').assert
//,	should = require('chai').should()
;

var Composite = require('../lib/composite').Composite
,	CompositeIterator = require('../lib/composite').CompositeIterator
,	CompositePublisher = require('../lib/composite').CompositePublisher
,	Class = Composite.Class;
;

var C = new Composite();
var name = 'Bill';


describe('Composite', function(){
	describe('#setProperty', function(){
		it('setProperty("name") Creates a child Composite object, that can be used as a field', function(){
			C.setProperty('title');
			expect(C).to.have.property('title');
			expect(C.title).to.be.an.instanceof(Composite);
		})
	,	it('setProperty({key:value}) Creates multiple children (fields)',function(){
			C.setProperty({
				age:{}
			,	nickname:{}
			});
			expect(C).to.have.property('age');
			expect(C).to.have.property('nickname');
		})
	,	it('setProperty("_anyNameBeginningWithUnderscore") does nothing',function(){
			C.setProperty('_forbidden');
			expect(C).to.not.have.property('_forbidden');
		})
	,	it('setProperty("get or set or any core function") does nothing',function(){
			C.setProperty('set');
			C.setProperty('setProperty');
			expect(C.set).to.not.be.an.instanceof(Composite);
			expect(C.setProperty).to.not.be.an.instanceof(Composite);
		})
	})
,	describe('#set',function(){
		it('set(key,value) sets a value in a child',function(){			
			C.set('title',name);
			expect(C.title._value).to.be.equal(name);
		})
	,	it('set(value) sets a value on the object itself',function(){
			C.set('root');
			expect(C._value).to.be.equal('root');
		})
	,	it('set("key.key",value) sets a value on a nested object',function(){
			C.setProperty('kids');
			C.kids.setProperty('joe');
			C.kids.joe.setProperty('name');
			C.set('kids.joe.name',name);
			expect(C.kids.joe.name._value).to.be.equal(name);
		})
	,	it('set({key:value} sets nested children. It also works with nested objects',function(){
			C.set({
				kids:{
					joe:{
						name:'Joe'
					,	_value:'should not work'
					}
				}
			});
			expect(C.kids.joe.name._value).to.be.equal('Joe');
			expect(C.kids.joe._value).to.not.be.equal('should not work');
		})
	,	it('if a validator is set, the value must pass validation before being set',function(){
			var C2 = new Composite();
			var validator = function(){

			}
			validator.validate = function(obj){
				var result = (obj == 1);
				return result;
			}
			C2.validator(validator);
			C2.set(1);
			C2.set(2);
			expect(C2._value).to.be.equal(1);
		})
	})
,	describe('#publisher',function(){
		it('publisher().on("key",fn) allows to listen to changes - function signature: function(element,newValue,PropertyName){}',function(done){
			var C3 = new Composite();
			C3.setProperty('title');
			C3.publisher().on('title',function(obj,val,name){
				expect(name).to.be.equal('title');
				expect(val).to.be.equal('b');
				done();
			})
			C3.set('title','b');
		})
	})
,	describe('#iterator',function(){
		it('iterator().next() allows to loop through enumerable properties',function(){
			var iter = C.iterator();
			while(iter.next().current()){
				console.log(iter.current());
			};
		})
	})
,	describe('#visit',function(){
		it('visit(fn) cycles through the element and all children - function signature: function(element,[resultsObject]){}',function(){
			var results = {str:''}
			var visitor = function(el,res){
				res.str+=el._name || 'root';
			}
			var last = C.visit(visitor,results);
			expect(last.str).to.be.equal('titleagenicknamenamejoekidsroot');
		})
		it('visit(fn) can also be used async for computational-intensive stuff - function signature: function(element,callback,[resultsObject]){}',function(done){
			var visitor = function(el,res){
				if(!('i' in res)){res.i = 0;}
				res.i+=1;
			}
			C.visit(visitor,function(last){
				expect(last.i).to.be.equal(7);
				done();
			});
		})
	})
,	describe('#render',function(){
		it('creates a string view of the value of the element and all children',function(){
			C.set('root=a');
			C.title.set('b1')
			C.age.set('b2')
			C.nickname.set('b3')
			C.kids.set('b4');
			C.kids.joe.set('c');
			C.kids.joe.name.set('d');
			C.setProperty('lastOne');
			C.set('lastOne','e')
			var r = C.render().replace(/\n|\t| |\s/g,'');
			expect(r).to.be.equal('root=a{title=b1age=b2nickname=b3kids=b4{joe=c{name=d}}lastOne=e}');
			C.del();
		})
	})
,	describe('Lazy fields generation',function(){
		it('fields defined as text (obj.key = "className") can be instancied when needed',function(){
			var ExtendedComposite = function(){
				Composite.call(this);
			}
			ExtendedComposite.prototype = new Composite();
			ExtendedComposite.prototype.constructor = Composite;
			ExtendedComposite.prototype.set = function(val){
				this._value = val;
			}
			Composite.map.ext = ExtendedComposite;
			var C4 = new Composite();
			C4.someValue = 'ext';
			C4.set('someValue','yey');
			expect(C4.someValue).to.be.an.instanceof(ExtendedComposite);
		})
	})
})