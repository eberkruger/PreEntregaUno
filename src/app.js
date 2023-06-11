import express from 'express'
import handlebars from 'express-handlebars'
import http from 'http'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import productRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js'
import viewRouter from './routers/view.router.js'

import ProductManager from './manager/productManager.js'
const productManager = new ProductManager('./src/files/products.json')

const PORT = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/', viewRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

server.listen(PORT, () => {
  console.log('Server runing in port 8080')
})


io.on('connection', async (socket) => {
  console.log('Nuevo usuario conectado')

  const products = await productManager.getProducts()
  socket.emit('products', products)

  socket.on('post', async (product) => {
    const result = await productManager.addProduct(product)
    socket.emit('products', result)
  })

  socket.on('delete', async (data) => {
    const result = await productManager.deleteById(Number(data))
    socket.emit('products', result)
  })
})



