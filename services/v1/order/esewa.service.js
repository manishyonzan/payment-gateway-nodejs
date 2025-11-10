import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import orderService from "./order.service.js";
import paymentRepository from "../../../database/repositories/v1/order/payment.repository.js";
import AppError from "../../../utils/appError.js";
const esewaService = {
    async create({ orderId }) {

        // const order = await OrderService.findById(orderId)
        const order = await orderService.get({ order_id: orderId });

        if (order.payment_state =="paid") throw new AppError("Already paid");
        const uid = uuidv4();
        const message = `total_amount=${order.total_amount},transaction_uuid=${uid},product_code=EPAYTEST`
        const hash = CryptoJS.HmacSHA256(message, process.env.ESEWASECRET);
        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);


        const createPayment = await paymentRepository.create({
            amount_paid: order.total_amount,
            gateway: "esewa",
            metadata: null,
            order_id: order._id,
            paid_at: new Date(),
            status: "initiated",
            transaction_uuid: uid,
        });


        const updatePaymentIdonOrder = await orderService.update({ latest_payment_gateway: "esewa", latest_payment_id: uid, order_id: orderId, payment_state: "unpaid" });


        return { amount: createPayment.amount_paid, uid: uid, total_amount: createPayment.amount_paid, signature: hashInBase64 }
    },

    async verifySuccess({ orderId, queryData }) {

        let decodedString = atob(queryData);
        // console.log("dec_string", decodedString)
        // console.log("ds==", typeof (decodedString))
        const obj = JSON.parse(decodedString)
        // console.log("obj==", typeof (obj))
        decodedString = JSON.parse(decodedString);

        switch (decodedString.status) {
            case "COMPLETE":
                try {


                    const message = `transaction_code=${decodedString.transaction_code},status=${decodedString.status},total_amount=${decodedString.total_amount},transaction_uuid=${decodedString.transaction_uuid},product_code=${decodedString.product_code},signed_field_names=${decodedString.signed_field_names}`
                    const hash = CryptoJS.HmacSHA256(message, process.env.ESEWASECRET);
                    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
                    // console.log(hashInBase64 == decodedString.signature)
                    const result = hashInBase64 == decodedString.signature
                    if (result == false) {
                        throw new AppError("Hashing did not matched", 403);
                    }



                    let orderData = await orderService.get({ order_id: orderId });
                    const orderUpdate = await orderService.update({ latest_payment_gateway: "esewa", latest_payment_id: orderData.latest_payment_id, order_id: orderId, payment_state: "paid" });
                    const paymentStateChange = await paymentRepository.onPaymentComplete({ paymentId: orderData.latest_payment_id, status: "success" })
                    return { transaction_complete: true, amount_paid: paymentStateChange.amount_paid };

                } catch (error) {
                    throw error;
                }
                break;
            case "PENDING":
                return { transaction_complete: false }
                break;
            case "FULL_REFUND":
                break;

            case "CANCELED":
                break;

        }


    }

}

export default esewaService;