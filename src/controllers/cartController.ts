import { Request, Response } from 'express';
import Cart, { ICartItem, ICart } from '../models/Cart';
import Product, { IProduct } from '../models/Product';
import Order, { IOrderItem, IOrder } from '../models/Order'
import { Types } from 'mongoose';
import { AuthRequest } from '../types/index';

//see cart
export const getCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price stock');

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error getting cart', error });
    }
}

//add product to cart
export const addItemToCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId)
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = await Cart.create({ user: userId, items: [] });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity })
        }

        await cart.save();
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: 'Error adding item', error });
    }
}

//update quantity
export const updateCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ message: 'Item not in cart' });

        item.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};

//delete product
export const removeItemFromCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item', error });
    }
};

//checkout. turns cart into order
export const checkoutCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id; // middleware
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let total = 0;

        // Validate stock. calc total
        for (const item of cart.items) {
            const product = item.product as unknown as IProduct;
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }
            total += product.price * item.quantity;
        }

        // Create order
        const orderItems = cart.items.map(i => {
            const product = i.product as unknown as IProduct;
            return {
                product: product._id,
                quantity: i.quantity,
                price: product.price
            }
        });

        const newOrder = new Order({
            customer: userId,
            items: orderItems,
            total,
            status: 'pending',
            paid: false
        });
        await newOrder.save();

        // Reduce stock (update)
        for (const item of cart.items) {
            const product = item.product as unknown as IProduct;
            product.stock -= item.quantity;
            await product.save();
        }

        // empty cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });

    } catch (error) {
        res.status(500).json({ message: 'Error during checkout', error });
    }
};


