const socket = io()

const formProduct = document.getElementById('formProduct')
const container = document.getElementById('container')

socket.on('products', (data) => {
  container.innerHTML = ``
  
  if(Array.isArray(data)) {
    
    data.forEach((prod) => {
      
      const div = document.createElement('div')
      div.classList.add('products')
      div.innerHTML = `
        <ul>
          <li>Title: ${prod.title}</li>
          <li>Description: ${prod.description}</li>
          <li>Code: ${prod.code}</li>
          <li>Price: ${prod.price}</li>
          <li>Status: ${prod.status}</li>
          <li>Stock: ${prod.stock}</li>
          <li>Category: ${prod.category}</li>
          <li>Id: ${prod.id}</li>
        </ul>
        <button class='eliminar' id=${prod.id}>Eliminar</button>
        `
        container.appendChild(div)
    })
  }
})

formProduct.addEventListener('submit', (e) => {
  e.preventDefault()
  const product = Object.fromEntries(new FormData(e.target))
  product.thumbnails = []
  socket.emit('post', product)
})

container.addEventListener('click', (e) => {
  e.preventDefault()
  socket.emit('delete', e.target.id)
})