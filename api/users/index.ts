import { VercelRequest, VercelResponse } from "@vercel/node";
import { users } from "../mocks/users";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({ users });
};
