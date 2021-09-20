import { Connection, createConnection } from "mongoose";

const uri: string = process.env.DB_PATH || "";

let conn: Connection;

export const getConnection = async (): Promise<Connection> => {
  if (conn == null) {
    conn = await createConnection(uri, {
      bufferCommands: false, // Disable mongoose buffering
    });
  }

  return conn;
};
