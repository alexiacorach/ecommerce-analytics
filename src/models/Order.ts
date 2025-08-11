import { Document, Schema, model, Types } from 'mongoose';

export interface IOrderItem {
    product: Types.ObjectId; //reference to produc
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    customer: Types.ObjectId; //reference to User
    items: IOrderItem[];
    total: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
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
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default model<IOrder>('Order', OrderSchema);