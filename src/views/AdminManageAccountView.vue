<template>
  <div class="admin-manage-account">
    <v-container class="py-12">
      <!-- Header Section -->
      <div class="d-flex align-center justify-space-between mb-8">
        <div>
          <h1 class="text-h3 font-weight-bold text-deep-purple-accent-3 mb-2" style="font-family: 'fantasy' !important;">
            ADMIN DASHBOARD
          </h1>
          <div class="text-subtitle-1 text-grey-darken-1">
            管理員後台 / 用戶管理
          </div>
        </div>
        <div class="d-flex gap-4">
          <v-btn
            prepend-icon="mdi-arrow-left"
            variant="outlined"
            color="deep-purple-accent-2"
            class="mr-4"
            @click="goBack"
          >
            返回上一頁
          </v-btn>
          <v-btn
            prepend-icon="mdi-logout"
            color="error"
            variant="flat"
            elevation="2"
            @click="logout"
          >
            登出
          </v-btn>
        </div>
      </div>

      <!-- User Table Card -->
      <v-card class="rounded-xl pa-6" elevation="0" style="box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;">
        <div class="d-flex align-center mb-6">
          <v-icon icon="mdi-account-group-outline" color="deep-purple-accent-3" size="32" class="mr-3"></v-icon>
          <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">用戶列表</h2>
          <v-spacer></v-spacer>
          <v-chip color="deep-purple-accent-3" variant="tonal" size="small">
            總用戶數: {{ users.length }}
          </v-chip>
        </div>

        <v-table hover class="custom-table">
          <thead>
            <tr>
              <th class="text-left font-weight-bold text-deep-purple-accent-3">用戶編號</th>
              <th class="text-left font-weight-bold text-deep-purple-accent-3">用戶名稱</th>
              <th class="text-left font-weight-bold text-deep-purple-accent-3">Email</th>
              <th class="text-center font-weight-bold text-deep-purple-accent-3">身分</th>
              <th class="text-center font-weight-bold text-deep-purple-accent-3">帳號鎖定</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.Member_Id">
              <td class="font-weight-medium text-grey-darken-2">#{{ user.Member_Id }}</td>
              <td>
                <div class="d-flex align-center">
                  <v-avatar color="deep-purple-lighten-5" size="32" class="mr-2">
                    <span class="text-deep-purple-accent-3 font-weight-bold text-caption">
                      {{ user.Username.charAt(0).toUpperCase() }}
                    </span>
                  </v-avatar>
                  {{ user.Username }}
                </div>
              </td>
              <td class="text-grey-darken-1">{{ user.Email }}</td>
              <td class="text-center">
                <v-chip
                  :color="getAuthorityColor(user.Authority)"
                  size="small"
                  variant="outlined"
                  class="font-weight-bold"
                >
                  {{ user.Authority }}
                </v-chip>
              </td>
              <td class="text-center">
                <div class="d-flex justify-center">
                  <v-switch
                    :model-value="user.Locked"
                    @update:model-value="toggleLock(user)"
                    color="error"
                    hide-details
                    density="compact"
                    inset
                  ></v-switch>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center py-8 text-grey">
                <v-icon icon="mdi-account-off-outline" size="48" class="mb-2"></v-icon>
                <div>目前沒有用戶資料</div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: 'AdminManageAccountView',
  data() {
    return {
      users: [], // 用於存儲用戶資料
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3002/admin/api/adminGetMembers"); // 獲取user和seller數據
        this.users = response.data;
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    async toggleLock(user) {
      const updatedLockStatus = !user.Locked; // 反轉鎖定狀態
      // Optimistic update
      user.Locked = updatedLockStatus;
      
      try {
        await axios.post("http://localhost:3002/admin/api/locked", {
          memberId: user.Member_Id,
          lock: updatedLockStatus,
        });
        // Success notification could be added here
      } catch (error) {
        console.error("Failed to update lock status:", error);
        // Revert on failure
        user.Locked = !updatedLockStatus;
        alert("無法更改鎖定狀態！");
      }
    },
    logout() {
      cookies.remove('token');
      this.$router.push("/login");
    },
    goBack() {
      this.$router.go(-1);
    },
    getAuthorityColor(authority) {
      if (!authority) return 'grey';
      const auth = authority.toLowerCase();
      if (auth.includes('admin')) return 'deep-purple-accent-3';
      if (auth.includes('seller')) return 'info';
      return 'success';
    }
  },
  mounted() {
    this.fetchUsers(); // 初次加載時獲取用戶資料
  },
};
</script>

<style scoped>
.admin-manage-account {
  min-height: 100vh;
  background-color: #f5f5f7;
  background-image: radial-gradient(circle at 10% 20%, rgba(149, 75, 219, 0.05) 0%, transparent 20%),
                    radial-gradient(circle at 90% 80%, rgba(149, 75, 219, 0.05) 0%, transparent 20%);
}

.custom-table {
  background: transparent !important;
}

.custom-table :deep(th) {
  font-size: 14px !important;
  border-bottom: 2px solid #f5f5f7 !important;
  white-space: nowrap;
}

.custom-table :deep(td) {
  font-size: 14px !important;
  color: #424242;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

/* Custom scrollbar for table if needed */
.v-table__wrapper::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.v-table__wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.v-table__wrapper::-webkit-scrollbar-thumb {
  background: #d1c4e9;
  border-radius: 4px;
}

.v-table__wrapper::-webkit-scrollbar-thumb:hover {
  background: #b39ddb;
}
</style>
