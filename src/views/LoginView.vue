<template>
    <div class="login-view">
        <HeadMenu />
        <div class="login-container">
            <LoginComp />
        </div>
    </div>
</template>

<script>


import HeadMenu from '../components/HeadMenu.vue'
import LoginComp from '@/components/LoginComp.vue';


export default {
    name: 'MemberView',
    components: {
        HeadMenu, LoginComp
    },
    data() {

    },
    methods: {
      
    }
}
</script>

<style scoped>
.login-view {
    min-height: 100vh;
    background-color: #f5f5f7;
    display: flex;
    flex-direction: column;
}

.login-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin-top: 60px; /* Adjust for HeadMenu */
}
</style>