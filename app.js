const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/Todo-list", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define a schema for the TODO items
const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

// Define a model based on the schema
const Todo = mongoose.model('Todo', todoSchema);

// Parse JSON requests
app.use(express.json());

// CRUD API routes
// Create a new TODO item
app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
  const todo = new Todo({ title, completed });
  todo.save()
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json({ error: 'Failed to create TODO item' }));
});

// Read all TODO items
app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => res.json(todos))
    .catch((err) => res.status(500).json({ error: 'Failed to fetch TODO items' }));
});

// Read a specific TODO item
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).json({ error: 'TODO item not found' });
      }
      res.json(todo);
    })
    .catch((err) => res.status(500).json({ error: 'Failed to fetch TODO item' }));
});

// Update a TODO item
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const { title, completed } = req.body;
  Todo.findByIdAndUpdate(id, { title, completed }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).json({ error: 'TODO item not found' });
      }
      res.json(todo);
    })
    .catch((err) => res.status(500).json({ error: 'Failed to update TODO item' }));
});

// Delete a TODO item
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  Todo.findByIdAndDelete(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).json({ error: 'TODO item not found' });
      }
      res.json({ message: 'TODO item deleted' });
    })
    .catch((err) => res.status(500).json({ error: 'Failed to delete TODO item' }));
});

// Start the server
app.listen(3000, ()=>{
 console.log(`server is running on 3000`)
})
