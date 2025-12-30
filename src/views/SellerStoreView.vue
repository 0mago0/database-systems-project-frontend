<template>
  <div class="seller-dashboard">
    <HeadMenu />
    
    <v-container class="dashboard-container">
      <div class="page-header text-center mb-8">
        <h1 class="title">SELLER CENTER</h1>
        <h2 class="subtitle">賣家管理中心</h2>
      </div>

      <!-- Dashboard Navigation Cards -->
      <v-row justify="center" class="mb-8">
        <v-col cols="12" md="10" lg="8">
          <v-card class="action-card rounded-xl pa-6" elevation="0">
            <div class="d-flex flex-wrap justify-center gap-4 action-buttons">
              <v-btn
                prepend-icon="mdi-plus-circle-outline"
                color="deep-purple-accent-3"
                class="text-white action-btn"
                height="48"
                rounded="lg"
                elevation="2"
                @click="goToAddProductPage"
              >
                新增商品
              </v-btn>
              
              <v-btn
                prepend-icon="mdi-clipboard-list-outline"
                variant="outlined"
                color="deep-purple-accent-2"
                class="action-btn"
                height="48"
                rounded="lg"
                @click="goToSearchOrdersPage"
              >
                查詢訂單
              </v-btn>
              
              <v-btn
                prepend-icon="mdi-package-variant-closed"
                variant="outlined"
                color="deep-purple-accent-2"
                class="action-btn"
                height="48"
                rounded="lg"
                @click="goToSearchProductPage"
              >
                查詢所有商品
              </v-btn>

              <v-btn
                prepend-icon="mdi-logout"
                variant="outlined"
                color="error"
                class="action-btn"
                height="48"
                rounded="lg"
                @click="logout"
              >
                登出
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Router View for Child Components -->
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { jwtDecode } from "jwt-decode";
import HeadMenu from '@/components/HeadMenu.vue';

export default {
  name: 'SellerStoreView',
  components: {
    HeadMenu
  },
  data() {
    return {
      sellerProducts: [], // 賣家商品列表
      sellerId: null,
    };
  },
  created() {
    const token = cookies.get('token');
    if (token) {
      this.sellerId = jwtDecode(token).Member_Id;
    }
  },
  mounted() {
    if (this.sellerId) {
      this.fetchSellerProducts();
    }
  },
  methods: {
    goToSearchProductPage(){
      this.$router.push("/store/products");
    },
    goToSearchOrdersPage() {
      this.$router.push("/store/orders");
    },
    goToMainPage() {
      this.$router.push("/");
    },
    goToAddProductPage() {
      this.$router.push("/addProduct");
    },
    async fetchSellerProducts() {
      try {
        const response = await axios.get("http://localhost:3002/seller/api/products", {
          params: { sellerId: this.sellerId },
        });

        if (response.data.success) {
          this.sellerProducts = response.data.data;
        } else {
          console.error("無法獲取商品列表:", response.data.message);
        }
      } catch (error) {
        console.error("API 呼叫失敗:", error);
      }
    },
    logout() {
      cookies.remove('token');
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.seller-dashboard {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 60px;
}

.dashboard-container {
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

.action-card {
  background: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04) !important;
}

.action-buttons {
  gap: 16px;
}

.action-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  min-width: 160px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
