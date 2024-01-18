type UserModel = {
  _id: string;
  name: string;
  email?: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default UserModel;
