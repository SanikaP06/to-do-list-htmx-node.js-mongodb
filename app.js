const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost/todo-app', { useNewUrlParser: true, useUnifiedTopology: true });

const todoSchema = new mongoose.Schema({
    task: String,
    deadline: Date,
    completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    const todos = await Todo.find();
    const notCompletedCount = await Todo.countDocuments({ completed: false });
    res.render('index', { todos, notCompletedCount });
});

app.post('/add', async (req, res) => {
    const { task, deadline } = req.body;
    await Todo.create({ task, deadline });
    const todos = await Todo.find();
    const notCompletedCount = await Todo.countDocuments({ completed: false });
    res.render('partials/todo_list', { todos, notCompletedCount });
});

app.post('/complete/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndUpdate(id, { completed: true });
    const todos = await Todo.find();
    const notCompletedCount = await Todo.countDocuments({ completed: false });
    res.render('partials/todo_list', { todos, notCompletedCount });
});

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    const todos = await Todo.find();
    const notCompletedCount = await Todo.countDocuments({ completed: false });
    res.render('partials/todo_list', { todos, notCompletedCount });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});