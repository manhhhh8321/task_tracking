import { Response, Request, NextFunction } from "express";

import { AppDataSource } from "../data-source";
import { Type } from "../entity/main";

const createType = async (req: Request, res: Response) => {
  const { name, req_color } = req.body;

  const typeRepo = AppDataSource.getRepository(Type);
  const type = await typeRepo.findOne({ where: { typeName: name } });

  if (type) {
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

  const allTypes = await typeRepo.find();
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
  const type = await typeRepo.findOne({ where: { id: id } });

  if (!type) {
    return res.status(404).json({
      error_msg: "Cannot find type id",
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
  const type = await typeRepo.findOne({ where: { id: parseInt(req_id) } });

  if (!type) {
    return res.status(404).json({
      error_msg: "Cannot find type id",
    });
  }
  // Create new query builder to update type visible
  const query = typeRepo.createQueryBuilder();
  query
    .update(Type)
    .set({ visible: !type!.visible })
    .where("id = :id", { id: req_id })
    .execute()
    .then((result) => {
      if (result.affected === 0) {
        return res.status(500).json({
          error_msg: "Cannot update type",
        });
      }
    })
    .catch((err) => {
      throw err;
    });
    res.send(`Type ${req_id} has been updated`);
};

export { createType, viewAllType, editType, setVisibleType };
