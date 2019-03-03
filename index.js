
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const DB_URL = 'mongodb://kodemia:kodemiarules@clustercharles-shard-00-00-bo63z.mongodb.net:27017,clustercharles-shard-00-01-bo63z.mongodb.net:27017,clustercharles-shard-00-02-bo63z.mongodb.net:27017/blogLovecraft?ssl=true&replicaSet=ClusterCharles-shard-0&authSource=admin&retryWrites=true'
const app = express()
app.use(cors())

mongoose.connect(DB_URL, { useNewUrlParser: true })

const db = mongoose.connection
const { Schema } = mongoose

db.on('error', error => {
  console.error('ERROR: ', error)
})

// schemas

const postSchema = new Schema({
  title: String,
  date: Date,
  content: String,
  image: String
})

const Post = mongoose.model('Post', postSchema)

app.use(express.json())

app.get('/', (request, response) => {
  response.json({
    success: true,
    message: 'HOLA DESDE NUESTRA API!!!' 
  })
})

app.post('/posts', (request, response) => {
  const {
    title,
    date,
    content,
    image
  } = request.body

  const post = new Post({
    title,
    date,
    content,
    image
   })
   post.save()

   response.json({
     success: true,
     message: 'Modelo creado exitosamente',
     payload: {
       post
     }
   })
})

app.get('/posts', async (request, response) => {
  const posts = await Post.find({}).exec()

  response.json({
    success: true,
    message: 'Aqui estan todos los posts',
    payload: {
      posts
    }
  })
})

app.del('/posts/:id', async (request, response) => {
  try {
    const { id } = request.params
    console.log('id: ', id)
    const deletedPost = await Post.findOneAndDelete({ _id: id }).exec()
    
    if (!deletedPost) throw new Error(`No existe el id <${id}>` )
    
    response.json({
      success: true,
      message: 'id',
      payload: {
        deletedPost
      }
    })
  } catch (error) {
    response.json({
      success: false,
      error: error.message
    })
  }
})

db.once('open', () => {
  console.log('DB connected')
  app.listen(8080, () => {
    console.log('API Lista')
  })
})
