const mongoose = require('mongoose')


const dbConnection = async() => {

  try {
    
    await mongoose.connect( process.env.MONGODB_CNN)

    console.log('Bases de datos')

  } catch (error) {
    throw new Error('Error trying to connect database')
  }

}

module.exports = {
  dbConnection
}
