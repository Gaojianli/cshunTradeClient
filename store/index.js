export const state = () => ({
  active_enrollment: {
    id: null,
    type: ''
  }
})

export const mutations = {
  actEnrollment(state, data) {
    state.active_enrollment.id = data.id;
    state.active_enrollment.type = data.type;
  }
}
