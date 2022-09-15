import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

import { Status } from "../entity/main";

const createStatus = async (req: Request, res: Response) => {
  const { name, order } = req.body;

  const statusRepo = AppDataSource.getRepository(Status);
  const status = await statusRepo.find({ where: { statusName: name } });

  if (status.length > 0) {
    return res.status(409).json({
      error_msg: "Status name existed",
    });
  }

  // Create a new status
  const newStatus = new Status();
  newStatus.statusName = name;
  newStatus.orderNumber = order;
  newStatus.visible = true;
  newStatus.currentStatus = "New";
  newStatus.isDefault = false;

  // Save to database
  const rs = await statusRepo.save(newStatus);
  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot create status",
    });
  }
  res.send(rs);
};

const viewAllStatus = async (req: Request, res: Response) => {
  const statusRepo = AppDataSource.getRepository(Status);
  const allStatus = await statusRepo.find();

  if (allStatus.length <= 0) {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
  res.json(allStatus);
};

const editStatus = async (req: Request, res: Response) => {
  const { name, order } = req.body;
  const id = parseInt(req.params.id);

  const statusRepo = AppDataSource.getRepository(Status);
  const status = await statusRepo.find({ where: { id: id } });

  if (!status) {
    return res.status(404).json({
      error_msg: "Cannot find status name",
    });
  }
  // Create query builder to update status
  const rs = await AppDataSource.createQueryBuilder()
    .update(Status)
    .set({ statusName: name, orderNumber: order })
    .where("id = :id", { id: id })
    .execute();

  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot update status",
    });
  }
  res.send(`Update status ${name} successfully`);
};

const setVisibleStatus = async (req: Request, res: Response) => {
  const reqID = parseInt(req.params.id);

  const statusRepo = AppDataSource.getRepository(Status);
  const status = await statusRepo.findOne({ where: { id: reqID } });

  if (!status) {
    return res.status(404).json({
      error_msg: "Cannot find status id",
    });
  }
  const rs = await AppDataSource.createQueryBuilder()
    .update(Status)
    .set({ visible: !status.visible })
    .where("id = :id", { id: reqID })
    .execute();
  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot update status",
    });
  }
  res.send(`Update status ${status.statusName} successfully`);
};
export { createStatus, editStatus, viewAllStatus, setVisibleStatus };
