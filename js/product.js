// 1. Отримуємо id з URL
const params = new URLSearchParams(window.location.search);

const productId = Number(params.get('id'));

const product = products.find(product => product.id === productId);
const relatedProductsContainer = document.querySelector('#related-products');

if (relatedProductsContainer && product) {
  const relatedProducts = products
    .filter(item => item.id !== product.id)
    .slice(0, 3);

  relatedProductsContainer.innerHTML = relatedProducts
    .map(createProductCard)
    .join('');
}
// 2. Знаходимо HTML-елементи
const productCategory = document.querySelector('#product-category');
const productTitle = document.querySelector('#product-title');
const productRating = document.querySelector('#product-rating');
const productReviews = document.querySelector('#product-reviews');
const productPrice = document.querySelector('#product-price');
const productOldPrice = document.querySelector('#product-old-price');
const productDescription = document.querySelector('#product-description');

const quantityValue = document.querySelector('#quantity-value');
const quantityMinus = document.querySelector('#quantity-minus');
const quantityPlus = document.querySelector('#quantity-plus');

const addToCartButton = document.querySelector('#add-to-cart');

// 3. Виводимо інформацію про товар
if (!product) {
  document.querySelector('main').innerHTML = `
    <section class="product-not-found">
      <div class="container">
        <h1>Product not found</h1>
        <a href="shop.html">Back to shop</a>
      </div>
    </section>
  `;
} else {
  productCategory.textContent = product.category;
  productTitle.textContent = product.title;
  productRating.textContent = '★★★★★';
  productReviews.textContent = `(${product.reviews} reviews)`;
  productPrice.textContent = `$${product.price.toFixed(2)}`;

  if (product.oldPrice) {
    productOldPrice.textContent = `$${product.oldPrice.toFixed(2)}`;
  }

  productDescription.textContent =
    product.description ||
    'Thoughtfully designed to bring function, comfort and beauty into your everyday space.';
}

// 4. Quantity
let quantity = 1;

quantityPlus.addEventListener('click', () => {
  quantity += 1;
  quantityValue.textContent = quantity;
});

quantityMinus.addEventListener('click', () => {
  if (quantity > 1) {
    quantity -= 1;
  }

  quantityValue.textContent = quantity;
});

// 5. Add to Cart — поки тільки тестуємо
addToCartButton.addEventListener('click', () => {
  addToCart(product.id, quantity);

  addToCartButton.textContent = 'Added to cart';

  setTimeout(() => {
    addToCartButton.textContent = 'Add to cart';
  }, 1500);
});
