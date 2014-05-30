var _ = require('underscore');

var list = ['this', 'is', 'a', 'test'];

_.each(list, function(item){
	console.log('message: ', item);
}); 