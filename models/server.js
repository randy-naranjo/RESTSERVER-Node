const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT ?? 3000

    this.paths = {
      user:       '/api/users',
      auth:       '/api/auth',
      categories: '/api/categories',
      products:   '/api/products',
      search:   '/api/search',
      uploads: '/api/uploads'
    }

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

    // Manejar la carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
  }));
  }

  routes() {
    
    this.app.use(this.paths.auth, require('../routes/auth.routes'))
    this.app.use(this.paths.user, require('../routes/user.routes'))
    this.app.use(this.paths.categories, require('../routes/categories.routes'))
    this.app.use(this.paths.products, require('../routes/products.routes'))
    this.app.use(this.paths.search, require('../routes/search.routes'))
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'))

  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`App running in http://localhost:${this.port}`)
    })
  }

}

module.exports = Server;
