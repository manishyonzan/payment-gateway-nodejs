import khaltiService from "../../../../services/v1/order/khalti.service.js";

export const khaltiController = {
    create: async (req, res, next) => {
        try {
            let { orderId } = req.params;
            const response = await khaltiService.create({ orderId });
            // response.data.payment_url

            res.render("khaltiOrder", { payment_url: response.data.payment_url })
        } catch (error) {
            next(error);
        }
    },
    updateOnTransactionSucess: async (req, res, next) => {
        try {
            let { orderId } = req.params;
            const response = await khaltiService.verifySuccess({ orderId });

            if (response.transaction_complete) {
                res.render("paymentSuccess", { latest_payment_gateway: "esewa", amount: response.amount_paid })
            }

            res.render("paymentFailed", { latest_payment_gateway: "esewa", amount: response.amount_paid })

        } catch (error) {
            next(error);
        }
    }
}