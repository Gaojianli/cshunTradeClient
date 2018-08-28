export const state = () => ({
  username: null,
  id: -1,
  createdAt: "",
  name: '',
  phone: '',
  street: '',
  town: '',
  updatedAt: "",
  adminLevel: '',
  isAdmin: false,
  districtsRW: [],
  loginError: ""
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
    state.username = user_data.username;
    state.adminLevel = user_data.adminLevel;
    state.isAdmin = user_data.adminLevel !== "Normal";
    state.createdAt = user_data.createdAt;
    state.name = user_data.name;
    state.phone = user_data.phone;
    state.street = user_data.street;
    state.town = user_data.town;
    state.updatedAt = user_data.updatedAt;
    state.districtsRW = user_data.districtsRW;
    state.id = user_data.id;
    state.loginError = "";
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
    return this.$axios.post("/login", {
        username,
        password
      })
      .then(({ data }) => {
        const { token } = data
        this.$axios.setToken(token, 'Bearer');
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
      this.$axios.get(`/me`, token ? {
          headers: {
            authorization: `Bearer ${token}`
          }
        } : {})
        .then(({ data }) => {
          console.log(data);
          if (token) this.$axios.setToken(token, 'Bearer'); //第一次登陆的时候在login里面setToken
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
      this.$axios.put(`/users/${new_data.id}`, new_data)
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
