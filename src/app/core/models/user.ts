export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  birthdate: Date;
  countryCode: string;
  phone: string;
  website?: string;
  avatar?: string;
}
