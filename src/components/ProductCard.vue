<template>
  <div class="product-card">
    <div class="image-container">
      <v-img :src="image" alt="Product Image" class="product-image" cover></v-img>
    </div>

    <div class="card-content">
      <div class="category-tag">{{ category }}</div>
      <h3 class="product-name">{{ name }}</h3>
      <div class="price-tag">{{ price }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Goods',
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(149, 75, 219, 0.15);
}

.image-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: #f9f9f9;
}

.product-image {
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
}

.category-tag {
  font-size: 12px;
  color: #954bdb;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.price-tag {
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin-top: auto;
}
</style>
  