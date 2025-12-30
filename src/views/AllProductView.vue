<template>
  <div class="all-products-view">
    <!-- Header -->
    <HeadMenu />

    <!-- 主內容 -->
    <div class="main-content">
      <div class="section-header">
        <h1 class="title">ALL PRODUCTS</h1>
        <h2 class="subtitle">全商品一覧</h2>
      </div>

      <v-container class="products-container">
        <v-row>
          <v-col
            v-for="(product, index) in products"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="product-col"
          >
            <router-link :to="`/product/${product.product_id}`" class="product-link">
              <ProductCard
                :image="product.Image_path"
                :category="product.Category || 'General'" 
                :name="product.Product_name"
                :price="`¥${product.Price}`"
              />
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import ProductCard from "@/components/ProductCard.vue";
import axios from "axios";

export default {
  name: "AllProductView",
  components: {
    HeadMenu,
    ProductCard,
  },
  data() {
    return {
      products: [], // 初始化為空陣列
    };
  },
  methods: {
    fetchProducts() {
      axios
        .get("http://localhost:3002/api/product/GetAllProduct")
        .then((response) => {
          this.products = response.data.map((product) => ({
            product_id: product.product_id,
            Image_path: product.Image_path,
            Product_name: product.Product_name,
            Price: product.Price,
            Descip: product.Descip, // 商品描述（若需要展示）
            Quantity: product.Quantity, // 庫存數量（若需要展示）
            Category: product.Category // Assuming API returns category, otherwise default in template
          }));
        })
        .catch((error) => {
          console.error("API 請求錯誤", error);
        });
    },
  },
  mounted() {
    this.fetchProducts(); // 組件掛載後請求商品資料
  },
};
</script>

<style scoped>
.all-products-view {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 60px;
}

.main-content {
  padding-top: 100px; /* Space for fixed header */
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 0 20px;
}

.title {
  font-family: 'fantasy', sans-serif;
  font-size: 42px;
  background: linear-gradient(45deg, #954bdb, #b388eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: #86868b;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.products-container {
  padding: 0 20px;
}

.product-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

.product-col {
  padding: 12px;
}
</style>
