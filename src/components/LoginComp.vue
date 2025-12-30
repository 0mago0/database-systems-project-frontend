

<template>
  <div class="login-card">
    <div class="card-header">
      <h1 class="title">Login</h1>
      <p class="subtitle">歡迎回來，請登入您的帳號</p>
    </div>
    
    <div class="form-group">
      <label class="label">Email</label>
      <input 
        class="input-field" 
        type="email" 
        v-model="account" 
        placeholder="name@example.com" 
        autocomplete="email" 
        required
      >
    </div>
    
    <div class="form-group">
      <label class="label">Password</label>
      <input 
        class="input-field" 
        type="password" 
        v-model="password" 
        placeholder="••••••••" 
        required 
        autocomplete="current-password"
      />
    </div>
    
    <div class="form-actions">
      <div class="remember-me">
        <input type="checkbox" id="remember" class="checkbox" />
        <label for="remember">記住我</label>
      </div>
      <a href="#" class="forgot-password">忘記密碼?</a>
    </div>
    
    <button @click="handleLogin" class="btn-primary">登入</button>
    
    <div class="divider">
      <span>或是</span>
    </div>
    
    <router-link to="/register" class="register-link">
      <button class="btn-secondary">註冊新帳號</button>
    </router-link>
  </div>
</template>

<script>

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import axios from "axios"
import { jwtDecode } from "jwt-decode";
axios.defaults.withCredentials = true

export default {
    name: 'LoginComp',
    data() {

    },
    methods: {
        async handleLogin() {
            try {
                // 發送 GET 請求，帶上使用者輸入的帳號和密碼
                const response = await axios.get('http://localhost:3002/api/member/CheckMemberAccount', {
                    params: {
                        account: this.account,
                        password: this.password
                    }
                });
                //   console.log(response.data);
                if (response.data.success) {
                    cookies.set('token', response.data.token);
                    console.log(jwtDecode(cookies.get('token')).Authority)
                    alert('登入成功');
                    this.$router.push('/');

                } else {
                    alert('登入失敗');
                }
            } catch (error) {
                console.error(error);

                alert('登入失敗，請檢查伺服器連接');
            }

        }
    }
}
</script>
<style scoped>
.login-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(149, 75, 219, 0.15);
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-family: 'fantasy', sans-serif;
  font-size: 36px;
  background: linear-gradient(45deg, #954bdb, #b388eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.subtitle {
  color: #86868b;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #fbfbfd;
}

.input-field:focus {
  outline: none;
  border-color: #954bdb;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(149, 75, 219, 0.1);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #424245;
}

.checkbox {
  accent-color: #954bdb;
  width: 16px;
  height: 16px;
}

.forgot-password {
  color: #954bdb;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #954bdb, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(149, 75, 219, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(149, 75, 219, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.divider {
  margin: 24px 0;
  text-align: center;
  position: relative;
}

.divider::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: #e5e5e5;
  z-index: 0;
}

.divider span {
  background-color: white;
  padding: 0 10px;
  color: #86868b;
  font-size: 12px;
  position: relative;
  z-index: 1;
}

.register-link {
  text-decoration: none;
  display: block;
}

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: white;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #f5f5f7;
  border-color: #86868b;
}
</style>
