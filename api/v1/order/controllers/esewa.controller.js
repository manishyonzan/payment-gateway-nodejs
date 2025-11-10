import paymentRepository from "../../../../database/repositories/v1/order/payment.repository.js";
import esewaService from "../../../../services/v1/order/esewa.service.js";
import orderService from "../../../../services/v1/order/order.service.js";

export const esewaController = {
    create: async (req, res, next) => {

        try {
            let { orderId } = req.params;
       
            const data = await esewaService.create({ orderId: orderId })


            res.render("order", { amount: data.amount, uid: data.uid, total_amount: data.total_amount, signature: data.signature, id: orderId });

        } catch (error) {
            next(error);
        }
    },
    updateOnTransactionSucess: async (req, res, next) => {
        try {
            let { orderId } = req.params;


            let { data } = req.query;
            const esewadata = await esewaService.verifySuccess({ orderId, queryData: data });

            if (esewadata.transaction_complete) {
                res.render("paymentSuccess", { latest_payment_gateway: "esewa", amount: esewadata.amount_paid })
            }
            res.render("paymentFailed", { latest_payment_gateway: "esewa", amount: 0 })

        } catch (error) {
            next(error);
        }
    },
    updateOnTransactionFailed: async (req, res, next) => {
        try {
            let { orderId } = req.params;
            let orderData = await orderService.get({ order_id: orderId });
            const orderServiceUpdate = await orderService.update({ latest_payment_gateway: "esewa", latest_payment_id: orderData.latest_payment_id, order_id: orderId, payment_state: "unpaid" });
            const paymentStateChange = await paymentRepository.onPaymentComplete({ paymentId: orderData.latest_payment_id, status: "failed" })
            res.render("paymentFailed", { latest_payment_gateway: "esewa", amount: paymentStateChange.amount_paid });
        } catch (error) {
            next(error);
        }
    }
}