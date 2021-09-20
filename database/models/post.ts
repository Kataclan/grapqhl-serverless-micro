import { Schema, Model, Connection, Document } from "mongoose";
import { Post } from "../../types";
import { Collections } from "../config";

export interface IPost extends Post, Document {}

export const PostsSchema = new Schema({
  title: { type: Schema.Types.String, required: true },
  content: { type: Schema.Types.String, required: true },
  date: { type: Schema.Types.Date, required: true },
});

const PostModel = (conn: Connection): Model<IPost> => conn.model(Collections.posts, PostsSchema);

export default PostModel;
