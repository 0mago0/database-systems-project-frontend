<template>
  <v-app>
  <nav>
    <!--router-link to="/">Home</router-link> 
    <router-link to="/about">About</router-link> -->
  </nav>
  <router-view/>
  </v-app>
</template>



<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


nav {
  padding: px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>
