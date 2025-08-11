import { Document, Schema, model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    category: string;
    price: number;
    stock: number;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model<IProduct>('Product', ProductSchema);
