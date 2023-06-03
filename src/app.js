import express from 'express'
import productRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js'

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, () => {
  console.log('Server runing in port 8080')
})