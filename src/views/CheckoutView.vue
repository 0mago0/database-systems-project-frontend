<template>
  <div class="checkout-view">
    <HeadMenu/>
    
    <v-container class="checkout-container">
      <div class="page-header">
        <h1 class="title">CHECKOUT</h1>
        <h2 class="subtitle">結帳</h2>
      </div>

      <v-row>
        <!-- Left Column: Order Summary -->
        <v-col cols="12" md="7">
          <div class="section-card">
            <h3 class="section-title">訂單內容</h3>
            
            <div v-if="cartItems.length === 0" class="empty-cart">
              <v-icon icon="mdi-cart-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
              <p>您的購物車目前是空的。</p>
              <router-link to="/product" class="continue-shopping">去逛逛商品</router-link>
            </div>

            <div v-else class="cart-list">
              <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
                <div class="item-image">
                  <v-img :src="item.Image_path" cover></v-img>
                </div>
                <div class="item-details">
                  <h4 class="item-name">{{ item.Product_name || ('商品 ID: ' + item.Product_Id) }}</h4>
                  <p class="item-price">¥{{ item.price }}</p>
                </div>
                <div class="item-quantity">
                  <span>x {{ item.Quantity }}</span>
                </div>
                <div class="item-total">
                  ¥{{ item.price * item.Quantity }}
                </div>
              </div>
            </div>
            
            <div class="cart-summary" v-if="cartItems.length > 0">
               <div class="summary-row total">
                 <span>小計</span>
                 <span>¥{{ totalAmount }}</span>
               </div>
            </div>
          </div>
        </v-col>

        <!-- Right Column: Checkout Form -->
        <v-col cols="12" md="5">
          <div class="section-card sticky-card">
            <h3 class="section-title">配送資訊</h3>
            
            <v-form ref="form" class="checkout-form">
              <v-text-field 
                v-model="shippingAddress" 
                label="送貨地址" 
                variant="outlined"
                color="deep-purple-accent-3"
                prepend-inner-icon="mdi-map-marker"
                class="mb-2"
                required
              ></v-text-field>
        
              <v-select 
                v-model="paymentMethod" 
                :items="paymentOptions" 
                label="支付方式" 
                variant="outlined"
                color="deep-purple-accent-3"
                prepend-inner-icon="mdi-credit-card"
                class="mb-2"
                required
              ></v-select>
              
              <v-select 
                v-model="pickupMethod" 
                :items="pickupOptions" 
                label="取貨方式" 
                variant="outlined"
                color="deep-purple-accent-3"
                prepend-inner-icon="mdi-truck-delivery"
                class="mb-4"
                required
              ></v-select>
              
              <v-divider class="mb-4"></v-divider>
              
              <div class="total-display">
                <span>應付金額</span>
                <span class="amount">¥{{ totalAmount }}</span>
              </div>
        
              <button type="button" class="submit-btn" @click="submitOrder">
                提交訂單
              </button>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
  
  <script>
  import HeadMenu from '@/components/HeadMenu.vue'
  import axios from "axios";
  import { useCookies } from "vue3-cookies";
  const { cookies } = useCookies();
  import { jwtDecode } from "jwt-decode";
  
  export default {
    name: "CheckoutPage",
    components: {
        HeadMenu
    }, 
    data() {
      return {
        cartItems: [],
        shippingAddress: "",
        paymentMethod: "",
        paymentOptions: ["信用卡", "現金支付", "線上支付"], // 支付方式選項
        pickupMethod: "", // 新增的取貨方式
        pickupOptions: ["宅配到府", "超商取貨", "店內取貨"], // 取貨方式選項
      };
    },
    computed: {
      totalAmount() {
        return this.cartItems.reduce((total, item) => total + item.price * item.Quantity, 0);
      },
    },
    methods: {
      fetchCartItems() {
        const token = cookies.get('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const memberId = decodedToken.Member_Id;
  
            axios.get("http://localhost:3002/api/cart/GetCartItems", {
              params: { member_id: memberId },
            })
            .then((response) => {
              this.cartItems = response.data.map((item) => {
                return {
                  ...item,
                  Image_path: item.Image_path,
                };
              });
            })
            .catch((error) => {
              console.error("獲取購物車資料失敗", error);
            });
          } catch (error) {
            console.error("解碼 token 失敗", error);
          }
        }
      },
      submitOrder() {
        const orderData = {
          member_id: jwtDecode(cookies.get("token")).Member_Id,
          items: this.cartItems,
          shippingAddress: this.shippingAddress,
          paymentMethod: this.paymentMethod,
          pickupMethod: this.pickupMethod,
          totalAmount: this.totalAmount,
        };

          axios
            .post("http://localhost:3002/api/order/SubmitOrder", orderData)
            .then((response) => {
              if (response.data.success) {
                // 呼叫 API 清空購物車
                const token = cookies.get("token");
                const memberId = jwtDecode(token).Member_Id;

                axios
                  .delete(`http://localhost:3002/api/cart/ClearCart`, { params: { member_id: memberId } })
                  .then(() => {
                    alert("訂單提交成功!");
                    this.cartItems = []; // 前端清空購物車
                    this.$router.push('/'); // 跳轉到訂單成功頁面
                  })
                  .catch((error) => {
                    console.error("清空購物車失敗", error);
                    alert("清空購物車時發生問題，但訂單已提交成功");
                  });
              } else {
                alert("訂單提交失敗，請稍後再試");
              }
            })
            .catch((error) => {
              console.error("提交訂單失敗", error);
              alert("訂單提交失敗");
            });
        },
    },
    mounted() {
      this.fetchCartItems(); // 組件掛載後立刻加載購物車資料
    },
  };
  </script>
  
  <style scoped>
.checkout-view {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 60px;
}

.checkout-container {
  padding-top: 100px; /* Space for fixed header */
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
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

.section-card {
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}

.sticky-card {
  position: sticky;
  top: 100px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f5f7;
}

/* Cart Items Styles */
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f5f7;
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f9f9f9;
  flex-shrink: 0;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.item-price {
  font-size: 14px;
  color: #86868b;
}

.item-quantity {
  font-size: 14px;
  color: #424245;
  font-weight: 500;
}

.item-total {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  min-width: 80px;
  text-align: right;
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
  color: #86868b;
}

.continue-shopping {
  display: inline-block;
  margin-top: 16px;
  color: #954bdb;
  text-decoration: none;
  font-weight: 500;
}

.continue-shopping:hover {
  text-decoration: underline;
}

.cart-summary {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f5f5f7;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #424245;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin-top: 12px;
  margin-bottom: 0;
}

/* Checkout Form Styles */
.total-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

.amount {
  color: #954bdb;
  font-size: 24px;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #954bdb, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(149, 75, 219, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(149, 75, 219, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 960px) {
  .sticky-card {
    position: static;
  }
  
  .cart-item {
    flex-wrap: wrap;
  }
  
  .item-total {
    width: 100%;
    text-align: left;
    margin-top: 8px;
    padding-left: 96px; /* Align with text */
  }
}
</style>
  