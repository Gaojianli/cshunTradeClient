export const state = () => ({
  VegEnrollment: []
})

export const mutations = {
  updateVegEnrollments(state, _vegEnrollments) {
    state.VegEnrollment = _vegEnrollments;
  }
}

export const actions = {
  /**
   * 创建果蔬类登记
   */
  createVegEnrollment({ dispatch, commit }, _vegEnrollmentData) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/vegEnrollment', _vegEnrollmentData)
        .then(({ data }) => {
          dispatch('updateVegEnrollments') //创建成功更新登记信息
            .then(() => {
              resolve();
            })
        })
        .catch(err => {
          reject();
        })
    });
  },
  /**
   * 获取果蔬类登记信息
   */
  updateVegEnrollments({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/vegEnrollment')
        .then(({ data }) => {
          commit('updateVegEnrollments', data);
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject();
        })
    })
  }
}
