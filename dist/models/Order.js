"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
});
const ShippingAddressSchema = new mongoose_1.Schema({
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
}, { _id: false });
const PaymentInfoSchema = new mongoose_1.Schema({
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
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Order', OrderSchema);
