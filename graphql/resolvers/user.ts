import { ApolloError } from "apollo-server-micro";
import { users } from "../../mocks/users";
import { User } from "../../types";

export default {
  Query: {
    getUsers: (): User[] => users,
    getUser: async (parent: any, { userId }: { userId: string }): Promise<User | null> => {
      try {
        const promise = await new Promise<User>((resolve) => {
          resolve(users[parseInt(userId)]);
        });

        return promise;
      } catch (error) {
        console.error("> getUsers error: ", error);
        throw new ApolloError("Error retrieving users");
      }
    },
  },
};
