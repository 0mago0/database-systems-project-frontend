<template>
    <div class="headmenu">
    <nav>
      <div class="wrapper">
        <div class="logo">
          <!--a href="#">animate</a-->
          <router-link to="/"><img alt="Vue logo"  width="10%" src="../assets/logo.png" /></router-link>
        </div>
        <input type="radio" name="slide" id="menu_btn" /><input type="radio" name="slide" id="cancel_btn" />
        <ul class="nav_links">
          <label for="cancel_btn" class="btn cancel_btn">
            <i class="fas fa-times"></i>
          </label>
          <li><router-link to="/product">商品</router-link></li>
          <li><a href="#">數位商品</a></li>
          <li>
            <a href="#" class="desktop_item">動漫分類</a>
            <input type="checkbox" id="showDrop" />
            <label for="showDrop" class="mobile_item">Dropdown Menu</label>
            <ul class="drop_menu">
              <li><a href="#">排球少年</a></li>
              <li><a href="#">世界計畫 繽紛舞台！ feat.初音未來</a></li>
              <li><a href="#">名偵探柯南</a></li>
              <li><a href="#">ALIEN STAGE</a></li>
              <li><a href="#">BLUE LOCK 藍色監獄</a></li>
              <li><a href="#">咒術迴戰</a></li>
            </ul>
          </li>
          <li>
            <a href="#" class="desktop_item">所有產品清單</a>
            <ul class="drop_menu">
              <li><a href="#">Drop Menu 1</a></li>
              <li><a href="#">Drop Menu 2</a></li>
              <li><a href="#">Drop Menu 3</a></li>
              <li><a href="#">Drop Menu 4</a></li>
              <li><a href="#">Drop Menu 5</a></li>
              <li><a href="#">Drop Menu 6</a></li>
            </ul>
          </li>
          <li><a href="#">常見問題</a></li>
          <li><router-link to="/member">會員</router-link></li>

          <li>
            <!-- 購物車按鈕 -->
            <v-btn icon @click="drawerVisible = true">
              <v-icon>mdi-cart</v-icon>
            </v-btn>
          </li>
        </ul>
        <label for="menu_btn" class="btn menu_btn">
          <i class="fas fa-bars"></i>
        </label>
      </div>
    </nav>

        <!-- 購物車抽屜 -->
        <v-navigation-drawer :width="400" v-model="drawerVisible" color="grey-lighten-2" location="end" temporary>
  <v-container class="d-flex justify-center align-center h-100">
    <v-row>
      <v-col v-if="cartItems.length === 0" class="text-center" cols="12">
        <p style="margin-bottom: 16px;">カートが空です</p>
      </v-col>

      <v-col v-for="(item, index) in cartItems" :key="index" class="d-flex align-center" cols="12">
        <v-img :src="item.Image_path" width="100px" height="100px" class="mr-3"></v-img>
        <div class="text-container" style="flex-grow: 1;">
          <p>{{ item.Product_Id }} - {{ item.price }}円 x {{ item.Quantity }}</p>
        </div>
        <v-btn color="red" @click="removeCartItem(item.Product_Id)">移除</v-btn>
      </v-col>

      <v-col class="text-center" cols="12" v-if="cartItems.length > 0">
        <v-btn color="purple lighten-2" large>
          <router-link to="/checkout" style="color: white; text-decoration: none;">結帳</router-link>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</v-navigation-drawer>

    </div>

</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import axios from "axios"
import { jwtDecode } from "jwt-decode";
export default {
  name: "HeadMenu",
  data() {
    return {
      drawerVisible: false, // 控制購物車抽屜的開關
      cartItems: [],
    };
  },
  methods:{
    fetchCartItems() {
  // 獲取並解碼 JWT token 以取得 member_id
  const token = cookies.get('token'); // 從 cookies 取得 token
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // 解碼 token
      const memberId = decodedToken.Member_Id; // 確保你的 token 中包含 Member_Id
      
      // 發送請求到後端獲取該會員的購物車資料
      axios.get("http://localhost:3002/api/cart/GetCartItems", {
        params: { member_id: memberId },
      })
      .then((response) => {
        // 遍歷返回的資料，更新圖片路徑為完整的 URL
        this.cartItems = response.data.map((item) => {
          return {
            ...item,
            Image_path: item.Image_path, // 解析圖片路徑
          };
        });
      })
      .catch((error) => {
        console.error("獲取購物車資料失敗", error);
      });
    } catch (error) {
      console.error("解碼 token 失敗", error);
    }
  } else {
    console.log("沒有找到 token");
  }
},
    removeCartItem(productId) {
  const token = cookies.get('token'); // 從 cookies 獲取 token
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // 解碼 token
      const memberId = decodedToken.Member_Id; // 取得會員 ID

      axios.delete("http://localhost:3002/api/cart/RemoveCartItem", {
        data: {
          member_id: memberId,
          product_id: productId,
        },
      })
        .then((response) => {
          if (response.data.success) {
            // 移除成功，重新加載購物車資料
            this.fetchCartItems();
          } else {
            console.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error("移除購物車商品失敗", error);
        });
    } catch (error) {
      console.error("解碼 token 失敗", error);
    }
  } else {
    console.log("沒有找到 token");
  }
}
  }, mounted() {
    // 當組件掛載後立即載入購物車資料
    this.fetchCartItems();
  },
};
</script>

