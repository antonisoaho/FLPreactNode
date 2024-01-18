import { atom } from 'recoil';

export const userState = atom({
  key: 'userRole',
  default: {
    loggedIn: false,
    isAdmin: false,
    userId: '',
  },
});

export const snackbarState = atom({
  key: 'snackbarState',
  default: {
    open: false,
    message: '',
    severity: 'info',
  },
});
