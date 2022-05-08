import { makeAutoObservable } from 'mobx';
import qs from 'qs';
import { http, setToken } from '@/utils';

export default class RegisterStore {
  token = '';

  constructor() {
    makeAutoObservable(this)
  }

  signUp = async ({ tel, pass, name, gender, email }) => {
    const res = await http.post('http://121.4.174.222:9000/users', qs.stringify({
      tel,
      pass,
      name,
      gender,
      email
    }));
    this.token = res.data.token;
    setToken(this.token);
  }
}
