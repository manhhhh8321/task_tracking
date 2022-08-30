import { Request, Response } from "express";

const data = {
  name: "Nam",
  age: 28,
};

export function getIndex(req: Request, res: Response) {
  res.json(data);
};


