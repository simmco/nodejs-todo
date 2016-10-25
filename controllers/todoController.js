var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://test:test@ds031617.mlab.com:31617/todo');

// Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  app.get('/', function(req, res) {
      // get data from mongoDB and pass it to view
      Todo.find({}, function(err, data){
        if (err) throw err;
          res.render('todo', {todos: data});
      });
  });

  app.post('/', urlencodedParser, function(req, res) {
      // get data from the view and add it to mongoDB
      var newTodo = Todo(req.body).save(function(err,data){
        if (err) throw err;
        res.json(data);
      });
  });

  app.delete('/:item', function(req, res){
    // delete the requested item from mongoDB
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
        if(err) throw err;
        res.json(data);
    });
  });

};
