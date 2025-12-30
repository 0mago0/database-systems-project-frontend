<template>
  <div class="seller-orders">
    <v-card class="rounded-xl pa-6" elevation="0" style="box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;">
      <div class="d-flex align-center mb-6">
        <v-icon icon="mdi-clipboard-list-outline" color="deep-purple-accent-3" size="32" class="mr-3"></v-icon>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">訂單列表</h2>
      </div>

      <v-table hover class="custom-table">
        <thead>
          <tr>
            <th class="text-left font-weight-bold text-deep-purple-accent-3">訂單編號</th>
            <th class="text-left font-weight-bold text-deep-purple-accent-3">顧客名稱</th>
            <th class="text-left font-weight-bold text-deep-purple-accent-3">商品名稱</th>
            <th class="text-center font-weight-bold text-deep-purple-accent-3">數量</th>
            <th class="text-center font-weight-bold text-deep-purple-accent-3">狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="font-weight-medium">#{{ order.Order_Id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ order.Product_name}}</td>
            <td class="text-center">{{ order.quantity }}</td>
            <td class="text-center">
              <v-chip
                :color="getStatusColor(order.Status)"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                {{ order.Status }}
              </v-chip>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="5" class="text-center py-8 text-grey">
              <v-icon icon="mdi-file-search-outline" size="48" class="mb-2"></v-icon>
              <div>目前沒有訂單資料</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      orders: [] , // 用來存放訂單資料
      memberid: null,
    };
  },
  created() {
    const token = cookies.get('token');
    if (token) {
      this.memberid = jwtDecode(token).Member_Id;
    }
  },
  mounted() {
    if (this.memberid) {
      this.fetchOrders();
    }
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:3002/seller/api/orders/GetALLOrders',{
          params: { memberid:  this.memberid  },
        });

        if (response.data.success) {
          this.orders = response.data.data; 
          console.log(this.orders) ; 
        } else {
          console.error("無法獲取訂單資料:", response.data.message);
        }
      } catch (error) {
        console.error("API 呼叫失敗:", error);
      }
    },
    getStatusColor(status) {
      if (!status) return 'grey';
      const s = status.toLowerCase();
      if (s.includes('completed') || s.includes('finish')) return 'success';
      if (s.includes('pending') || s.includes('wait')) return 'warning';
      if (s.includes('cancel')) return 'error';
      return 'info';
    }
  }
};
</script>

<style scoped>
.seller-orders {
  width: 100%;
}

.custom-table {
  background: transparent !important;
}

.custom-table :deep(th) {
  font-size: 14px !important;
  border-bottom: 2px solid #f5f5f7 !important;
}

.custom-table :deep(td) {
  font-size: 14px !important;
  color: #424242;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}
</style>