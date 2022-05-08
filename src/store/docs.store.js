import { makeAutoObservable } from 'mobx';
import { http } from '@/utils';
import moment from 'moment';

export default class DocsStore {
  docsList = [];

  constructor() {
    makeAutoObservable(this)
  }

  async getDocsList() {
    const res = await http.get('/docs');
    const share = await http.get('/docs/share');
    let docs = res.data.docs ? [ ...res.data.docs ] : [];
    docs = share.data.docs ? [ ...docs, ...share.data.docs ] : docs;

    const thisYear = new Date().getFullYear();
    if (docs) {
      docs.forEach(element => {
        const created = element.created * 1000;
        const last = element.last * 1000;
        if (new Date(created).getFullYear() === thisYear) {
          element.ctime = moment(created).format('M月D日 HH:mm');
        } else {
          element.ctime = moment(created).format('YYYY年M月D日');
        }
        if (new Date(last).getFullYear() === thisYear) {
          element.ltime = moment(last).format('M月D日 HH:mm');
        } else {
          element.ltime = moment(last).format('YYYY年M月D日');
        }
      });
    }
    this.docsList = docs;
  }

  clearDocsList() {
    this.docsList = [];
  }

  newDoc(data) {
    this.docsList.unshift(data)
  }

  delDoc(id) {
    this.docsList = this.docsList.filter(item => item._id !== id);
  }
}
