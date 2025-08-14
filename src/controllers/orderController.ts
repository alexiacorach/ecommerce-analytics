import { Request, Response } from "express";
import Order, { IOrderItem } from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from '../types';
import { Types } from 'mongoose';

//create a new order( only auth users)
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id; //from authmiddleware
        if (!userId) return res.status(401).json({ message: "Not authorized" });

        const { items }: { items: IOrderItem[] } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "The order has no products" });
        }

        //calculate total and validate existing product
        let total = 0;
        const orderItems: IOrderItem[] = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product by ID ${item.product} not found` });
            }
            const orderItem: IOrderItem = {
                product: product._id as Types.ObjectId,
                quantity: item.quantity,
                price: product.price
            };
            orderItems.push(orderItem)
            total += product.price * item.quantity;
        }

        //create order
        const newOrder = new Order({
            customer: userId,
            items: orderItems,
            total,
            status: "pending",
            paid: false
        })
        await newOrder.save();

        res.status(202).json({
            message: "Order succesfull",
            order: newOrder
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
}

//Client can see his order
export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        // El id del usuario viene del middleware de autenticación
        const orders = await Order.find({ customer: req.user.id }).populate('items.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving your orders', error });
    }
};

//Admin can see all orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name email role')
            .populate('items.product', 'name category price');

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
}