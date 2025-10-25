import { User } from "./user";

export interface UserForm extends User {
  confirmPassword: string;
  newPassword: string;
  country: string;
  countryPhoneIndex: string;
}
