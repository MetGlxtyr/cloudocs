import { makeAutoObservable } from 'mobx';
import qs from 'qs';
import { http, setToken, getToken, removeToken } from '@/utils';

class LoginStore {
  token = getToken() || '';

  constructor() {
    makeAutoObservable(this)
  }

  logIn = async ({ tel, pass }) => {
    const res = await http.post('http://121.4.174.222:9000/login', qs.stringify({
      tel,
      pass
    }));
    this.token = res.data.token;
    setToken(this.token);
  }

  logOut = () => {
    this.token = '';
    removeToken();
  }
}

export default LoginStore;