const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers
  const user = users.find(user => user.username === username)

  if(!user){
    return response.status(404).json({error: 'Username not found.'})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username, todos } = request.body
  const usersExists = users.some(user => user.username === username)

  if(usersExists){
    return response.status(404).json({error: 'Username already exists!'})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos
  })

  return response.status(201).json(users)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline, done } = request.body
  const { user } = request

  const dateFormat = new Date(deadline + ' 00:00')

  const todosOperation = {
    id: uuidv4(),
    title,
    done,
    deadline: dateFormat,
    created_ate: new Date()
  }

  user.todos.push(todosOperation)
  
  return response.status(201).json(todosOperation)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body
  const { id } = request.params
  const { user } = request

  const todos = user.todos.find(todos => todos.id === id)

  if(!todos){
    return response.status(404).json({error: 'Id incorrect!'})
  }

  const dateFormat = new Date(deadline + ' 00:00')

  todos.title = title
  todos.deadline = dateFormat

  return response.status(201).send()

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { done } = request.body
  const { id } = request.params
  const { user } = request

  const todos = user.todos.find(todos => todos.id === id)

  if(!todos){
    return response.status(404).json({error: 'Id incorrect!'})
  }

  todos.done = done

  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { user } = request

  const todos = user.todos.find(todos => todos.id === id)

  if(!todos){
    return response.status(404).json({error: 'Id incorrect!'})
  }

  user.todos.splice(todos, 1)

  return response.status(201).send()
});

module.exports = app;