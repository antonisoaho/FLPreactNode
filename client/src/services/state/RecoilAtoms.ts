import { atom } from 'recoil';

export const userState = atom({
  key: 'userRole',
  default: {
    loggedIn: false,
    isAdmin: false,
    userId: '',
  },
});
