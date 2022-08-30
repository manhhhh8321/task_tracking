import { IStatus } from "../interfaces/main";
import { Request, Response } from "express";

const statusArray: IStatus[] = [];

const createStatus = (req: Request, res: Response) => {
  const { name, order } = req.body;

  const status: IStatus = {
    statusID: statusArray.length + 1,
    statusName: name,
    orderNumber: order,
    currentStatus: "New",
    visible: true,
  };

  if (statusArray.length > 0) {
    for (let el of statusArray) {
      if (el.statusName == name)
        return res.status(403).json({
          status_code: 0,
          error_msg: "Status name existed",
        });
    }
  }

  if (req.body) {
    statusArray.push(status);
  }
  res.send(statusArray);
};

const viewAllStatus = (req: Request, res: Response) => {
  if (statusArray.length > 0) {
    res.json(statusArray);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "No content found",
    });
  }
};

const editStatus = (req: Request, res: Response) => {
  const { name, order } = req.body;
  const id = parseInt(req.params.id);
  const index = statusArray.findIndex((item) => item.statusID == id);

  if (index >= 0) {
    statusArray[index].statusName = name;
    statusArray[index].orderNumber = order;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find status name",
    });
  }
  res.send(statusArray[index]);
};

const setVisibleStatus = (req: Request, res: Response) => {
  const reqID = parseInt(req.params.id);
  let index = statusArray.findIndex((item) => item.statusID == reqID);

  if (index >= 0) {
    statusArray[index].visible = false;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find status id",
    });
  }
  res.send(statusArray[index]);
};
export { createStatus, editStatus, viewAllStatus, setVisibleStatus };
