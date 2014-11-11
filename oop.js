	// 一篇不错的有关这种继承方式的讨论：http://www.cnblogs.com/enein/archive/2012/12/03/2799160.html
	// call a immediate funciton，prevent global namespace from being polluted.
	(function(){
		// 这个initializing变量用于标识当前是否处于类的初始创建阶段，下面会继续详述
		var initializing = false,
		// 这是一个技巧性的写法，用于检测当前环境下函数是否能够序列化
		// 附一篇讨论函数序列化的文章：http://www.cnblogs.com/ziyunfei/archive/2012/12/04/2799603.html
		// superPattern引用一个正则对象，该对象用于验证被验证函数中是否有使用_super方法
			superPattern = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

		Object.subClass = function(properties){
			// 当前对象（父类）的原型对象
			var _super = this.prototype;

			// initializing = true表示当前处于类的初始创建阶段。
			// this构造函数里会判断initializing的状态，如果为false则不执行Init方法。
			// 事实上这也是非常需要的，因为在这个时候，我们需要的只是一个干净的虚构的构造函数，完全不需要其执行init函数，以避免污染。init方法只有在当前类被实例化的时候才需要被执行，而当前正执行继承行为，不应该执行Init方法。
			initializing = true;
			// 当前对象（父类）的一个实例对象
			var proto = new this();
			// 初始创建阶段完成，置initializing为false
			initializing = false;

			// 在properties里提供的属性，作为当前对象（父类）实例的公共属性，供其子类实例共享；
			// 在properties里提供的方法，作为当前对象（父类）实例的公共方法，供其子类实例共享。
			for(var name in properties){
				proto[name] = typeof properties[name] == 'function' && //检测当前提供的是否为函数
							  typeof _super[name] == 'function' && //检测当前提供的函数名是否已经存在于父类的原型对象中，如果是，则需要下面的操作，以保证父类中的方法不会被覆盖且可以以某种方式被调用，如果否，则直接将该函数赋值为父类实例的方法
							  superPattern.test(properties[name]) ? //检测当前提供的函数内是否使用了_super方法，如果有使用_super方法，则需要下面的操作，以保证父类中的方法不会被覆盖且可以以某种方式被调用，如果没有用到_super方法，则直接将该函数赋值为父类实例的方法，即使父类原型中已经拥有同名方法（覆盖）

					// 使用一个马上执行的函数，返回一个闭包，这样每个闭包引用的都是各自的name和fn。
					(function(name, fn){
						return function() {
							// 首先将执行方法的当前对象（子类的实例化对象）的_super属性保存到tmp变量里。
							// 这是非常必要的， 因为this永远指向当前正在被调用的对象。
							// 当C继承B，B继承A，而A\B\C均有一个dance方法且B\C的dance方法均使用了this._super来引用各自父类的方法时，下面这句操作就显得非常重要了。它使得在方法调用时，this._super永远指向“当前类”的父类的原型中的同名方法，从而避免this._super被随便改写。
							var tmp = this._super;
							
							// 然后将父类的原型中的同名方法赋值给this._super，以便子类的实例化对象可以在其执行name方法时通过this._super使用对应的父类原型中已经存在的方法
							this._super = _super[name];

							// 执行创建子类时提供的函数，并通过arguments传入参数
							var ret = fn.apply(this, arguments);
							
							// 将tmp里保存的_super属性重新赋值回this._super中
							this._super = tmp;

							// 返回函数的执行结果
							return ret;
						};
					})(name, properties[name]) : 
					properties[name];
			}

			// 内部定义个名叫Class的类，构造函数内部只有一个操作：执行当前对象中可能存在的init方法
			// 这样做的原因：新建一个类（闭包），可以防止很多干扰（详细可对比JS高级设计第三版）
			function Class(){
				// 如果不是正在实现继承，并且当前类的init方法存在，则执行init方法
				// 每当subClass方法执行完毕后，都会返回这个Class构造函数，当用户使用new 方法时，就会执行这里面的操作
				// 本质：每次调用subClass都新建一个类（闭包）
				if(!initializing && this.init){
					// 这是子类的初始化方法，里面可以定义子类的私有属性，公共属性请在上方所述处添加
					this.init.apply(this, arguments);
				}
			}

			// 重写Class构造函数的prototype，使其不再指向了Class原生的原型对象，而是指向了proto，即当前对象（类）的一个实例
			// 本质：一个类的原型是另一个类的实例（继承）
			Class.prototype = proto;
			// 为什么要重写Class的构造函数？因为这个Class函数，它原来的constructor指向的是Function对象，这里修正它的指向，使其指向自己。
			Class.constructor = Class;
			// 就是这个操作，使得每次调用subClass都会新生命的Class对象，也拥有subClass方法，可以继续被继承下去
			// 本质：使得每次继承的子类都拥有被继承的能力
			Class.subClass = arguments.callee;
			// 返回这个内部新定义的构造函数（闭包）
			return Class;
		};
	})();

	// usage:
	// var Person = Object.subClass({
	// 	init: function(isDancing) {
	// 		this.dancing = isDancing;
	// 	},
	// 	dance: function(){
	// 		console.log('i am a person,i dance.');
	// 		return this.dancing;
	// 	}
	// });

	// var Ninja = Person.subClass({
	// 	init:function(){

	// 	},
	// 	dance: function() {
	// 		console.log('i am an Ninja,i dance.');
	// 		this._super();
	// 		return;
	// 	},
	// 	swingSword:function(){
	// 		return true;
	// 	}
	// });

	// var Chileung = Ninja.subClass({
	// 	dance: function(){
	// 		console.log('i am Chileung.i dance.');
	// 		this._super();
	// 		return;
	// 	}
	// });

	// var p = new Person();
	// p.dance();

	// var n = new Ninja();
	// n.dance();

	// var c = new Chileung();
	// c.dance();