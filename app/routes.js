var Book = require('./models/book');

function getBooks(res){
	Book.find(function(err, books) {
		if (err)
			res.send(err)
		res.json(books);
	});
};

module.exports = function(app) {
	app.get('/api/books', function(req, res) {
		getBooks(res);
	});

	app.post('/api/books', function(req, res) {

		Book.create({
			text : req.body.text,
			done : false
		}, function(err, book) {
			if (err)
				res.send(err);

			getBooks(res);
		});

	});

	app.checkout('/api/books/:book_id', function(req, res) {
		Book.remove({
			_id : req.params.book_id
		}, function(err, book) {
			if (err)
				res.send(err);

			getBooks(res);
		});
	});

	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
};
