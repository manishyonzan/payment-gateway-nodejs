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
            const khaltiResponse = await axios.post(khaltiInitiataUrl,
                formdata,
                {
                    headers

                }
            );

            const createPayment = await paymentRepository.create({
                amount_paid: order.total_amount,
                gateway: "khalti",
                metadata: null,
                order_id: orderId,
                paid_at: new Date(),
                status: "initiated",
                transaction_uuid: khaltiResponse.data.pidx,
            });


            const updatePaymentIdonOrder = await orderService.update({ latest_payment_gateway: "khalti", latest_payment_id: khaltiResponse.data.pidx, order_id: orderId, payment_state: "unpaid" });



            return { message: "khalti success", data: khaltiResponse.data }




        } catch (error) {
            throw error;
        }
    },
    async verifySuccess({ orderId }) {
        try {

            const order = await orderService.get({ order_id: orderId });

            const khaltiLookUpUrl = "https://dev.khalti.com/api/v2/epayment/lookup/";
            const headers = {
                Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json"
            };

            const khaltiLookUpResponse = await axios.post(khaltiLookUpUrl,
                {
                    "pidx": order.latest_payment_id
                },
                {
                    headers
                }
            )

            switch (khaltiLookUpResponse.data.status) {
                case "Completed":
                    try {
                        const orderUpdate = await orderService.update({ latest_payment_gateway: "khalti", latest_payment_id: order.latest_payment_id, order_id: orderId, payment_state: "paid" });
                        const paymentStateChange = await paymentRepository.onPaymentComplete({ paymentId: order.latest_payment_id, status: "success" })
                        return { transaction_complete: true, amount_paid: paymentStateChange.amount_paid };
                    } catch (error) {
                        throw error;
                    }
                case "Pending":
                    return { transaction_complete: false, amount_paid: khaltiLookUpResponse.data.total_amount }
                // and others
                default:
                    return { transaction_complete: false, amount_paid: khaltiLookUpResponse.data.total_amount }

            }
        } catch (error) {
            throw error;
        }
    }
}

export default khaltiService