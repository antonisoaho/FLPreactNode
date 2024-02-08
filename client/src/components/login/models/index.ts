export type LoginResponse = {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};
