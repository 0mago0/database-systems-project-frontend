<template>
  <div class="add-product-view">
    <v-card class="rounded-xl pa-8" elevation="0" style="box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;">
      <div class="d-flex align-center mb-8">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          color="grey-darken-1"
          class="mr-4"
          @click="goBack"
        ></v-btn>
        <div>
          <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-1">新增商品</h2>
          <div class="text-subtitle-1 text-grey">建立新的商品項目</div>
        </div>
      </div>

      <v-form @submit.prevent="addProduct" ref="form">
        <v-row>
          <v-col cols="12" md="8">
            <v-card variant="outlined" class="pa-6 rounded-lg border-opacity-50" color="grey-lighten-2">
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-4">基本資訊</div>
              
              <v-text-field
                v-model="newProduct.name"
                label="商品名稱"
                variant="outlined"
                color="deep-purple-accent-3"
                bg-color="white"
                prepend-inner-icon="mdi-tag-outline"
                class="mb-2"
                :rules="[v => !!v || '請輸入商品名稱']"
              ></v-text-field>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="newProduct.price"
                    label="價格"
                    type="number"
                    variant="outlined"
                    color="deep-purple-accent-3"
                    bg-color="white"
                    prefix="¥"
                    class="mb-2"
                    :rules="[v => v >= 0 || '價格不能為負數']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="newProduct.quantity"
                    label="庫存數量"
                    type="number"
                    variant="outlined"
                    color="deep-purple-accent-3"
                    bg-color="white"
                    prepend-inner-icon="mdi-package-variant"
                    class="mb-2"
                    :rules="[v => v >= 0 || '庫存不能為負數']"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-textarea
                v-model="newProduct.description"
                label="商品描述"
                variant="outlined"
                color="deep-purple-accent-3"
                bg-color="white"
                rows="4"
                prepend-inner-icon="mdi-text-box-outline"
                :rules="[v => !!v || '請輸入商品描述']"
              ></v-textarea>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card variant="outlined" class="pa-6 rounded-lg border-opacity-50 h-100" color="grey-lighten-2">
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-4">商品圖片</div>
              
              <div class="d-flex flex-column align-center justify-center mb-6">
                <v-avatar
                  size="200"
                  rounded="lg"
                  color="grey-lighten-4"
                  class="elevation-2 mb-4"
                >
                  <v-img
                    v-if="base64Image"
                    :src="base64Image"
                    cover
                  ></v-img>
                  <v-icon
                    v-else
                    icon="mdi-image-plus"
                    size="64"
                    color="grey-lighten-1"
                  ></v-icon>
                </v-avatar>
                
                <v-file-input
                  label="上傳圖片"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  accept="image/*"
                  color="deep-purple-accent-3"
                  bg-color="white"
                  class="w-100"
                  @change="handleImageUpload"
                  :rules="[v => !!base64Image || '請上傳商品圖片']"
                ></v-file-input>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-8">
          <v-btn
            variant="text"
            color="grey-darken-1"
            size="large"
            class="mr-4"
            @click="goBack"
          >
            取消
          </v-btn>
          <v-btn
            type="submit"
            color="deep-purple-accent-3"
            size="large"
            elevation="2"
            prepend-icon="mdi-plus"
            :loading="loading"
          >
            新增商品
          </v-btn>
        </div>
      </v-form>
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
      loading: false,
      newProduct: {
        name: "",
        quantity: 0,
        price: 0,
        description: "",
        memberid: null,
        image: null,
      },
      base64Image: null,
    };
  },
  created() {
    const token = cookies.get('token');
    if (token) {
      this.newProduct.memberid = jwtDecode(token).Member_Id;
    }
  },
  methods: {
    goBack() {
      this.$router.push("/store");
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.newProduct.image = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        this.base64Image = e.target.result;
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
    },
    async addProduct() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;
      
      if (!this.base64Image) {
        alert("請上傳商品圖片");
        return;
      }

      this.loading = true;
      try {
        const response = await axios.post("http://localhost:3002/seller/api/updateProduct", {
          name: this.newProduct.name,
          price: this.newProduct.price,
          quantity: this.newProduct.quantity,
          description: this.newProduct.description,
          memberid: this.newProduct.memberid,
          base64: this.base64Image
        });

        if (response.data.success) {
          alert("商品新增成功！");
          this.$router.push("/store");
        } else {
          alert("新增失敗: " + response.data.message);
        }
      } catch (error) {
        console.error("新增商品失敗:", error);
        alert("新增商品失敗，請稍後再試。");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.add-product-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>