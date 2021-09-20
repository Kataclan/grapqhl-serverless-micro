import { Schema, Model, Connection, Document } from "mongoose";
import { User } from "../../types";
import { Collections } from "../config";

export interface IUser extends User, Document {}

export const UserSchema = new Schema({
  pid: { type: Schema.Types.Number, required: true },
  name: { type: Schema.Types.String, required: true },
  surname: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true },
  posts: [Schema.Types.ObjectId],
});

const UserModel = (conn: Connection): Model<IUser> => conn.model(Collections.user, UserSchema);

export default UserModel;
