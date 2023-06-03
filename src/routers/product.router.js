import { Router } from "express"
import ProductManager from "../manager/productManager.js"

const router = Router()

const productManager = new ProductManager('./src/files/products.json')

router.get('/', async (req, res) => {
  try {
    const limit = Number(req.query.limit)

    const products = await productManager.getProducts()

    if (!products) {
      return req.statusCode(404).send({ error: 'Products not found' })
    }

    if (!limit) {
      res.send({ status: 'success', products })
    } else {
      const limitProducts = products.slice(0, limit)
      res.send({ status: 'success', limitProducts })
    }

  } catch (error) {
    console.log('Error en router.get/', error)
  }
})

router.get('./:pid', async (req, res) => {
  try {
    const idProduct = Number(req.params.pid)
    const product = await productManager.getProductById(idProduct)

    if (!product) {
      return res.status(404).send({ error: 'Product not found' })
    } else {
      return res.send({ status: 'success', product })
    }

  } catch (error) {
    console.log('Error en router.get/:pid', error)
  }
})

router.post('/', async (req, res) => {
  try {
    const product = req.body

    if (!product.status) {
      product.status = true
    }

    const { title, description, code, price, stock, category } = product

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(404).send({ error: 'Todos los campos son obligatorios' })
    }

    const products = await productManager.getProducts()

    const codeFind = products.find((prod) => prod.code === code)

    if (codeFind) {
      return res.status(404).send({ error: `El código ${code} ya existe` })
    }

    const result = await productManager.addProduct(product)
    res.send({ status: 'success', result })

  } catch (error) {
    console.log('Error en router.post/', error)
  }
})

router.put('/:pid', async (req, res) => {
  try {
    const idProduct = Number(req.params.pid)
    const objProduct = req.body

    if (objProduct.id) {
      objProduct.id = idProduct
    }

    const result = await productManager.updateProduct(idProduct, objProduct)

    if (!result) {
      res.status(404).send({ error: 'Product not found' })
      return
    } else {
      res.send({ status: 'cuccess', result })
    }

  } catch (error) {
    console.log('Error en router.put/:pid', error)
  }
})

router.delete('/:pid', async (req, res) => {
  try {
    const idProduct = Number(req.params.pid)

    await productManager.deleteById(idProduct)

    res.send({ status: 'Producto eliminado' })

  } catch (error) {
    console.error('Erorr en router.delete/:pid', error)
  }
})

export default router