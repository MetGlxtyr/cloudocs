import { createContext, useContext } from 'react';
import LoginStore from './login.Store';
import UserStore from './user.Store';
import RegisterStore from './register.Store';
import DocsStore from './docs.store';

class RootStore {
  constructor() {
    this.loginStore = new LoginStore();
    this.registerStore = new RegisterStore();
    this.userStore = new UserStore();
    this.docsStore = new DocsStore();
  }
}

const StoreContext = createContext(new RootStore());

export default function useStore() {
  return useContext(StoreContext);
};
