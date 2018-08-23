<template>
  <v-app>
    <v-toolbar style="z-index:999;">
      <v-toolbar-title>产销对接系统</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn href="/" flat>登记情况</v-btn>
        <v-btn href="/enrollment" flat>申报</v-btn>

      </v-toolbar-items>
    </v-toolbar>
    <nuxt/>
  </v-app>
</template>

<script>
export default {
  data() {
    return {

    };
  }
};
</script>
