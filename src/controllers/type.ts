const validator = require("validator");

import { Response, Request, NextFunction } from "express";
import { IType } from "../interfaces/main";
import { isValidType } from "../validators/valid";


export const typeArray: IType[] = [];

const createType = async (req: Request, res: Response) => {
  const { name, req_color } = req.body;

  const types: IType = {
    typeID: typeArray.length + 1,
    defaultColor: "white",
    color: req_color,
    typeName: name,
    visible: true,
  };

  const index = typeArray.findIndex(item => item.typeName == name);

  if (!isValidType(name, req_color)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Name or color invalid",
    });
  }

  if (index >= 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Type name existed",
    });
  }

  if (req.body) {
    typeArray.push(types);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Invalid info",
    });
  }

  for (let el of typeArray) {
    if (el.typeName == "default") {
      el.defaultColor = "white";
    }
    if (el.typeName == "bug") {
      el.defaultColor = "red";
    }
    if (el.typeName == "feature") {
      el.defaultColor = "blue";
    }
  }

  res.send(typeArray);
};

const viewAllType = (req: Request, res: Response) => {
  if (typeArray.length > 0) {
    res.json(typeArray);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "No content found",
    });
  }
  res.send(typeArray);
};

const editType = (req: Request, res: Response, next: NextFunction) => {
  const { name, reqColor } = req.body;
  const id = parseInt(req.params.id);
  let index = typeArray.findIndex((item) => item.typeID == id);

  if (!isValidType(name, reqColor)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Name or color invalid",
    });
  }

  if (index >= 0) {
    typeArray[index].typeName = name;
    typeArray[index].color = reqColor;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find type name",
    });
  }
  res.send(typeArray[index]);
};

const setVisibleType = (req: Request, res: Response) => {
  const reqID = (req.params.id);
  

  if(!validator.isNumeric(reqID)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Numeric type invalid",
    });
  }
  const index = typeArray.findIndex((item) => item.typeID == parseInt(reqID));
  if (index >= 0) {
    typeArray[index].visible = !typeArray[index].visible;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find type id",
    });
  }
  res.send(typeArray[index]);
};

export { createType, viewAllType, editType, setVisibleType };
