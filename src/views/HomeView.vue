<template>

  <div class="home">
    <HeadMenu/>
    <div class = "slidshowimage">
      <Slidshowimage/>
    </div>
  </div>
  <div class ="newarrival">
      <div class="section-header">
        <h1>NEW ARRIVAL</h1>
        <h2 class="subtitle">新商品</h2>
      </div>
      
      <v-container>
        <v-row justify="center" class="products-grid">
          <v-col v-for="(item, index) in getimage(1)" :key="'row1-'+index" cols="12" sm="6" md="3" class="product-col">
            <div class="product-card">
              <div class="image-wrapper">
                <v-img :src="item.src" cover class="product-image"></v-img>
              </div>
              <div class="product-info">
                <p class="product-name">{{ item.description || '精選商品' }}</p>
                <v-btn variant="text" color="deep-purple-accent-3" class="view-btn">查看詳情</v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row justify="center" class="products-grid mt-4">
          <v-col v-for="(item, index) in getimage(5)" :key="'row2-'+index" cols="12" sm="6" md="3" class="product-col">
            <div class="product-card">
              <div class="image-wrapper">
                <v-img :src="item.src" cover class="product-image"></v-img>
              </div>
              <div class="product-info">
                <p class="product-name">{{ item.description || '熱門推薦' }}</p>
                <v-btn variant="text" color="deep-purple-accent-3" class="view-btn">查看詳情</v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  <div class = "testlogic">

    </div>
</template>

<script>

import HeadMenu from '@/components/HeadMenu.vue'
import Slidshowimage from '@/components/SlideshowImage.vue'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

// 使用 import.meta.glob 來動態導入圖片
const imageModules = import.meta.glob('../assets/test*.jpg', { eager: true, import: 'default' });

// 轉換成陣列並排序
const getImageArray = () => {
  const images = [];
  for (let i = 1; i <= 8; i++) {
    const key = `../assets/test${i}.jpg`;
    if (imageModules[key]) {
      images.push({
        src: imageModules[key],
        description: ``
      });
    }
  }
  return images;
};

export default {
  name: 'HomeView' ,
  components: {
    HeadMenu,Slidshowimage
  },
  data:function(){
    const allImages = getImageArray();
    return {
      loginstate : cookies.get('LoggedIn'),
      images: allImages.slice(0, 4),
      images2: allImages.slice(4, 8),
    }
  },
  computed:{
    getimage(){
      return(index) =>{
        const allImages = getImageArray();
        return allImages.slice(index, index + 4);
      };
    }
  }
}
</script>

<style scoped>
.home {
  background-color: #f5f5f7; /* Apple-like light gray background */
  min-height: 100vh;
  padding-bottom: 50px;
}

.slidshowimage {
  position: relative;
  margin-top: 65px; /* Match HeadMenu height */
  width: 100%;
  margin-bottom: 80px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  overflow: hidden;
}

.newarrival {
  position: relative;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.newarrival h1 {
  font-size: 42px;
  font-family: 'fantasy', sans-serif; /* Keeping the requested font */
  background: linear-gradient(45deg, #954bdb, #b388eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #86868b;
  font-weight: 400;
  letter-spacing: 1px;
}

.product-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(149, 75, 219, 0.15);
}

.image-wrapper {
  overflow: hidden;
  aspect-ratio: 1;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-info {
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 12px;
  line-height: 1.4;
}

.view-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .newarrival h1 {
    font-size: 32px;
  }
  
  .slidshowimage {
    top: 80px;
    margin-bottom: 100px;
  }
}
</style>