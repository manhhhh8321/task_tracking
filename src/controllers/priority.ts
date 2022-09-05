const validator = require("validator");

import { IPriority } from "../interfaces/main";
import { Request, Response } from "express";
import { isValidStatus } from "../validators/valid";

export const priorArray: IPriority[] = [];

const createPrior = (req: Request, res: Response) => {
  const { name, order } = req.body;

  if (!isValidStatus(name, order)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Name or order invalid",
    });
  }

  if (priorArray.length > 0) {
    for (let el of priorArray) {
      if (el.priorName == name)
        return res.status(403).json({
          status_code: 0,
          error_msg: "Prior name existed",
        });
    }
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
    return res.status(403).json({
      status_code: 0,
      error_msg: "No content found",
    });
  }
};

const editPrior = (req: Request, res: Response) => {
  const { name, order } = req.body;
  const id = req.params.id;

  if (!isValidStatus(name, order) && !validator.isInt(id, {min: 1, max: undefined})) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Name or order, request id invalid",
    });
  }

  const index = priorArray.findIndex((item) => item.priorID == parseInt(id));

  if (index >= 0) {
    priorArray[index].priorName = name;
    priorArray[index].orderNumber = order;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find prior id",
    });
  }
  res.send(priorArray[index]);
};

const setVisiblePrior = (req: Request, res: Response) => {
  const reqID = (req.params.id);

  if (!validator.isInt(reqID, {min: 1, max: undefined})) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Request id invalid",
    });
  }

  const index = priorArray.findIndex((item) => item.priorID == parseInt(reqID));

  if (index >= 0) {
    priorArray[index].visible = !priorArray[index].visible;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find prior id",
    });
  }
  res.send(priorArray[index]);
};
export { createPrior, editPrior, viewAllPrior, setVisiblePrior };
