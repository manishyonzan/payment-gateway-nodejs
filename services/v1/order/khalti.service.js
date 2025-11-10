import paymentRepository from "../../../database/repositories/v1/order/payment.repository.js";
import AppError from "../../../utils/appError.js";
import orderService from "./order.service.js";
import axios from "axios";

const khaltiService = {
    async create({ orderId }) {
        try {
            const order = await orderService.get({ order_id: orderId });

            if (order.payment_state == "paid") throw new AppError("Already paid");

            const formdata = {
                "return_url": `http://localhost:3000/api/v1/order/khalti/success/${orderId}`,
                "website_url": "https://localhost:3000",
                "amount": createPayment.amount_paid * 100, //for paisa
                "purchase_order_id": order._id,
                "purchase_order_name": "test",
            };
            const headers = {
                Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json"


            };

            let khaltiInitiataUrl = "https://dev.khalti.com/api/v2/epayment/initiate/"
            const response = await axios.post(khaltiInitiataUrl,
                formdata,
                {
                    headers

                }
            );

            const createPayment = await paymentRepository.create({
                amount_paid: order.total_amount,
                gateway: "khalti",
                metadata: null,
                order_id: order._id,
                paid_at: new Date(),
                status: "initiated",
                transaction_uuid: response.data.pidx,
            });


            const updatePaymentIdonOrder = await orderService.update({ latest_payment_gateway: "khalti", latest_payment_id: uid, order_id: orderId, payment_state: "unpaid" });



            return { message: "khalti success", data: response.data }




        } catch (error) {
            throw error;
        }
    }
}