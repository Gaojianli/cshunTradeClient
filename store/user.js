export const state = () => ({
  username: null,
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
  update(state, {
    username,
    isAdmin,
    districtsRW
  }) {
    state.username = username;
    state.isAdmin = isAdmin;
    state.districtsRW = districtsRW;
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
            this.$router.push('/');
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
          commit('update', data);
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject();
        })
    })
  }
}
