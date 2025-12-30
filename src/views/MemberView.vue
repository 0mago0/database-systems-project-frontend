<template>
  <div class="member-view">
    <HeadMenu/>
    
    <v-container class="member-container">
      <div class="page-header">
        <h1 class="title">MEMBER CENTER</h1>
        <h2 class="subtitle">會員中心</h2>
      </div>

      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="member-card">
            <!-- Welcome Section -->
            <div class="welcome-section">
              <div class="user-profile">
                <div class="avatar-placeholder">
                  <v-icon icon="mdi-account" size="40" color="white"></v-icon>
                </div>
                <div class="welcome-text">
                  <h3>Welcome back!</h3>
                  <p>管理您的帳戶與訂單</p>
                </div>
              </div>
              <button class="sign-out-btn" @click="signout">
                <v-icon icon="mdi-logout" class="mr-2" size="small"></v-icon>
                登出
              </button>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Order Section -->
            <div class="order-section">
              <h3 class="section-title">
                <v-icon icon="mdi-package-variant-closed" class="mr-2" color="deep-purple-accent-3"></v-icon>
                歷史訂單
              </h3>
              
              <div v-if="orders.length > 0" class="order-list">
                <div v-for="(order, index) in orders" :key="index" class="order-card">
                  <div class="order-header">
                    <div class="order-info">
                      <span class="order-id">訂單編號 #{{ order.Order_Id }}</span>
                      <span class="order-date">{{ formatDate(order.Order_date) }}</span>
                    </div>
                    <div class="order-status">
                      {{ order.Status }}
                    </div>
                  </div>
                  
                  <v-divider class="my-3"></v-divider>

                  <div class="order-items">
                    <div v-for="(item, i) in order.items" :key="i" class="order-item">
                      <div class="item-image">
                        <v-img :src="item.Image_path" cover></v-img>
                      </div>
                      <div class="item-details">
                        <h4 class="item-name">{{ item.Product_name }}</h4>
                        <div class="item-meta">
                          <span class="item-price">¥{{ item.Price }}</span>
                          <span class="item-quantity">x {{ item.Quantity }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="order-footer">
                    <span class="total-label">訂單總金額</span>
                    <span class="total-amount">¥{{ order.Fee }}</span>
                  </div>
                </div>
              </div>
              
              <div v-else class="no-orders">
                <v-icon icon="mdi-clipboard-text-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <p>目前沒有歷史訂單</p>
                <router-link to="/product" class="shop-link">去逛逛商品</router-link>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import axios from "axios";
import HeadMenu from '@/components/HeadMenu.vue';

export default {
  name: 'MemberView',
  components: {
    HeadMenu
  },
  data() {
    return {
      orders: [], // 儲存用戶的訂單資料
      detail_orders:[]
    };
  },
  methods: {
    fetchOrders() {
      const token = cookies.get('token');
      if (token) {
        const memberId = this.decodeToken(token).Member_Id;
        axios.get('http://localhost:3002/api/order/GetOrders', {
          params: { member_id: memberId }
        })
        .then(response => {
          console.log(response.data.data)
          this.orders = response.data.data || [];

        })
        .catch(error => {
          console.error('Failed to fetch orders:', error);
        });
      }
    },
    decodeToken(token) {
      try {
        return JSON.parse(atob(token.split('.')[1])); // 簡單解析 JWT
      } catch (error) {
        console.error('Failed to decode token:', error);
        return {};
      }
    },
    signout() {
      try {
        cookies.remove('token');
        alert("You have been logged out successfully.");
        this.$router.push('/');
      } catch (error) {
        alert("Logout failed, please try again.");
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    this.fetchOrders(); // 頁面載入時獲取訂單資料
  }
};
</script>

<style scoped>
.member-view {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 60px;
}

.member-container {
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

.member-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #954bdb, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(149, 75, 219, 0.3);
}

.welcome-text h3 {
  font-size: 24px;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.welcome-text p {
  color: #86868b;
  font-size: 14px;
}

.sign-out-btn {
  padding: 10px 20px;
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.sign-out-btn:hover {
  background-color: #e5e5e5;
  border-color: #86868b;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: #954bdb;
  box-shadow: 0 4px 12px rgba(149, 75, 219, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.order-info {
  display: flex;
  flex-direction: column;
}

.order-id {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 16px;
}

.order-date {
  color: #86868b;
  font-size: 13px;
  margin-top: 4px;
}

.order-status {
  padding: 6px 12px;
  background-color: #f5f5f7;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #424245;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
  flex-shrink: 0;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.item-meta {
  font-size: 13px;
  color: #86868b;
}

.item-quantity {
  margin-left: 8px;
  color: #424245;
}

.order-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f5f5f7;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.total-label {
  font-size: 14px;
  color: #86868b;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #954bdb;
}

.no-orders {
  text-align: center;
  padding: 60px 0;
  color: #86868b;
}

.shop-link {
  display: inline-block;
  margin-top: 16px;
  color: #954bdb;
  text-decoration: none;
  font-weight: 500;
}

.shop-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 600px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sign-out-btn {
    width: 100%;
    justify-content: center;
  }
  
  .member-card {
    padding: 20px;
  }
}
</style>
