import order from "../../../models/order.js";
import mongoose from "mongoose";

const orderRepository = {
    async create({
        product_code,
        amount,
        product_service_charge,
        product_delivery_charge,
        tax_amount,
        total_amount,

    }) {
        try {

            const data = await order.create({
                product_code,
                amount,
                product_service_charge,
                product_delivery_charge,
                tax_amount,
                total_amount,
                payment_state: "unpaid"
            })

            return data;
        } catch (error) {
            throw error;
        }

    },
    async update(
        {
            order_id,
            latest_payment_gateway,
            latest_payment_id,
            payment_state
        }
    ) {
        try {
            let id = order_id;




            const data = await order.findByIdAndUpdate(id, { latest_payment_gateway, latest_payment_id, payment_state }, { new: true });
            console.log(data)
            return data;
        } catch (error) {
            throw error;
        }
    },
    async get({ id }) {
        try {

            const getOrder = await order.findById(id);
            return getOrder;
        } catch (error) {
            throw error;
        }
    }
}
export default orderRepository