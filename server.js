require('dotenv').config()
const express = require('express')
var cors = require('cors')
const db = require('./queries')
const app = express()
const port = 80

app.use(cors()) //enables cors requests for server
app.use(express.json()) //enables json requests

const hexEncode = () => {
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

function handleLogin (req , res) {
  const { username, password } = req.body
  db.getUserByUsername(username, (error, results) => {
    if (results.rows.length > 0) {
      console.log("Login Attempt for: " + results.rows[0].username)
      if (results.rows[0].password == password){
        console.log("Login Success: " + results.rows[0].username)
        res.status(201).json({login:'Success',token:generateToken(username)})
      }
      else {
      console.log("Login Faield, wrong password: " + results.rows[0].username)
        res.status(400).json({login:'Fail', error:'WrongPassword'})
      }
    }
    else {
      db.createUser(req, res)
      res.status(201).json({login:'NewUser', token:generateToken(username)})
    }
  })
}

const generateToken = (username) => {
  const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
  token = hexEncode(username)+genRanHex(64)
  db.updateToken(username, token, (error, result) => {
    if (error) {
      throw error
    } else {
      console.log("Updated token for: " + username)
    }
  })
  return token;

}

app.get('/', (req, res) => {
  res.json({message: 'Hello World!'})
})

app.get('/username', (req, res) => {
    res.json({username: 'Raul'})
  })

app.post('/login', handleLogin)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

