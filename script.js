document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.getElementById('menu-icon');
  const menu = document.getElementById('menu');
  const menuItems = document.getElementById('menu-items');
  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');
  const productImageInput = document.getElementById('product-image');
  const loginForm = document.getElementById('login-form');
  const adminLink = document.getElementById('admin-link');
  const loginError = document.getElementById('login-error');

  const username = 'admin';
  const password = '12345';

  let products = [
    { id: 1, name: 'Hambúrguer Clássico', price: 20, image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Cheeseburger', price: 22, image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Hambúrguer Bacon', price: 25, image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'Coca-Cola', price: 5, image: 'https://via.placeholder.com/100' },
    { id: 5, name: 'Suco de Laranja', price: 7, image: 'https://via.placeholder.com/100' }
  ];
  let editIndex = -1;
  let isAuthenticated = false;

  menuIcon.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    if (enteredUsername === username && enteredPassword === password) {
      isAuthenticated = true;
      loginError.style.display = 'none';
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('admin-section').style.display = 'block';
    } else {
      loginError.style.display = 'block';
    }
  });

  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const productId = document.getElementById('product-id').value;
    let image = '';

    if (productImageInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        image = event.target.result;

        if (editIndex === -1) {
          products.push({ id: Date.now(), name, price, image });
        } else {
          products[editIndex] = { id: productId, name, price, image };
          editIndex = -1;
        }

        productForm.reset();
        renderProducts();
      };
      reader.readAsDataURL(productImageInput.files[0]);
    } else {
      if (editIndex === -1) {
        products.push({ id: Date.now(), name, price, image });
      } else {
        products[editIndex].name = name;
        products[editIndex].price = price;
        editIndex = -1;
      }

      productForm.reset();
      renderProducts();
    }
  });

  function renderProducts() {
    menuItems.innerHTML = '';
    productList.innerHTML = '';

    products.forEach((product, index) => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>R$ ${product.price}</p>
          `;
      menuItems.appendChild(productElement);

      if (isAuthenticated) {
        const adminProductElement = document.createElement('div');
        adminProductElement.className = 'product';
        adminProductElement.innerHTML = `
                  <img src="${product.image}" alt="${product.name}">
                  <h3>${product.name}</h3>
                  <p>R$ ${product.price}</p>
                  <button onclick="editProduct(${index})">Editar</button>
                  <button onclick="deleteProduct(${index})">Excluir</button>
              `;
        productList.appendChild(adminProductElement);
      }
    });
  }

  window.editProduct = function (index) {
    const product = products[index];
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-id').value = product.id;
    editIndex = index;
  };

  window.deleteProduct = function (index) {
    products.splice(index, 1);
    renderProducts();
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
      });
      document.querySelector(this.getAttribute('href')).style.display = 'block';
    });
  });

  renderProducts();
});
