<template>
  <div class="seller-products">
    <v-card class="rounded-xl pa-6" elevation="0" style="box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;">
      <div class="d-flex align-center mb-6">
        <v-icon icon="mdi-package-variant-closed" color="deep-purple-accent-3" size="32" class="mr-3"></v-icon>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">商品列表</h2>
      </div>

      <v-table hover class="custom-table">
        <thead>
          <tr>
            <th class="text-left font-weight-bold text-deep-purple-accent-3">商品編號</th>
            <th class="text-left font-weight-bold text-deep-purple-accent-3">商品名稱</th>
            <th class="text-center font-weight-bold text-deep-purple-accent-3">庫存</th>
            <th class="text-right font-weight-bold text-deep-purple-accent-3">價格</th>
            <th class="text-center font-weight-bold text-deep-purple-accent-3">圖片</th>
            <th class="text-center font-weight-bold text-deep-purple-accent-3">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in sellerProducts" :key="product.Product_Id">
            <td class="font-weight-medium">#{{ product.Product_Id }}</td>
            <td>{{ product.Product_name }}</td>
            <td class="text-center">
              <v-chip
                :color="product.Quantity > 0 ? 'success' : 'error'"
                size="small"
                variant="flat"
              >
                {{ product.Quantity }}
              </v-chip>
            </td>
            <td class="text-right font-weight-bold text-deep-purple-accent-2">¥{{ product.Price }}</td>
            <td class="text-center py-2">
              <v-avatar size="48" rounded="lg" color="grey-lighten-4">
                <v-img
                  v-if="product.Image_path"
                  :src="product.Image_path"
                  cover
                ></v-img>
                <v-icon v-else icon="mdi-image-off" color="grey-lighten-1"></v-icon>
              </v-avatar>
            </td>
            <td class="text-center">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="deep-purple-accent-2"
                size="small"
                class="mr-2"
                @click="editProduct(product.Product_Id)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                size="small"
                @click="confirmDeleteProduct(product.Product_Id)"
              ></v-btn>
            </td>
          </tr>
          <tr v-if="sellerProducts.length === 0">
            <td colspan="6" class="text-center py-8 text-grey">
              <v-icon icon="mdi-package-variant" size="48" class="mb-2"></v-icon>
              <div>目前沒有商品資料</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { jwtDecode } from "jwt-decode";

export default {
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
    editProduct(productId) {
      this.$router.push("/editProduct/" + productId);
    },
    confirmDeleteProduct(productId) {
      const isConfirmed = window.confirm(`確定要刪除商品 ID: ${productId} 嗎？`);
      if (isConfirmed) {
        this.deleteProduct(productId);
      }
    },
    async deleteProduct(productId) {
      try {
        const response = await axios.delete(`http://localhost:3002/seller/api/products/${productId}`);
        if (response.data.success) {
          alert(`商品 ID: ${productId} 已成功刪除！`);
          this.fetchSellerProducts();
        } else {
          alert("刪除失敗：" + response.data.message);
        }
      } catch (error) {
        console.error("刪除商品 API 呼叫失敗:", error);
        alert("刪除失敗，請稍後再試。");
      }
    }
  },
};
</script>

<style scoped>
.seller-products {
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
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
</style>
