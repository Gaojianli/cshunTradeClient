export const state = () => ({
  "id": 11,
  "password": "",
  "username": "",
  "first_name": "",
  "last_name": "",
  "email": "",
  "is_active": true,
  "street": "",
  "village": "",
  "phone_number": "",
  "admin_level": "",
  "groups": [],
  "user_permissions": []
})
export const getters = {
  isLogin: ({ username }) => !!username,
  isAdmin: ({ isAdmin }) => !!isAdmin,
  canWriteDistrict: ({
    districtsRW
  }, {
    isLogin,
    isAdmin
  }) => (district) => isLogin && (isAdmin || districtsRW.indexOf(district) >= 0)
}
export const mutations = {
  update(state, user_data) {
    state.id = user_data.id;
    state.password = user_data.password;
    state.username = user_data.username;
    state.first_name = user_data.first_name;
    state.last_name = user_data.last_name;
    state.email = user_data.email;
    state.is_active = user_data.is_active;
    state.street = user_data.street;
    state.village = user_data.village;
    state.phone_number = user_data.phone_number;
    state.admin_level = user_data.admin_level;
    state.groups = user_data.groups;
    state.user_permissions = user_data.user_permissions;
  },
  updateErrorMessage(state, message) {
    state.loginError = message;
  }
}
export const actions = {
  /**
   * 用户名密码登陆，成功跳转到首页，失败提交错误信息
   */
  login({
    commit,
    dispatch
  }, {
    username,
    password
  }) {
    return this.$axios.post("/api-token-auth/", {
        username,
        password
      })
      .then(({ data }) => {
        const token = data.token;
        console.log(token);
        this.$axios.setToken(token, 'JWT');
        sessionStorage.setItem('token', token);
      })
      .then(() => {
        dispatch('me')
          .then(() => {
            this.$router.push('/'); //登陆成功后跳转到首页
          })
      })
      .catch(response => {
        console.log(response);
        commit('updateErrorMessage', '登陆失败');
      })
  },
  /**
   * 根据token获取用户信息
   */
  me({ commit }, token) {
    return new Promise((resolve, reject) => {
      this.$axios.get(`/api/users/me/`, token ? {
          headers: {
            Authorization: `JWT ${token}`
          }
        } : {})
        .then(({ data }) => {
          console.log(data);
          if (token) this.$axios.setToken(token, 'JWT'); //第一次登陆的时候在login里面setToken
          commit('update', data);
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject();
        })
    })
  },
  /**
   * 向服务器更新用户信息
   */
  update({ commit }, new_data) {
    console.log(new_data.id);
    return new Promise((resolve, reject) => {
      this.$axios.put(`/api/users/me`, new_data)
        .then(({ data }) => {
          commit('update', data);
          resolve();
        })
        .catch(err => {
          let error_msg = '';
          if (err.response.status == 401) error_msg = "账户登陆错误";
          if (err.response.status == 403) error_msg = "只有超级管理员和用户本身可以修改用户信息";
          else error_msg = "修改用户信息失败";
          reject(error_msg);
        })
    })
  }
}
