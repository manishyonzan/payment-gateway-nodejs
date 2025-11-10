import payment from "../../../models/payment.js";

const paymentRepository = {
    async create({
        amount_paid,
        gateway,
        metadata,
        order_id,
        paid_at,
        status,
        transaction_uuid,
    }) {

        try {

            const data = await payment.create({
                amount_paid,
                gateway,
                order_id,
                paid_at,
                status,
                metadata,
                transaction_uuid
            })
            return data;
        } catch (error) {
            throw error;
        }
    },
    async onPaymentComplete({
        paymentId,
        status,
    }) {
        try {
            const data = await payment.findOneAndUpdate({ transaction_uuid: paymentId }, { status: status }, { new: true });
            return data;

        } catch (error) {
            throw error;
        }
    }
}

export default paymentRepository;