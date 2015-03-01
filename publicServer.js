var express = require('express');
var app = express();

exports.run = function() {
	app.use(express.static(__dirname + '/public', {'extensions': ['html']}));

	app.listen(4000, function (err, result) {
		if (err) {
			console.log(err);
		}
		console.log('Listening at localhost:' + 4000);
	});

}
