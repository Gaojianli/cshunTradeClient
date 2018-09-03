export const state = () => ({
  VegEnrollment: []
})

export const mutations = {
  read_vegEnrollments(state, _vegEnrollments) {
    state.VegEnrollment = _vegEnrollments;
  }
}

export const actions = {
  /**
   * 创建果蔬类登记
   */
  create_vegEnrollment({ dispatch, commit }, __vegEnrollmentData) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/vegEnrollment', _vegEnrollmentData)
        .then(({ data }) => {
          dispatch('read_vegEnrollments') //创建成功更新登记信息
            .then(() => {
              resolve();
            })
        })
        .catch(err => {
          reject(err);
        })
    });
  },
  /**
   * 获取果蔬类登记信息
   */
  read_vegEnrollments({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/vegEnrollment')
        .then(({ data }) => {
          let _data = data.map((item) => {
            /**
             * 格式化时间字符串
             * @param {string} utcStr UTC时间字符串
             */
            function formatDate(utcStr) {
              let date = new Date(utcStr);
              return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            }
            return {
              ...item,
              plantDate: formatDate(item.plantDate),
              marketBeginDate: formatDate(item.marketBeginDate),
              marketEndDate: formatDate(item.marketEndDate),
            }
          });
          commit('read_vegEnrollments', _data);
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  },
  /**
   * 删除果蔬类登记
   */
  delete_vegEnrollments({ dispatch, commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete(`/vegEnrollment/${id}`)
        .then(() => {
          dispatch('read_vegEnrollments')
            .then(() => {
              resolve();
            })
        })
        .catch(err => {
          reject(err);
        })
    })
  },
  /**
   * 更新蔬果类登记
   */
  update_vegEnrollment({ dispatch, commit }, erm) {
    return new Promise((resolve, reject) => {
      this.$axios.$put(`/vegEnrollment/${erm.id}`, erm)
        .then(() => {
          dispatch('read_vegEnrollments') //修改成功更新登记信息
            .then(() => {
              resolve();
            })
        })
    })
  }
}
