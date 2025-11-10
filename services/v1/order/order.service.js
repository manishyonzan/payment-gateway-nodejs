import orderRepository from "../../../database/repositories/v1/order/order.repository.js";

const orderService = {
    async create({
        product_code,
        amount,
        product_service_charge,
        product_delivery_charge,
        tax_amount,
    }) {
        try {

            let total_amount = amount + tax_amount + product_delivery_charge + product_service_charge

            // call the repository layer
            const data = await orderRepository.create({
                
                product_code,
                amount,
                product_service_charge,
                product_delivery_charge,
                tax_amount,
                total_amount,
            })
            return data;

        } catch (error) {
            throw error;
        }
    },
    async get({ order_id }) {
        try {

            const data = await orderRepository.get({ id: order_id })
            return data;
        } catch (error) {
            throw error;
        }
    },
    async update({
        order_id,
        latest_payment_id,
        latest_payment_gateway,
        payment_state
    }) {
        try {
            const updateOrder = await orderRepository.update({ order_id, latest_payment_gateway, latest_payment_id, payment_state });
            return updateOrder;
        } catch (error) {
            throw error;
        }
    }

}


export default orderService;