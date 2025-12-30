<template>
  <div class="register-view">
    <HeadMenu />
    <div class="register-container">
      <div class="register-card">
        <div class="card-header">
          <h1 class="title">Create Account</h1>
          <p class="subtitle">加入我們，開始您的購物之旅</p>
        </div>

        <v-form v-model="valid" ref="form">
          <v-row>
            <!-- First Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="firstname"
                :counter="10"
                :rules="nameRules"
                label="First name"
                variant="outlined"
                color="deep-purple-accent-3"
                required
              ></v-text-field>
            </v-col>

            <!-- Last Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lastname"
                :counter="10"
                :rules="nameRules"
                label="Last name"
                variant="outlined"
                color="deep-purple-accent-3"
                required
              ></v-text-field>
            </v-col>

            <!-- E-mail -->
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                variant="outlined"
                color="deep-purple-accent-3"
                required
              ></v-text-field>
            </v-col>

            <!-- Phone -->
            <v-col cols="12">
              <v-text-field
                v-model="phone"
                :rules="phoneRules"
                label="Phone Number"
                variant="outlined"
                color="deep-purple-accent-3"
                required
              ></v-text-field>
            </v-col>

            <!-- Password -->
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                variant="outlined"
                color="deep-purple-accent-3"
                required
              ></v-text-field>
            </v-col>

            <!-- Confirm Password -->
            <v-col cols="12">
              <v-text-field
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirm Password"
                type="password"
                variant="outlined"
                color="deep-purple-accent-3"
                required
              ></v-text-field>
            </v-col>

            <!-- Register Button -->
            <v-col cols="12" class="mt-4">
              <button 
                type="button"
                class="btn-primary" 
                :disabled="!valid" 
                @click="register"
              >
                註冊帳號
              </button>
            </v-col>
            
            <v-col cols="12" class="text-center mt-2">
              <router-link to="/login" class="login-link">
                已經有帳號了？登入
              </router-link>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import HeadMenu from "../components/HeadMenu.vue";
import axios from 'axios';

export default {
  name: "RegisterForm",
  components: {
    HeadMenu,
  },
  data() {
    return {
      valid: true,
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Please confirm your password",
        (v) => v === this.password || "Passwords do not match",
      ],
      phoneRules: [
        (v) => !!v || "Phone number is required",
        (v) => /^[0-9]{10}$/.test(v) || "Phone number must be 10 digits",
      ],
    };
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate()) return;
      
      try {
        const response = await axios.post('http://localhost:3002/api/member/register', {
          email: this.email,
          password: this.password,
          username: this.firstname + this.lastname,
          phone : this.phone,
        });

        if (response.data.success) {
          alert(response.data.message);
          this.$router.push('/Login');
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('註冊錯誤:', error);
        alert('註冊失敗，請稍後再試');
      }
    },
  },
};
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  background-color: #f5f5f7;
  display: flex;
  flex-direction: column;
}

.register-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  margin-top: 60px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
  transition: transform 0.3s ease;
}

.register-card:hover {
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(149, 75, 219, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.login-link {
  color: #86868b;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.login-link:hover {
  color: #954bdb;
  text-decoration: underline;
}
</style>
  