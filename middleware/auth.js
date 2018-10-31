/**
 * 鉴权
 * @param {object} ctx nuxt上下文 https://nuxtjs.org/api/context
 */
export default function (ctx) {
  return new Promise((resolve, reject) => {
    if (ctx.route.path === '/login') {
      resolve();
      return;
    }
    // if (!!ctx.store.state.user.username) {
    //   resolve();
    //   return;
    // }
    //try to login via token
    const token = sessionStorage.getItem('token');
    console.log('token:' + token);
    if (token) {
      // ctx.store.dispatch('user/me', token)
      //   .then(() => { //login success
      //     //ctx.redirect('/')
      //     resolve();
      //     return;
      //   })
      //   .catch(() => { //login failed
      //     ctx.redirect('/login');
      //     return;
      //   })
      console.log(token);
      ctx.app.$axios.setToken(token, 'JWT'); //FIXME: after fix 'me'
      resolve();
    }
    //to login page
    else
      return ctx.redirect('/login');
  });
}
