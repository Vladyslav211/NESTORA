/* =========================================
   PRODUCTS
========================================= */

const products = [
  {
    id: 1,
    title: 'Motion Sensor Light',
    category: 'Lighting',
    price: 34.99,
    oldPrice: 44.99,
    rating: 4.9,
    reviews: 128,
    badge: 'Bestseller',
    image: 'image/products/motion-light.jpg',
  },
  {
    id: 2,
    title: 'Cordless Ambient Lamp',
    category: 'Lighting',
    price: 49.99,
    oldPrice: 64.99,
    rating: 4.8,
    reviews: 96,
    badge: 'New',
    image: 'image/products/ambient-lamp.jpg',
  },
  {
    id: 3,
    title: 'Adjustable Drawer Organizer',
    category: 'Organization',
    price: 29.99,
    oldPrice: 39.99,
    rating: 4.9,
    reviews: 214,
    badge: 'Bestseller',
    image: 'image/products/drawer-organizer.jpg',
  },
  {
    id: 4,
    title: 'Smart Home Sensor',
    category: 'Smart Home',
    price: 39.99,
    oldPrice: 49.99,
    rating: 4.7,
    reviews: 74,
    badge: '',
    image: 'image/products/smart-sensor.jpg',
  },
];

/* =========================================
   PRODUCTS CONTAINER
========================================= */

const productsContainer =
  document.querySelector('#featured-products');

/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {
  return `
    <article class="product-card">

      <div class="product-card__image-wrapper">

        <a href="product.html?id=${product.id}">
          <div class="product-card__image">

            ${
              product.badge
                ? `
                  <span class="product-card__badge">
                    ${product.badge}
                  </span>
                `
                : ''
            }

            <img
              src="${product.image}"
              alt="${product.title}"
            />

          </div>
        </a>

        <!-- WISHLIST -->

        <button
          class="product-card__wishlist"
          type="button"
          data-wishlist="${product.id}"
          aria-label="Add ${product.title} to wishlist"
          aria-pressed="false"
        >
          ♡
        </button>

      </div>

      <div class="product-card__content">

        <span class="product-card__category">
          ${product.category}
        </span>

        <a href="product.html?id=${product.id}">
          <h3 class="product-card__title">
            ${product.title}
          </h3>
        </a>

        <div class="product-card__rating">

          <span class="product-card__stars">
            ★★★★★
          </span>

          <span class="product-card__reviews">
            (${product.reviews})
          </span>

        </div>

        <div class="product-card__price">

          <span class="product-card__current-price">
            $${product.price.toFixed(2)}
          </span>

          ${
            product.oldPrice
              ? `
                <span class="product-card__old-price">
                  $${product.oldPrice.toFixed(2)}
                </span>
              `
              : ''
          }

        </div>

      </div>

    </article>
  `;
}

/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts(productsList) {
  if (!productsContainer) {
    return;
  }

  productsContainer.innerHTML = productsList
    .map(createProductCard)
    .join('');
}

/* =========================================
   INITIALIZE
========================================= */

if (productsContainer) {
  renderProducts(products);
}