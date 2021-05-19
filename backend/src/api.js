/* eslint-disable no-console */
const express = require('express');
const { v4: generateId } = require('uuid');
const database = require('./database');

const app = express();

function requestLogger(req, res, next) {
  res.once('finish', () => {
    const log = [req.method, req.path];
    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body));
    }
    log.push('->', res.statusCode);
    console.log(log.join(' '));
  });
  next();
}

app.use(requestLogger);
app.use(require('cors')());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  //adjustments
  const perPage = 20;
  const page = parseInt(req.query.page);
  const dueDate = req.query.dueDate;
  const arg = dueDate !== 'undefined' ? {'dueDate':dueDate } : {};
  try {
   
    const todos = database.client.db('todos').collection('todos');
    const response = await todos.find(arg, { limit: perPage, skip: perPage * (page - 1), sort: {date: -1} }).toArray();
    res.status(200);
    res.json(response);
   
  } catch (err) {
    console.log(err.message)
  }
});

app.post('/', async (req, res) => {
  const { text,dueDate } = req.body;

  if (typeof text !== 'string') {
    res.status(400);
    res.json({ message: "invalid 'text' expected string" });
    return;
  }

  const todo = { id: generateId(), text, dueDate, completed: false };
  await database.client.db('todos').collection('todos').insertOne(todo);
  res.status(201);
  

  res.json(todo);
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    res.status(400);
    res.json({ message: "invalid 'completed' expected boolean" });
    return;
  }

  await database.client.db('todos').collection('todos').updateOne({ id },
    { $set: { completed } });
  res.status(200);
  res.end();
});

app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(404);
    res.json({ message: "invalid Todo id" });
    return;
  }
  await database.client.db('todos').collection('todos').deleteOne({ id });
  res.status(203);
  res.end();
});

module.exports = app;
