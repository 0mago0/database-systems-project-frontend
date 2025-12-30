<template>
  <div class="edit-product-view">
    <HeadMenu />
    
    <v-container class="main-container">
      <div class="page-header text-center mb-8">
        <h1 class="title">EDIT PRODUCT</h1>
        <h2 class="subtitle">編輯商品資訊</h2>
      </div>

      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card v-if="product" class="product-card rounded-xl" elevation="0">
            <v-row no-gutters>
              <!-- Left Side: Image -->
              <v-col cols="12" md="5" class="image-section">
                <div class="image-wrapper">
                  <v-img
                    v-if="product.Image_path"
                    :src="product.Image_path"
                    alt="商品圖片"
                    cover
                    class="product-img"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                        <v-progress-circular indeterminate color="purple-lighten-3"></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                  <div v-else class="no-image">
                    <v-icon icon="mdi-image-off" size="48" color="grey-lighten-1"></v-icon>
                    <span>暫無圖片</span>
                  </div>
                </div>
              </v-col>

              <!-- Right Side: Form -->
              <v-col cols="12" md="7">
                <div class="form-section pa-6 pa-md-8">
                  <h3 class="form-title mb-6">商品詳細資訊</h3>
                  
                  <v-form @submit.prevent="updateProduct" ref="form">
                    <v-text-field
                      v-model="editableProduct.Product_name"
                      label="商品名稱"
                      variant="outlined"
                      color="deep-purple-accent-2"
                      bg-color="grey-lighten-5"
                      class="mb-2"
                      prepend-inner-icon="mdi-tag-text-outline"
                    ></v-text-field>

                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="editableProduct.Price"
                          label="價格"
                          type="number"
                          min="0"
                          variant="outlined"
                          color="deep-purple-accent-2"
                          bg-color="grey-lighten-5"
                          prefix="¥"
                          class="mb-2"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="editableProduct.Quantity"
                          label="庫存數量"
                          type="number"
                          min="0"
                          variant="outlined"
                          color="deep-purple-accent-2"
                          bg-color="grey-lighten-5"
                          class="mb-2"
                          prepend-inner-icon="mdi-package-variant"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-textarea
                      v-model="editableProduct.Descrip"
                      label="商品描述"
                      variant="outlined"
                      color="deep-purple-accent-2"
                      bg-color="grey-lighten-5"
                      rows="4"
                      class="mb-6"
                      prepend-inner-icon="mdi-text-box-outline"
                    ></v-textarea>

                    <div class="action-buttons">
                      <v-btn
                        color="grey-lighten-3"
                        variant="flat"
                        class="cancel-btn mr-4"
                        height="48"
                        rounded="lg"
                        @click="$router.go(-1)"
                      >
                        取消
                      </v-btn>
                      
                      <v-btn
                        type="submit"
                        color="deep-purple-accent-3"
                        class="submit-btn text-white"
                        height="48"
                        rounded="lg"
                        elevation="4"
                      >
                        確認修改
                        <v-icon end icon="mdi-check-circle-outline"></v-icon>
                      </v-btn>
                    </div>
                  </v-form>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <div v-else class="no-data text-center mt-12">
            <v-progress-circular indeterminate color="deep-purple-accent-2" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">正在載入商品資訊...</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import HeadMenu from '@/components/HeadMenu.vue';

export default {
  name: 'EditProductView',
  components: {
    HeadMenu
  },
  data() {
    return {
      product: null, // 用於存儲原始商品資料
      editableProduct: {}, // 用於編輯的商品資料
      sellerId: 2, // 賣家 ID，根據需求替換為實際值
    };
  },
  mounted() {
    this.fetchSellerProducts(); // 請求商品資料
  },
  methods: {
    async fetchSellerProducts() {
      try {
        const response = await axios.get(`http://localhost:3002/seller/api/products/${this.$route.params.id}`);

        if (response.data.success && response.data.data) {
          this.product = response.data.data; // 將第一個商品存入資料中
          this.editableProduct = { ...this.product }; // 克隆商品資料，用於編輯
          console.log("成功獲取商品資訊:", this.product);
        } else {
          console.error("無法獲取商品資訊:", response.data.message);
        }
      } catch (error) {
        console.error("API 呼叫失敗:", error);
        alert("無法連接到伺服器，請稍後再試。");
      }
    },
    async updateProduct() {
      try {
        const response = await axios.put("http://localhost:3002/seller/api/updateProduct", this.editableProduct);

        if (response.data.success) {
          alert("商品資訊已成功更新！");
          this.product = { ...this.editableProduct }; // 更新顯示的商品資料
          this.$router.push(`/store`); // 返回商品列表頁面
        } else {
          console.error("更新商品失敗:", response.data.message);
        }
      } catch (error) {
        console.error("更新商品 API 呼叫失敗:", error);
        alert("更新失敗，請稍後再試。");
      }
    },
    getImagePath(relativePath) {
      // 直接返回相對路徑，Vite 會自動處理
      return `/assets/${relativePath.split('/assets/')[1]}`;
    },
  },
};
</script>

<style scoped>
.edit-product-view {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 60px;
}

.main-container {
  padding-top: 100px;
}

.title {
  font-family: 'fantasy', sans-serif;
  font-size: 42px;
  background: linear-gradient(45deg, #954bdb, #b388eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #86868b;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.product-card {
  background: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
}

.image-section {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #bdbdbd;
  gap: 10px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  position: relative;
  padding-left: 16px;
}

.form-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, #954bdb, #b388eb);
  border-radius: 2px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.submit-btn {
  background: linear-gradient(45deg, #954bdb, #7c3aed);
  font-weight: 600;
  letter-spacing: 0.5px;
  flex: 1;
  max-width: 200px;
}

.cancel-btn {
  color: #666;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .image-wrapper {
    min-height: 300px;
  }
}
</style>