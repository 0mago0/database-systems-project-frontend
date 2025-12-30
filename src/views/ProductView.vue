<template>
  <div class="product-view">
    <HeadMenu/>

    <v-container class="product-container">
      <v-row justify="center" class="product-content">
        <!-- 左侧部分：商品圖片 -->
        <v-col cols="12" md="6" class="left-panel">
          <div class="image-wrapper">
            <v-img :src="test_path" class="product-image" cover></v-img>
          </div>
        </v-col>

        <!-- 右侧部分：商品資訊 -->
        <v-col cols="12" md="6" class="right-panel">
          <div class="product-details">
            <h1 class="product-title">{{ title }}</h1>
            
            <div class="product-description" v-html="Descrip"></div>

            <div class="purchase-section">
              <!-- 數量選擇 -->
              <v-select
                v-model="quantity"
                :items="quantityOptions"
                label="選擇數量"
                variant="outlined"
                color="deep-purple-accent-3"
                class="quantity-select"
                density="comfortable"
              ></v-select>

              <button @click="HandleBuy" class="buy-button">
                加入購物車
              </button>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- 顧客評論與給分 -->
            <div class="review-section">
              <h3 class="section-title">顧客評論</h3>
              
              <div class="review-input-area">
                <v-rating 
                  v-model="rating" 
                  color="amber-darken-2" 
                  hover 
                  density="compact"
                  class="mb-2"
                ></v-rating>
                
                <v-textarea
                  v-model="review"
                  label="寫下您的評論..."
                  rows="3"
                  variant="outlined"
                  color="deep-purple-accent-3"
                  class="review-textarea"
                  auto-grow
                ></v-textarea>
                
                <v-btn 
                  @click="submitReview" 
                  color="deep-purple-accent-3" 
                  variant="flat"
                  class="submit-review-btn text-none"
                >
                  提交評論
                </v-btn>
              </div>

              <!-- 顯示所有評論 -->
              <div v-if="reviews.length" class="reviews-list">
                <div v-for="(item, index) in reviews" :key="index" class="review-item">
                  <div class="review-header">
                    <div class="user-avatar">
                      <v-icon icon="mdi-account" color="grey-darken-1"></v-icon>
                    </div>
                    <div class="review-meta">
                      <span class="reviewer-name">User {{ index + 1 }}</span>
                      <v-rating 
                        :model-value="item.rating" 
                        color="amber-darken-2" 
                        density="compact" 
                        size="small" 
                        readonly
                      ></v-rating>
                    </div>
                  </div>
                  <p class="review-text">{{ item.text }}</p>
                </div>
              </div>
              <div v-else class="no-reviews">
                <p>目前還沒有評論，成為第一個評論的人吧！</p>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: "LeftRightLayout",
  components: {
    HeadMenu
  },
  data() {
    return {
      test_path: null,
      Descrip: null,
      title: null,
      quantity: 1,  // 初始購買數量設為 1
      quantityOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  // 可選擇的數量範圍
      rating: 0, // 評分
      review: "", // 評論文字
      reviews: [], // 所有評論
      product_info: axios
        .get("http://localhost:3002/api/product/GetProductInfo", {
          params: {
            id: this.$route.params.id
          }
        })
        .then(response => {
          this.title = response.data[0].Product_name;
          this.product_info = response.data;
          this.Descrip = response.data[0].Descrip.replace(/\n/g, "<br>");
          console.log(response.data[0].Image_path);
          this.test_path =response.data[0].Image_path;
          console.log(this.Descrip);
          console.log(this.product_info.data[0].Image_path);
        })
        .catch(error => {
          console.error(error);
        })
    };
  },
  methods: {
    async HandleBuy() {
      console.log(jwtDecode(cookies.get('token')).Member_Id) ; 
      try {
        const response = await axios.post("http://localhost:3002/api/cart/PostProductCart", {
          param: {
            product_id: this.$route.params.id,  // 取得商品 ID
            member_id: jwtDecode(cookies.get('token')).Member_Id,  // 取得會員 ID
            quantity: this.quantity  // 發送選擇的數量
          }
        });

        // 顯示成功加入購物車的訊息
        if (response.data.success) {
          alert("商品已成功加入購物車!");
          window.location.reload();
        } else {
          alert("加入購物車失敗，請稍後再試");
        }
      } catch (error) {
        console.error("加入購物車時發生錯誤:", error);
        alert("加入購物車失敗，請稍後再試");
      }
    },
    submitReview() {
      if (this.rating > 0 && this.review.trim()) {
        this.reviews.push({
          rating: this.rating,
          text: this.review
        });
        this.rating = 0;
        this.review = "";
      } else {
        alert("請提供評分和評論！");
      }
    }
  }
};
</script>

<style scoped>
.product-view {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 60px;
}

.product-container {
  margin-top: 80px; /* Adjust for fixed header */
  max-width: 1200px;
}

.product-content {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin: 20px;
}

.left-panel {
  padding: 0;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.product-image {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.right-panel {
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-family: 'fantasy', sans-serif;
  font-size: 32px;
  color: #1d1d1f;
  margin-bottom: 20px;
  line-height: 1.2;
  background: linear-gradient(45deg, #954bdb, #b388eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.product-description {
  font-size: 16px;
  line-height: 1.6;
  color: #424245;
  margin-bottom: 30px;
}

.purchase-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.quantity-select {
  max-width: 150px;
}

.buy-button {
  flex-grow: 1;
  max-width: 300px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #954bdb, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(149, 75, 219, 0.3);
  height: 56px; /* Match v-select height */
}

.buy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(149, 75, 219, 0.4);
}

.buy-button:active {
  transform: translateY(0);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 20px;
}

.review-input-area {
  background-color: #fbfbfd;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-meta {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

.review-text {
  font-size: 15px;
  color: #424245;
  line-height: 1.5;
}

.no-reviews {
  text-align: center;
  color: #86868b;
  padding: 40px 0;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .purchase-section {
    flex-direction: column;
    gap: 10px;
  }
  
  .quantity-select, .buy-button {
    max-width: 100%;
    width: 100%;
  }
  
  .image-wrapper {
    min-height: 300px;
  }
}
</style>
