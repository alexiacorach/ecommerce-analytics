import { Document, Schema, model, Types } from 'mongoose';

export interface IOrderItem {
    product: Types.ObjectId; //reference to produc
    quantity: number;
    price: number;
}
export interface IShippingAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
export interface IPaymentInfo {
    method: 'credit_card' | 'paypal' | 'cash_on_delivery';
    status: 'pending' | 'paid' | 'failed';
}

export interface IOrder extends Document {
    customer: Types.ObjectId; //reference to User
    items: IOrderItem[];
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
    paid: boolean;
    shippingAddress: IShippingAddress;
    paymentInfo: IPaymentInfo;
    createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
})

const ShippingAddressSchema = new Schema<IShippingAddress>({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },

},
    { _id: false }
)

const PaymentInfoSchema = new Schema<IPaymentInfo>(
    {
        method: {
            type: String,
            enum: ['credit_card', 'paypal', 'cash_on_delivery'],
            default: 'credit_card',
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
    },
    { _id: false }
);


const OrderSchema = new Schema<IOrder>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [OrderItemSchema],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
    paid: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        type: ShippingAddressSchema,
        required: true,
    },
    paymentInfo: {
        type: PaymentInfoSchema,
        required: true,
    },
},
    { timestamps: true }
)

export default model<IOrder>('Order', OrderSchema);