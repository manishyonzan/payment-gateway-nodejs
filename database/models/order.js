import mongoose from "mongoose"


const orderSchema = mongoose.Schema(
    {
        product_code: {
            type: String,
            required: [true, "product code is required"]

        },
        amount: {
            type: Number,
            required: [true, "amount is required"],
            validate: {
                validator: async (value) => {
                    if (Number(value) < 0) return false;
                    return true;
                },
                message: "Invalid amount."
            }
        },

        product_service_charge: {
            type: Number,
            required: [true, "amount is required"],
            validate: {
                validator: async (value) => {
                    if (Number(value) < 0) return false;
                    return true;
                },
                message: "Invalid amount."
            }
        },
        product_delivery_charge: {
            type: Number,
            required: [true, "amount is required"],
            validate: {
                validator: async (value) => {
                    if (Number(value) < 0) return false;
                    return true;
                },
                message: "Invalid amount."
            }
        },
        tax_amount: {
            type: Number,
            required: [true, "tax amount is required"],
            validate: {
                validator: async (value) => {
                    if (Number(value) < 0) return false;
                    return true;
                },
                message: "Invalid tax amount."
            }
        },
        total_amount: {
            type: Number,
            required: [true, "total amount is required"],
            validate: {
                validator: async (value) => {
                    if (Number(value) < 0) return false;
                    return true;
                },
                message: "Invalid total amount."
            }
        },
        payment_state: {
            type: String,
            enum : ["paid" ,"unpaid"],
            required: [true, "payment state is required"],
            default: "unpaid"
        },
        latest_payment_id: {
            type: String,
            default:null
        },
        latest_payment_gateway: {
            type: String,
            default:null,
        }
    },
    {
        timestamps: true,
    }
)

const order = mongoose.model("Order", orderSchema)
export default order