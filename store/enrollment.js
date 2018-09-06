export const state = () => ({
  VegEnrollment: [],
  AnimalEnrollment: []
})

export const mutations = {
  update_vegEnrollments(state, _vegEnrollments) {
    state.VegEnrollment = _vegEnrollments;
  },
  update_animalEnrollments(state, _animalEnrollments) {
    state.AnimalEnrollment = _animalEnrollments;
  }
}

export const actions = {
  /**
   * =======================================
   * 果蔬类登记 CURD
   * =======================================
   */
  /**
   * 创建果蔬类登记
   */
  create_vegEnrollment({ dispatch, commit }, _vegEnrollmentData) {
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
          commit('update_vegEnrollments', _data);
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
  },
  /**
   * =======================================
   * 牲畜类登记 CURD
   * =======================================
   */
  /**
   * 获取牲畜登记信息
   */
  read_animalEnrollments({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/animalEnrollment')
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
              seedlingDate: formatDate(item.seedlingDate),
              outOfBarDate: formatDate(item.outOfBarDate),
            }
          });
          commit('update_animalEnrollments', _data);
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  },
  /**
   * 创建牲畜类登记
   */
  create_animalEnrollment({ dispatch, commit }, _animalEnrollmentData) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/animalEnrollment', _animalEnrollmentData)
        .then(({ data }) => {
          dispatch('read_animalEnrollments') //创建成功更新登记信息
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
   * 删除牲畜类登记
   */
  delete_animalEnrollments({ dispatch, commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete(`/animalEnrollment/${id}`)
        .then(() => {
          dispatch('read_animalEnrollments')
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
   * 更新牲畜类登记
   */
  update_animalEnrollment({ dispatch, commit }, erm) {
    return new Promise((resolve, reject) => {
      this.$axios.$put(`/animalEnrollment/${erm.id}`, erm)
        .then(() => {
          dispatch('read_animalEnrollments') //修改成功更新登记信息
            .then(() => {
              resolve();
            })
        })
    })
  }
}