<style scoped>
    * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

nav {
  background-color: #ffffff;
  position: fixed;
  width: 100%;
  z-index: 999;
  height: 65px;
  line-height: 60px;

}

nav .wrapper {
  position: relative;
  max-width: 12500px;
  padding: 0 40px;
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  top:5px
}

.wrapper .nav_links {
  display: flex;
}

.wrapper .logo,image {
  position: relative;
  top: 0px;

}

.wrapper .logo a,
.nav_links li a {

  color: #000000;
  text-decoration: none;
}
.wrapper .logo a {
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
}



.nav_links li a {
  font-size: 15px;
  font-weight: 500;
  border-radius: 5px;
  padding: 9px 15px;
  transition: all 0.3s ease;
}

.nav_links li {
  list-style-type: none;
}
.nav_links li a:hover {
  background: #dfe1e4;
}
.nav_links .mobile_item {
  display: none;
}

/**********************************
            Drop Down Menu             
*********************************** */

.nav_links .drop_menu {
  position: absolute;
  top: 44px;
  width: 180px;
  line-height: 45px;
  background-color: #ffffff;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}
.nav_links li:hover .drop_menu,
.nav_links li:hover .mega_box {
  top: 44px;
  opacity: 1;
  visibility: visible;
}

.drop_menu li a {
  width: 100%;
  display: block;
  padding: 0 0 0 15px;
  font-weight: 400;
  border-radius: 0px;
}

/**********************************
              Mega Menu             
*********************************** */

.mega_box {
  position: absolute;
  top: 85px;
  left: 0;
  width: 100%;
  padding: 0 30px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mega_box .content {
  background-color: #242526;
  padding: 25px 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.content .row {
  width: calc(25% - 30px);
  line-height: 45px;
}

.content .row header {
  color: #fff;
  font-weight: 800;
  font-size: 20px;
}

.content .row .services_img {
  background-image: url(https://i.pinimg.com/originals/cc/21/4a/cc214a8fc4c81b090c84811ddcfa791c.jpg);
  background-color: #d9d9d9;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.content .row .mega_links {
  margin-left: -40px;
  border-left: 1px solid rgba(255, 255, 255, 0.09);
}
.content .row .first_links {
  border-left: 0px;
}

.row .mega_links li {
  padding: 0 20px;
}
.row .mega_links li a {
  padding: 0 20px;
  color: #d9d9d9;
  font-size: 17px;
  line-height: 45px;
  display: block;
}

/* buttons style */

.wrapper .btn {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: none;
}
.wrapper .btn.cancel_btn {
  position: absolute;
  top: 0;
  right: 10px;
}

/**********************************
          Responsive Styles             
*********************************** */

@media screen and (max-width: 970px) {
  .wrapper .btn {
    display: block;
  }
  .wrapper .nav_links {
    position: fixed;
    height: 100vh;
    width: 100%;
    max-width: 350px;
    background: #242526;
    display: block;
    top: 0;
    left: 0;
    left: -100%;
    overflow-y: auto;
    line-height: 50px;
    padding: 50px 10px;
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.5s ease-in-out;
  }
  #menu_btn:checked ~ .nav_links {
    left: 0%;
  }
  #menu_btn:checked ~ .btn.menu_btn {
    display: none;
  }
  .nav_links::-webkit-scrollbar {
    width: 0px;
  }
  .nav_links li {
    margin: 15px 10px;
  }
  .nav_links li a {
    padding: 0 20px;
    display: block;
    font-size: 20px;
  }

  /* drop down responsive */

  .nav_links .drop_menu {
    position: static;
    opacity: 1;
    visibility: visible;
    top: 65px;
    padding-left: 20px;
    width: 100%;
    max-height: 0px;
    overflow: hidden;
  }

  #showDrop:checked ~ .drop_menu {
    max-height: 100%;
  }
  .nav_links .drop_menu li {
    margin: 0;
  }
  .nav_links .drop_menu li a {
    font-size: 18px;
    border-radius: 5px;
  }
  .nav_links .desktop_item {
    display: none;
  }
  .nav_links .mobile_item {
    display: block;
    font-size: 20px;
    color: #f2f2f2;
    font-weight: 500;
    padding-left: 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
  }
  .nav_links .mobile_item:hover {
    background: #3a3b3c;
  }

  /* Mega menu responsive */

  .mega_box {
    position: static;
    top: 65px;
    width: 100%;
    padding: 0 20px;
    opacity: 1;
    max-height: 0px;
    visibility: visible;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  #showMega:checked ~ .mega_box {
    max-height: 100%;
  }

  .mega_box .content {
    background-color: #242526;
    flex-direction: column;
    padding: 20px 20px 0 20px;
  }
  .mega_box .content .row {
    width: 100%;
    margin-bottom: 15px;
    border-top: 1px solid rgba(131, 110, 110, 0.08);
  }
  .mega_box .content .row:nth-child(1),
  .mega_box .content .row:nth-child(2) {
    border-top: 0px;
  }
  .content .row .services_img {
    height: 200px;
  }
  .content .img_row {
    border-top: none !important;
  }
  .content .row .mega_links {
    border-left: 0px;
    padding-left: 15px;
  }
  .row .mega_links li {
    margin: 0;
  }
  .content .row header {
    font-size: 18px;
  }
}
.wrapper input {
  display: none;
}
</style>
