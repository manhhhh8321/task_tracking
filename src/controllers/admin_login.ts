import { adminData } from "../data/auth";
import { Response, Request } from "express";
import { Admins } from "../interfaces/main";

const addminAccout: Admins[] = [
  { userID: 1, username: "admin", password: "123" },
];

export const adminLogin = function (req: Request, res: Response) {
  const { name, pass } = req.body;
  const index = addminAccout.findIndex((item) => (item.username = name));

  if (index >= 0 && addminAccout[index].password == pass) {
    if (
      name == addminAccout[index].username &&
      pass == addminAccout[index].password
    ) {
      res.send("Logged in");
    }
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Username or password incorrect",
    });
  }
};
