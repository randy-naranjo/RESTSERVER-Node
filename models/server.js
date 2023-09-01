const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config");

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT ?? 3000
    this.userPath = '/api/users'
    this.authPath = '/api/auth'

    // Conectar base de datos

    this.conectarDB()

    //Middlewares

    this.middlewares()

    //Routes
    this.routes()
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    // CORS
    this.app.use( cors() )

    // Read and Parse of body
    this.app.use( express.json() )

    //Directorio publico
    this.app.use(express.static('public'))
  }

  routes() {
    
    this.app.use(this.authPath, require('../routes/auth.routes'))
    this.app.use(this.userPath, require('../routes/user.routes'))

  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`App running in http://localhost:${this.port}`)
    })
  }

}

module.exports = Server;
