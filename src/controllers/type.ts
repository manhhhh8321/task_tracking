import { Response, Request, NextFunction } from "express";
import { IType } from "../interfaces/main";
import { AppDataSource } from "../data-source";
import { Type } from "../entity/main";

export const typeArray: IType[] = [];

const createType = async (req: Request, res: Response) => {
  const { name, req_color } = req.body;

  const typeRepo = AppDataSource.getRepository(Type);
  const allTypes = await typeRepo.find();

  const index = allTypes.findIndex((item) => item.typeName === name);

  if (index >= 0) {
    return res.status(409).json({
      error_msg: "Type name existed",
    });
  }

  // Create new query builder to create new type
  const types = new Type();
  types.typeName = name;
  types.color = req_color;
  types.visible = true;
  types.defaultColor = "white";

  // Save to database
  const rs = await typeRepo.save(types);
  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot create type",
    });
  }

  for (let el of allTypes) {
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

  res.send(rs);
};

const viewAllType = async (req: Request, res: Response) => {
  const typeRepo = AppDataSource.getRepository(Type);
  const allTypes = await typeRepo.find();

  if (allTypes.length <= 0) {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
  res.json(allTypes);
};

const editType = async (req: Request, res: Response, next: NextFunction) => {
  const { name, req_color } = req.body;
  const id = parseInt(req.params.id);

  const typeRepo = AppDataSource.getRepository(Type);
  const allTypes = await typeRepo.find();

  let index = allTypes.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(404).json({
      error_msg: "Cannot find type name",
    });
  }
  // Create new query builder to update type
  const query = typeRepo
    .createQueryBuilder()
    .update(Type)
    .set({ typeName: name, color: req_color })
    .where("id = :id", { id: id })
    .execute();
  query
    .then((result) => {
      if (result.affected === 0) {
        return res.status(500).json({
          error_msg: "Cannot update type",
        });
      }
      res.send(`Type ${id} has been updated`);
      // Save to database
    })
    .catch((err) => {
      next(err);
    });
};

const setVisibleType = async (req: Request, res: Response) => {
  const req_id = req.params.id;

  const typeRepo = AppDataSource.getRepository(Type);
  const allTypes = await typeRepo.find();
  const index = allTypes.findIndex((item) => item.id === parseInt(req_id));

  if (index < 0) {
    return res.status(404).json({
      error_msg: "Cannot find type id",
    });
  }
  // Create new query builder to update type visible
  const query = typeRepo.createQueryBuilder();
  query
    .update(Type)
    .set({ visible: false })
    .where("id = :id", { id: req_id })
    .execute();

  // Save to database
  const rs = await typeRepo.save(allTypes[index]);
  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot update type",
    });
  }

  res.send(`Type ${req_id} has been updated`);
};

export { createType, viewAllType, editType, setVisibleType };
