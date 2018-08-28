<template>
  <v-container>
    <!-- 小吃吧 -->
    <v-snackbar v-model="snack_bar.active" :color="snack_bar.color">
      {{ snack_bar.msg }}
      <v-btn dark flat @click="snack_bar.active = false">
        Close
      </v-btn>
    </v-snackbar>
    <!-- 表单 -->
    <v-subheader style="padding-left:0;">{{editable ? "修改用户信息" : "用户信息"}}</v-subheader>
    <v-layout wrap>
      <v-flex xs12 sm6>
        <v-text-field v-for="item in schema" :key="item.key" v-model="user_data[item.key]"
          :label="item.name" :disabled="!editable"></v-text-field>
        <v-text-field v-model="new_passwd" label="修改密码" placeholder="输入新密码" color="error"
          outline v-if="editable"></v-text-field>
      </v-flex>
    </v-layout>
    <!-- 快捷按钮 -->
    <v-speed-dial v-model="editable" bottom right fixed transition="slide-y-reverse-transition">
      <v-btn slot="activator" v-model="editable" :color="editable ? 'error' : 'blue darken-2'"
        dark fab @click="rollbackInfo" :disabled="loading">
        <v-icon v-if="!editable" class="icon-small">fas fa-pen</v-icon>
        <v-icon v-else>close</v-icon>
      </v-btn>
      <v-btn fab dark color="green" @click="saveInfo" :loading="loading">
        <v-icon class="icon-small">fas fa-save</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-container>

</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters, mapState } = createNamespacedHelpers("user");

export default {
  mounted() {
    this.user_data = Object.assign({}, this.$store.state.user); //copy state to local
  },
  data() {
    return {
      schema: [
        {
          name: "用户名",
          key: "username"
        },
        {
          name: "姓名",
          key: "name"
        },
        {
          name: "联系电话",
          key: "phone"
        },
        {
          name: "乡镇",
          key: "town"
        },
        {
          name: "街道",
          key: "street"
        }
      ],
      user_data: {
        username: "",
        name: "",
        phone: "",
        town: "",
        street: "",
        adminLevel: ""
      },
      new_passwd: "",
      editable: false,
      loading: false,
      snack_bar: {
        active: false,
        color: "success",
        msg: ""
      }
    };
  },
  methods: {
    ...mapActions(["login", "update"]),
    rollbackInfo() {
      if (this.editable)
        this.user_data = Object.assign({}, this.$store.state.user);
    },
    saveInfo() {
      console.log(this.$store.state.user.adminLevel);
      console.log(this.user_data.adminLevel);
      if (this.editable) {
        this.loading = true;
        if (this.new_passwd !== "") this.user_data.password = this.new_passwd;
        //this.user_data.adminLevel = "Super";
        this.update(this.user_data)
          .then(() => {
            this.new_passwd = "";
            this.loading = false;
            this.snack_bar.msg = "更新信息成功";
            this.snack_bar.color = "success";
            this.snack_bar.active = true;
          })
          .catch(err => {
            this.loading = false;
            this.snack_bar.msg = err;
            this.snack_bar.color = "error";
            this.snack_bar.active = true;
          });
      }
    }
  }
};
</script>

<style>
.icon-small {
  font-size: 16px !important;
}
div.v-input__slot > div > input[type="text"] {
  color: #333;
}
</style>
