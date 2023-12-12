const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userid: state => state.user.userid,
  name: state => state.user.name,
  roles: state => state.user.roles,
  publickey: state => state.user.publickey
}
export default getters
