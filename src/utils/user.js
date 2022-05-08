const USER_KEY = 'Cloudocs_user'

const getUser = () => sessionStorage.getItem(USER_KEY)
const setUser = user => sessionStorage.setItem(USER_KEY, user)
const removeUser = () => sessionStorage.removeItem(USER_KEY)

export { getUser, setUser, removeUser }