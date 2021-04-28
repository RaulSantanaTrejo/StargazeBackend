const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stargaze',
  password: 'RaulST2801!',
  port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { username, password } = request.body
    console.log("Attempting to create with username: " + username + ", password: " + password)

    pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.insertId}`)
    })
  }

const updateToken = (username, token, callback) => {
    console.log(process.env.TOKEN_EXPIRY)
    expiry = new Date().getTime() + parseInt(process.env.TOKEN_EXPIRY) 
    console.log("New expiry: " + expiry)
    pool.query('UPDATE users SET token = $1, token_expire = $2 WHERE username = $3', [token, expiry, username], callback)
}

const getUserByUsername = (username, callback) => {
    pool.query('SELECT * FROM users WHERE username = $1', [username], callback)
}

const verifyToken = (username, token, callback) => {
    pool.query('SELECT token, token_expire FROM users WHERE username = $1', [username], callback)
}

module.exports = {
getUsers,
createUser,
getUserByUsername,
updateToken
}