import { gql } from "apollo-server-micro";

const types = `
  type Post {
    title: String
    content: String
  }

  type User {
    pid: Number!
    name: String!
    surname: String
    email: String
    posts: [Number]
  }
`;

const queries = `
 type Query {
    getUsers: [User]
    getUser(userPid: String): Üser
  }
`;

const mutations = `
 
`;

export default gql`
  ${types}
  ${queries}
  ${mutations}
`;
