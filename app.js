var express = require('express');
var routes = require('./routes');
var tasks = require('./routes/books');
var http = require('http');
var path = require('path');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/alexandria?auto_reconnect', {safe:true});
var app = express();

app.use(function(req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('books');
  next();
})

app.locals.appname = 'Alexandria'

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9'}));
app.use(express.csrf());

app.use(require('less-middleware')({ src: __dirname + '/public', compress: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.locals._csrf = req.session._csrf;
  return next();
})

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.param('task_id', function(req, res, next, taskId) {
  req.db.books.findById(bookId, function(error, book){
    if (error) return next(error);
    if (!book) return next(new Error('Book is not found.'));
    req.book = book;
    return next();
  });
});

app.get('/', routes.index);
app.get('/books', books.list);
app.post('/books', books.markAllCompleted)
app.post('/books', books.add);
app.post('/books/:book_id', books.markCompleted);
app.del('/books/:book_id', books.del);
app.get('/books/completed', books.completed);

app.all('*', function(req, res){
  res.send(404);
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
