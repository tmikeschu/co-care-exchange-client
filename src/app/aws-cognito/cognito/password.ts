import { Auth } from 'aws-amplify';

export const forgetPassword = async (username) => {
  return await Auth.forgotPassword(username);
};

export const changePassword = async (user: any, oldPassword: string, newPassword: string) => {
  return await Auth.changePassword(user, oldPassword, newPassword);
};
