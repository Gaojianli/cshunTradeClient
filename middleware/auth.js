/**
 * 鉴权
 * @param {object} ctx nuxt上下文 https://nuxtjs.org/api/context
 */
export default function (ctx) {
  if (!!ctx.store.state.user.username) return; //已经登陆
  //try to login via token
  const token = sessionStorage.getItem('token');
  console.log('token:' + token);
  if (token) {
    ctx.store.dispatch('user/me', token)
      .then(() => { //login success
        return ctx.redirect('/')
      })
      .catch(() => { //login failed
        ctx.redirect('/login');
        return;
      })
  }
  //to login page
  else
    return ctx.redirect('/login');
}
