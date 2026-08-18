const shopProductsContainer = document.querySelector('#shop-products');
const categoryFilter = document.querySelector('#category-filter');
const sortProducts = document.querySelector('#sort-products');
const productsCount = document.querySelector('#products-count');

function renderShopProducts(productsToRender) {
  shopProductsContainer.innerHTML = productsToRender
    .map(createProductCard)
    .join('');

  productsCount.textContent = `${productsToRender.length} products`;
}

function updateShop() {
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortProducts.value;

  let filteredProducts = [...products];

  // FILTER
  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(
      product => product.category === selectedCategory
    );
  }

  // SORT
  if (selectedSort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (selectedSort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (selectedSort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  renderShopProducts(filteredProducts);
}

categoryFilter.addEventListener('change', updateShop);

sortProducts.addEventListener('change', updateShop);

updateShop();
