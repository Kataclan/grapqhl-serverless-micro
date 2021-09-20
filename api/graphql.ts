import { ApolloServer } from "apollo-server-micro";
import { send } from "micro";
import micro_cors from "micro-cors";
// import { getConnection } from "../database";
import { resolvers, schema } from "../graphql";

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  // context: async () => {
  //   const dbConn = await getConnection();
  //   return { dbConn };
  // },
  introspection: true,
});

// ENABLE CORS TO BE ABLE TO FETCH FROM LOCAL IN DEV MODE
const cors = micro_cors({
  allowHeaders: ["Access-Control-Allow-Origin", "Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  origin: process.env.NODE_ENV === "production" ? "https://safer-doc-client.vercel.app" : "*",
});

export default apolloServer.start().then(() => {
  const handler = apolloServer.createHandler({ path: "/api/graphql" });
  return cors((req: any, res: any) =>
    req.method === "OPTIONS" ? send(res, 200, "ok") : handler(req, res)
  );
});
