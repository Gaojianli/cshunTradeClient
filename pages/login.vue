<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="blue">
            <v-toolbar-title>登陆系统</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="username" prepend-icon="fas fa-user-circle" name="login" label="用户名"
                type="text"></v-text-field>
              <v-text-field v-model="password" id="password" prepend-icon="fas fa-lock" name="password"
                label="密码" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" dark @click="login({username,password})">登陆</v-btn>
          </v-card-actions>
          <v-alert :value="!!loginError" type="error">
            {{loginError}}
          </v-alert>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters, mapState } = createNamespacedHelpers("user");
export default {
  computed: { ...mapGetters(["isLogin"]), ...mapState(["loginError"]) },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["login"])
  }
};
</script>

