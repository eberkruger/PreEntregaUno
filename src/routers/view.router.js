import {Router} from 'express'
import ProductManager from '../manager/productManager.js'

const router = Router()
const productManager = new ProductManager('./src/files/products.json')

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  res.render('home', {products})
})

router.get('/addProduct', (req, res) => {
  res.render('addProduct')
})

export default router