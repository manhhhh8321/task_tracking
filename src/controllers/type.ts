import e, { Response, Request, NextFunction } from "express";
import { IType } from "../interfaces/main";

export const typeArray: IType[] = [];

const createType = async (req: Request, res: Response) => {
  const { name, reqColor } = req.body;

  const types: IType = {
    typeID: typeArray.length + 1,
    defaultColor: "white",
    color: reqColor,
    typeName: name,
    visible: true,
  };

  if (typeArray.length > 0) {
    for (let el of typeArray) {
      if (el.typeName == name)
        return res.status(403).json({
          status_code: 0,
          error_msg: "Type name existed",
        });
    }
  }
  if (req.body) {
    typeArray.push(types);
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
  const reqID = parseInt(req.params.id);
  const index = typeArray.findIndex((item) => item.typeID == reqID);

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
