import { IPriority } from "../interfaces/main";
import { Request, Response } from "express";
import { Priority } from "../entity/main";
import { AppDataSource } from "../data-source";

export const priorArray: IPriority[] = [];

const priorRepo = AppDataSource.getRepository(Priority);


const createPrior = async (req: Request, res: Response) => {
  const { name, order } = req.body;

  const allPrior = await priorRepo.find();

  const priorIndex = allPrior.findIndex((item) => item.priorName === name);

  if (priorIndex >= 0) {
    return res.status(409).json({
      error_msg: "Priority existed",
    });
  }

  // Create new priority
  const prior = new Priority();
  prior.priorName = name;
  prior.orderNumber = order;
  prior.visible = true;

  // Save to database
  const rs = await priorRepo.save(prior);
  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot create priority",
    });
  }
  res.send(rs);
};

const viewAllPrior = async (req: Request, res: Response) => {

  const allPrior = await priorRepo.find();

  if (allPrior.length <= 0) {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
  res.json(allPrior);
};

const editPrior = async (req: Request, res: Response) => {
  const { name, order } = req.body;
  const id = req.params.id;

  const allPrior = await priorRepo.find();

  const index = allPrior.findIndex((item) => item.id === parseInt(id));

  if (index < 0) {
    return res.status(404).json({
      error_msg: "Cannot find prior id",
    });
  }
  // Create query builder to update priority
  const query = AppDataSource.createQueryBuilder()
    .update(Priority)
    .set({ priorName: name, orderNumber: order })
    .where("id = :id", { id: id })
    .execute();
  // Save to database

  if (!query) {
    return res.status(500).json({
      error_msg: "Cannot update priority",
    });
  }
  res.send(`Update priority ${name} successfully`);
};

const setVisiblePrior = async (req: Request, res: Response) => {
  const reqID = req.params.id;

  const priorRepo = AppDataSource.getRepository(Priority);
  const allPrior = await priorRepo.find();

  const index = allPrior.findIndex((item) => item.id === parseInt(reqID));

  if (index < 0) {
    return res.status(404).json({
      error_msg: "Cannot find prior id",
    });
  }
  // Create query builder to update priority visible
  const query = AppDataSource.createQueryBuilder()
    .update(Priority)
    .set({ visible: !allPrior[index].visible })
    .where("id = :id", { id: reqID })
    .execute();

  // Save to database
  if (!query) {
    return res.status(500).json({
      error_msg: "Cannot update priority",
    });
  }
  res.send(`Update priority ${allPrior[index].priorName} successfully`);
};
export { createPrior, editPrior, viewAllPrior, setVisiblePrior };
