import { Schema, model, Types, Document } from 'mongoose';

export interface ICartItem {
    product: Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    user: Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
}, { timestamps: true })

export default model<ICart>('Cart', CartSchema);