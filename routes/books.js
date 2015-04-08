exports.list = function(req, res, next){
  req.db.books.find({completed: false}).toArray(function(error, books){
    if (error) return next(error);
    res.render('books', {
      title: 'Book List',
      books: books || []
    });
  });
};

exports.add = function(req, res, next){
  if (!req.body || !req.body.name) return next(new Error('No data provided.'));
  req.db.books.save({
    name: req.body.name,
    createTime: new Date(),
    completed: false
  }, function(error, book){
    if (error) return next(error);
    if (!book) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', book.name, book._id);
    res.redirect('/books');
  })
};

exports.markAllCompleted = function(req, res, next) {
  if (!req.body.all_done || req.body.all_done !== 'true') return next();
  req.db.books.update({
    completed: false
  }, {$set: {
    completeTime: new Date(),
    completed: true
  }}, {multi: true}, function(error, count){
    if (error) return next(error);
    console.info('Marked %s book(s) completed.', count);
    res.redirect('/books');
  })
};

exports.completed = function(req, res, next) {
  req.db.books.find({completed: true}).toArray(function(error, books) {
    res.render('books_completed', {
      title: 'Completed',
      books: books || []
    });
  });
};

exports.markCompleted = function(req, res, next) {
  if (!req.body.completed) return next(new Error('Param is missing.'));
  var completed = req.body.completed === 'true';
  req.db.books.updateById(req.book._id, {$set: {completeTime: completed ? new Date() : null, completed: completed}}, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Marked book %s with id=%s completed.', req.book.name, req.book._id);
    res.redirect('/books');
  })
};

exports.del = function(req, res, next) {
  req.db.books.removeById(req.book._id, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Deleted book %s with id=%s completed.', req.book.name, req.book._id);
    res.status(204).send();
  });
};
