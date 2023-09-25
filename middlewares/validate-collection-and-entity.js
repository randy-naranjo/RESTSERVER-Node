const { allowedFilesCollections } = require("../constants/collection.constants")

const collectionAndEntityExists = async(req,res, next) => {
  const {id, collection} = req.params

  allowedCollection = allowedFilesCollections.filter(c => c.collection === collection)[0]

  if(!allowedCollection) {
    return res.status(400).json({msg: `Collection ${ collection } not allowed`})
  }

  if (!allowedCollection.model) {
    return res.status(500).json({
      msg: `Model ${collection} not implemented`,
    });
  }

  const entity = await allowedCollection.model.findById(id)

  if(!entity) {
    return res.status(400).json({msg: `Entity with Id ${id} not founded in ${collection}`});
  }

  req.params.entity = entity

  next()
}

module.exports = {
  collectionAndEntityExists
}
