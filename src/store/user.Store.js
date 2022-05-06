import { makeAutoObservable } from 'mobx';
import { getToken, http } from '@/utils';

export default class UserStore {
  userInfo = {}

  constructor() {
    makeAutoObservable(this)
  }

  async getUserInfo() {
    const token = getToken();
    const res = await http.get('/users/token', {
      headers: {
        "Authorization": "Basic " + token,
      }
    });
    this.userInfo = res.data.user;
  }
}
