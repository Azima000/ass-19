import { Document } from 'mongoose';
import { GenderEnum } from '../../database/model/model.user.js';

export interface IUser extends Document {
  name: string
  gender?: GenderEnum;
  role: string;
  phone: string;
  email: string;
  provider?: string;
  password:string;
  isVerified:boolean

}