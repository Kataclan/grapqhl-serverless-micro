import { VercelRequest, VercelResponse } from "@vercel/node";
import { User } from "../types";
import { return200, return500 } from "../utils/response";
import { users } from "./mocks/users";

interface ReturnShape {
  [userIds: string]: {
    name: string;
    surname: string;
    email: string;
  };
}

export async function getUsersMock(): Promise<User[]> {
  if (users.length === 0) {
    throw new Error("Farms are empty");
  }
  return users;
}

export default async function (req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const usersResponse = await getUsersMock();

    const _users = usersResponse.reduce<ReturnShape>(
      (accumulator, { pid, name, surname, email }): ReturnShape => {
        accumulator[`${pid}`] = {
          name,
          surname,
          email,
        };

        return accumulator;
      },
      {}
    );

    return200(res, { updated_at: new Date().getTime(), data: _users });
  } catch (error) {
    return500(res, error as Error);
  }
}
