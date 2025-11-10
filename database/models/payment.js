import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    transaction_uuid: {
        type: String,
        required: true
    },
    gateway: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["initiated", "success", "failed"], 
        default: "initiated"
    },
    amount_paid: {
        type: Number, 
        required: true
    },
    paid_at: {
        type: Date
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
}, {
    timestamps: true
});

const payment = mongoose.model("Payment", paymentSchema);
export default payment;