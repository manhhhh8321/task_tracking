import { IPriority } from "../interfaces/main";
import { Request, Response } from "express";

export const priorArray: IPriority[] = [];

const createPrior = (req: Request, res: Response) => {
  
  const { name, order } = req.body;

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
  const id = parseInt(req.params.id);

  const index = priorArray.findIndex((item) => item.priorID == id);

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
  const reqID = parseInt(req.params.id);
  const index = priorArray.findIndex((item) => item.priorID == reqID);

  if (index >= 0) {
    priorArray[index].visible =  !priorArray[index].visible;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find prior id",
    });
  }
  res.send(priorArray[index]);
};
export { createPrior, editPrior, viewAllPrior, setVisiblePrior };
