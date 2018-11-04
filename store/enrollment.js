export const state = () => ({
  PlantingEnrollment: [],
  BreedEnrollment: []
})

export const mutations = {
  update_plantingEnrollments(state, _plantingEnrollments) {
    state.PlantingEnrollment = _plantingEnrollments;
  },
  update_breedEnrollments(state, _breedEnrollments) {
    state.BreedEnrollment = _breedEnrollments;
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
  create_plantingEnrollment({ dispatch, commit }, _plantingEnrollmentData) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/api/planting_enrollments/', _plantingEnrollmentData)
        .then(({ data }) => {
          dispatch('read_plantingEnrollments') //创建成功更新登记信息
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
  read_plantingEnrollments({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/planting_enrollments/')
        .then(({ data }) => {
          console.log(data[0]);
          commit('update_plantingEnrollments', data);
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
  delete_plantingEnrollments({ dispatch, commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete(`/api/planting_enrollments/${id}/`)
        .then(() => {
          dispatch('read_plantingEnrollments')
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
  update_plantingEnrollment({ dispatch, commit }, erm) {
    return new Promise((resolve, reject) => {
      this.$axios.$put(`/api/planting_enrollments/${erm.id}/`, erm)
        .then(() => {
          dispatch('read_plantingEnrollments') //修改成功更新登记信息
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
  read_breedEnrollments({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/breed_enrollments/')
        .then(({ data }) => {
          commit('update_breedEnrollments', data);
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
  create_breedEnrollment({ dispatch, commit }, _breedEnrollmentData) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/api/breed_enrollments/', _breedEnrollmentData)
        .then(({ data }) => {
          dispatch('read_breedEnrollments') //创建成功更新登记信息
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
  delete_breedEnrollments({ dispatch, commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete(`/api/breed_enrollments/${id}/`)
        .then(() => {
          dispatch('read_breedEnrollments')
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
  update_breedEnrollment({ dispatch, commit }, erm) {
    return new Promise((resolve, reject) => {
      this.$axios.$put(`/api/breed_enrollments/${erm.id}/`, erm)
        .then(() => {
          dispatch('read_breedEnrollments') //修改成功更新登记信息
            .then(() => {
              resolve();
            })
        })
    })
  }
}
