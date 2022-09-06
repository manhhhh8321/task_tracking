

import { IPriority } from "../interfaces/main";
import { Request, Response } from "express";

export const priorArray: IPriority[] = [];

const createPrior = (req: Request, res: Response) => {
  const { name, order } = req.body;

  const priorIndex = priorArray.findIndex(item => item.priorName === name);

  if (priorIndex >= 0) {
    return res.status(409).json({
      error_msg: "Priority existed",
    });
  }

  const priors: IPriority = {
    priorID: priorArray.length + 1,
    priorName: name,
    orderNumber: order,
    visible: true,
  };

  if (req.body) {
    priorArray.push(priors);
  }
  res.send(priorArray);
};

const viewAllPrior = (req: Request, res: Response) => {
  if (priorArray.length > 0) {
    res.json(priorArray);
  } else {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
};

const editPrior = (req: Request, res: Response) => {
  const { name, order } = req.body;
  const id = req.params.id;

  const index = priorArray.findIndex((item) => item.priorID === parseInt(id));

  if (index >= 0) {
    priorArray[index].priorName = name;
    priorArray[index].orderNumber = order;
  } else {
    return res.status(404).json({
      error_msg: "Cannot find prior id",
    });
  }
  res.send(priorArray[index]);
};

const setVisiblePrior = (req: Request, res: Response) => {
  const reqID = (req.params.id);

  const index = priorArray.findIndex((item) => item.priorID === parseInt(reqID));

  if (index >= 0) {
    priorArray[index].visible = !priorArray[index].visible;
  } else {
    return res.status(404).json({
      error_msg: "Cannot find prior id",
    });
  }
  res.send(priorArray[index]);
};
export { createPrior, editPrior, viewAllPrior, setVisiblePrior };
