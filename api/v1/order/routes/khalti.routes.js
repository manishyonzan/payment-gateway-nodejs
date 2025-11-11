import express from "express";
import { khaltiController } from "../controllers/khalti.controller.js";

export const khaltiRouter = () => {
    
    const router = express.Router()
    router
        .get(
            '/success/:orderId',
            khaltiController.updateOnTransactionSucess
        )
        .get(
            "/:orderId",
            khaltiController.create
        );


    return router;

}