// import { gql } from "apollo-server-micro";

import farmSchema from "./user";
import customSchema from "./custom";

// const linkSchema = gql`
//   type Query {
//     _: Boolean
//   }

//   type Mutation {
//     _: Boolean
//   }

//   type Subscription {
//     _: Boolean
//   }
// `;

export default [customSchema, farmSchema];
