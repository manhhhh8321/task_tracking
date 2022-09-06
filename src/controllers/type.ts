
import { Response, Request, NextFunction } from "express";
import { IType } from "../interfaces/main";



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

  const index = typeArray.findIndex(item => item.typeName === name);

  if (index >= 0) {
    return res.status(409).json({
      error_msg: "Type name existed",
    });
  }

  if (req.body) {
    typeArray.push(types);
  } else {
    return res.status(400).json({
      error_msg: "Invalid info",
    });
  }

  for (let el of typeArray) {
    if (el.typeName === "default") {
      el.defaultColor = "white";
    }
    if (el.typeName === "bug") {
      el.defaultColor = "red";
    }
    if (el.typeName === "feature") {
      el.defaultColor = "blue";
    }
  }

  res.send(typeArray);
};

const viewAllType = (req: Request, res: Response) => {
  if (typeArray.length > 0) {
    res.json(typeArray);
  } else {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
  res.send(typeArray);
};

const editType = (req: Request, res: Response, next: NextFunction) => {
  const { name, req_color } = req.body;
  const id = parseInt(req.params.id);
  let index = typeArray.findIndex((item) => item.typeID === id);

  if (index >= 0) {
    typeArray[index].typeName = name;
    typeArray[index].color = req_color;
  } else {
    return res.status(404).json({
      error_msg: "Cannot find type name",
    });
  }
  res.send(typeArray[index]);
};

const setVisibleType = (req: Request, res: Response) => {
  const req_id = (req.params.id);

  const index = typeArray.findIndex((item) => item.typeID === parseInt(req_id));
  if (index >= 0) {
    typeArray[index].visible = !typeArray[index].visible;
  } else {
    return res.status(404).json({
      error_msg: "Cannot find type id",
    });
  }
  res.send(typeArray[index]);
};

export { createType, viewAllType, editType, setVisibleType };
