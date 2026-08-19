const params = new URLSearchParams(window.location.search);

const category = params.get('category');

const collectionTitle = document.querySelector('#collectionTitle');
const collectionEyebrow = document.querySelector('#collectionEyebrow');
const collectionCount = document.querySelector('#collectionCount');
const collectionProducts = document.querySelector('#collectionProducts');

const categoryData = {
  Lighting: {
    title: 'Designed to glow.',
    eyebrow: 'Lighting collection',
  },

  Organization: {
    title: 'Made for order.',
    eyebrow: 'Organization collection',
  },

  'Smart Home': {
    title: 'Smarter living.',
    eyebrow: 'Smart home collection',
  },

  Bathroom: {
    title: 'Everyday rituals.',
    eyebrow: 'Bathroom collection',
  },

  Kitchen: {
    title: 'Better kitchen.',
    eyebrow: 'Kitchen collection',
  },

  'Home Decor': {
    title: 'Complete the space.',
    eyebrow: 'Home decor collection',
  },
};

const currentCollection = categoryData[category];

if (!currentCollection) {
  collectionTitle.textContent = 'All collections';

  collectionEyebrow.textContent = 'Collection';
} else {
  collectionTitle.textContent = currentCollection.title;

  collectionEyebrow.textContent = currentCollection.eyebrow;
}

const filteredProducts = products.filter(product => {
  if (!category) {
    return true;
  }

  return product.category === category;
});

collectionCount.textContent = `${filteredProducts.length} products`;

if (filteredProducts.length === 0) {
  collectionProducts.innerHTML = `
    <p class="products-empty">
      No products found in this collection.
    </p>
  `;
} else {
  collectionProducts.innerHTML = filteredProducts
    .map(product => {
      return `
      <article class="product-card">

        <a
          class="product-card__link"
          href="product.html?id=${product.id}"
        >

          <div class="product-card__image">

            <img
              src="${product.image}"
              alt="${product.title}"
            >

          </div>

          <div class="product-card__info">

            <p class="product-card__category">
              ${product.category}
            </p>

            <h2 class="product-card__title">
              ${product.title}
            </h2>

            <div class="product-card__rating">
              ★★★★★
              <span>
                (${product.reviews})
              </span>
            </div>

            <div class="product-card__price">

              <strong>
                $${product.price.toFixed(2)}
              </strong>

              ${
                product.oldPrice
                  ? `<del>$${product.oldPrice.toFixed(2)}</del>`
                  : ''
              }

            </div>

          </div>

        </a>

      </article>
    `;
    })
    .join('');
}
