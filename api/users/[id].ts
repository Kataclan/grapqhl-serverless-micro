import { VercelRequest, VercelResponse } from "@vercel/node";
import { users } from "../mocks/users";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (req: VercelRequest, res: VercelResponse) => {
  const { id } = req.query;
  const user = users.find((u) => u.pid === parseInt(id as string));
  res.status(200).json({ user });
};
