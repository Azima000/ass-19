
import { MongooseModule, Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ required: false, type: String, default: GenderEnum.Male, enum: GenderEnum, })
  gender?: GenderEnum;

  @Prop({ required: false, type: String, default: '0', })
  role!: string;

  @Prop({ required: true, type: String })
  phone!: string;

  @Prop({ required: true, type: String, unique: true })
  email!: string

  @Prop({ required: false, type: String })
  provider?: string

  @Prop({ required: true, type: String })
  password!: string

  @Prop({ required: true, type: Boolean })
  isVerified: boolean

}

export const userSchema = SchemaFactory.createForClass(User);

export const userModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userSchema,
  },
]);
