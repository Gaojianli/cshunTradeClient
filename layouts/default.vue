<template>
  <v-app>
    <v-toolbar style="z-index:999;" dense dark class="main-header">
      <v-toolbar-title>产销对接系统</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <router-link to="/" tag="v-btn" class="v-btn--flat">首页</router-link>
        <router-link to="/login" tag="v-btn" class="v-btn--flat">登记</router-link>
        <router-link to="/hod" tag="v-btn" class="v-btn--flat v-btn--icon">
          <v-icon>fas fa-user-cog</v-icon>
        </router-link>
      </v-toolbar-items>
    </v-toolbar>
    <nuxt/>
  </v-app>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
i.v-icon.fas.fa-user-cog {
  font-size: 16px;
}
nav.theme--dark.v-toolbar.main-header{
  background-color: #2F2F2F !important;/*wechat header*/
}
</style>
