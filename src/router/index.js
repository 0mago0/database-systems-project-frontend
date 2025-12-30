import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllProductView from '../views/AllProductView.vue'
import LoginView from '../views/LoginView.vue'
import MemberView from '../views/MemberView.vue'
import ProductView from '../views/ProductView.vue'
import RegisterView from '../views/RegisterView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import SellerStore from '@/views/SellerStoreView.vue'
import EditProduct from '@/views/EditProductView.vue'
import AddProductView from '@/views/AddProductView.vue'
import AdminManageAccountView from '@/views/AdminManageAccountView.vue' // admin路由
import { jwtDecode } from "jwt-decode";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/product',
    name: 'allproduct',
    children: [
      {
        path: '',
        component: AllProductView,
      }
    ]
  },
  {
    path:'/Login',
    name: 'login',
    component: LoginView,
    meta: { Islogined: false },
  },
  {
    path:'/member',
    name: 'member',
    component: MemberView,
  },
  {
    path:'/product/:id',
    name: 'product',
    component: ProductView,
  },
  {
    path:'/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path:'/checkout',
    name:'checkout',
    component: CheckoutView,
  },
  {
    path: '/store',
    name: 'SellerStore',
    component: SellerStore,
    children: [
      {
        path: 'orders',  // 設定一個訂單頁面的路徑
        name: 'SellerOrders',
        component: () => import('@/views/SellerOrdersView.vue')  // 動態引入訂單頁面組件
      },
      {
        path: 'products',  // 新增路由，顯示商品列表
        name: 'SellerProducts',
        component: () => import('@/views/SellerProductsView.vue'),  // 動態引入商品列表組件
      }
    ]
  },
  {
    path: '/editProduct/:id',
    name: 'EditProduct',
    component: EditProduct,
  },
  {
    path: '/addProduct',
    name: 'AddProduct',
    component: AddProductView,
  },
  {   // 新增admin路由
    path: '/adminManageAccount',
    name: 'AdminManageAccount',
    component: AdminManageAccountView,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 添加路由守衛
router.beforeEach((to, from, next) => {
  // 如果進入的路徑是 member 頁面且用戶未登入

  if (to.name === 'member') {
    // 檢查是否有 token 且 token 是否有效
    if (!cookies.get('token') || !jwtDecode(cookies.get('token')).LoggedIn) {
      // 若未登入，重定向到登入頁面
      next({ name: 'login' });
    } else {
      if(jwtDecode(cookies.get('token')).Authority == "seller"){
        next({name : 'SellerStore'});
      }
      if(jwtDecode(cookies.get('token')).Authority == "admin"){
        next({name : 'AdminManageAccount'});
      }

        next();

      // 若已登入，繼續訪問 member 頁面
    }
  } else {
    // 其他頁面，正常進行路由跳轉
    next();
  }

});

export default router;
