import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

import { Priority } from "../entity/main";

const priorRepo = AppDataSource.getRepository(Priority);

const createPrior = async (req: Request, res: Response) => {
  const { name, order } = req.body;

  const priors = await priorRepo.find({ where: { priorName: name } });

  if (priors.length > 0) {
    return res.status(409).json({
      error_msg: "Priority name existed",
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

  const prior = await priorRepo.find({ where: { id: parseInt(id) } });

  if (!prior) {
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

  const prior = await priorRepo.findOne({ where: { id: parseInt(reqID) } });

  if (!prior) {
    return res.status(404).json({
      error_msg: "Cannot find prior id",
    });
  }

  // Create query builder to update priority visible
  const query = AppDataSource.createQueryBuilder()
    .update(Priority)
    .set({ visible: !prior.visible })
    .where("id = :id", { id: reqID })
    .execute();

  // Save to database
  if (!query) {
    return res.status(500).json({
      error_msg: "Cannot update priority",
    });
  }
  res.send(`Update priority ${prior.priorName} successfully`);
};
export { createPrior, editPrior, viewAllPrior, setVisiblePrior };
