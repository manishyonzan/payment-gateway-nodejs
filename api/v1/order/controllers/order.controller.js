import orderService from "../../../../services/v1/order/order.service.js";

export const orderController = {
    create: async (req, res, next) => {

        try {
            let {
                product_code,
                amount,
                product_service_charge,
                product_delivery_charge,
                tax_amount } = req.body;

            const data = await orderService.create({
                amount,
                product_code,
                product_delivery_charge,
                product_service_charge,
                tax_amount,
            })
            res.status(201).json({ success: true, data: data })

        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            let { orderId } = req.params;

            const getOrder = await orderService.get({ order_id: orderId });
            res.status(200).json({ success: true, data: getOrder })

        } catch (error) {
            next(error);
        }
    }
}