require('dotenv').config()

const PORT = process.env.PORT ?? 8000
const express = require('express')
const app = express()
const db = require('./db')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

// get all todos

app.get('/todos/:user_email', async (req, res) => {

  const { user_email } = req.params
  console.log(user_email);
  try {
    const data = await db.query("SELECT * FROM todos WHERE user_email = $1", [user_email])
    res.json(data.rows)
  } catch (err) {
    console.log(err)
  }
})
// create todo
app.post('/todos', async (req, res) => {
  const { user_email, title, progress, date } = req.body
  const id = uuidv4()
  console.log(user_email, title, progress, date);
  try {
    const newTodo = await db.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`, [id, user_email, title, progress, date])
    res.json(newTodo)
  } catch(err) {
    console.error(err)
  }
})

//edit a todo 

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const { user_email, title, progress, date } = req.body

  try {
    const editTodo = await db.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5', [user_email, title, progress, date, id])
    res.json(editTodo)
  } catch (err) {
    console.error(err)
  }
})

//delete a todo

app.delete('/todos/:id', async (req, res) => {

  try {
    const { id } = req.params
    const deleteTodo = await db.query('DELETE FROM todos where id = $1', [id])
    res.json(deleteTodo)
  } catch (err) {
    console.error(err)
  }
})

//sign up
app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  try {
    const signup = await db.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2)', [email, hashedPassword])

    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})
    
    res.json({email, token})

  } catch (err) {
    console.error(err);
    if (err) {
      res.json({detail: err.detail})
    }
  }
})

//login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const users = await db.query('SELECT * FROM users WHERE email = $1', [email])
    if (!users.rows.length) return res.json({detail: 'User does not exist'})

    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

    if (success) {
      res.json({'email': users.rows[0].email, token})
    } else {
      res.json({detail: 'Login failed'})
    }
  } catch (err) {
    console.error(err);
  }
})

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
})


