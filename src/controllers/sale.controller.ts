import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Sale } from "@/helpers/types";
import { getRemainingMessages } from "../services/rabbit.service";
import multer from "multer";
import os from "os";
import csvParse from "csv-parse";
import fs from "fs";
import amqpManager from "../queue/queueManager";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const { sales } = prisma;

const upload = multer({ dest: os.tmpdir() });
const parser = csvParse.parse;

const router = Router();

router
  .get("/", async (req, res) => {
    const sale = await sales.findMany();

    return res.status(200).json(sale);
  })
  .post("/", async (req, res) => {
    const sale: Sale = req.body;

    const newSale = await sales.create({
      data: {
        employeeId: sale.employeeCode,
        productName: sale.productName,
        totalPrice: sale.totalPrice,
        quantity: sale.quantity,
        dateSale: new Date(sale.dateSale).toISOString(),
      },
    });

    return res.status(201).json(newSale);
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const data = await sales.findFirst({ where: { id } });

    return res.status(200).json(data);
  })
  .get("/queue/status", async (req, res) => {
    const queueId = req.query.queueId
    const messagesLeft = await getRemainingMessages("sales", queueId as string);
    const queueProgress = await prisma.queue.findFirst({
      where: {
        queueId: queueId as string,
      },
    });

    const statusMessage = await prisma.queueStatus.findFirst({
      where: {
        id: queueProgress?.statusId,
      },
    });
    return res
      .status(200)
      .send({
        queueId: queueProgress?.id,
        messagesToProcess: messagesLeft,
        progressStatus: statusMessage?.statusName,
        totalMessages: queueProgress?.totalMessages
      });
  })
  .patch("/:id", async (req, res) => {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ message: 'Required parameter "id" is missing!' });

    const sale = await sales.findFirst({ where: { id } });

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const changes: Partial<Sale> = req.body;

    const updatedSale = await sales.update({
      where: { id },
      data: changes,
    });

    return res.status(200).json(updatedSale);
  })
  .delete("/:id", async (req, res) => {
    const { id } = req.params;
    await sales.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted" });
  })
  .post("/upload-csv", upload.single("file"), (req, res) => {
    try {
      const { file } = req;

      const data = fs.readFileSync(file!.path);
      parser(data, async (err: any, records: string[]) => {
        if (err) {
          console.error(err);
          return res
            .status(400)
            .json({ success: false, message: "An error occurred" });
        }
        const recordsLength = records.length - 1;
        const sales: Sale[] = [];
        const queueId = uuidv4();
        for (let i = 1; i < recordsLength; i++) {
          const sale: Sale = {
            productName: records[i][0],
            dateSale: records[i][1],
            employeeCode: records[i][2],
            totalPrice: parseInt(records[i][3], 10),
            quantity: parseInt(records[i][4], 10),
          };
          sales.push(sale);
          const message = { queueId, sale };
          amqpManager.connect().then((channel: any) => {
            amqpManager.sendMessageToQueue(channel, "sales", message);
          });
        }
        await prisma.queue.create({
          data: {
            queueId: queueId,
            totalMessages: sales.length,
            statusId: 1,
          },
        });
        return res
          .status(201)
          .json({ requestId: queueId, message: "process has been started" });
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

export default router;
