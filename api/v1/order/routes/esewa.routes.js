import express from "express";
import { esewaController } from "../controllers/esewa.controller.js";

export const esewaRouter = () => {
    const router = express.Router();

    router.get('/:orderId', esewaController.create)
    router.get("/success/:orderId", esewaController.updateOnTransactionSucess);
    router.get("/failed/:orderId", esewaController.updateOnTransactionFailed);
    return router

}