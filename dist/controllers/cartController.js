"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutCart = exports.removeItemFromCart = exports.updateCartItem = exports.addItemToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
//see cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await Cart_1.default.findOne({ user: userId }).populate('items.product', 'name price stock');
        if (!cart) {
            cart = await Cart_1.default.create({ user: userId, items: [] });
        }
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting cart', error });
    }
};
exports.getCart = getCart;
//add product to cart
const addItemToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const product = await Product_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        let cart = await Cart_1.default.findOne({ user: userId });
        if (!cart)
            cart = await Cart_1.default.create({ user: userId, items: [] });
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding item', error });
    }
};
exports.addItemToCart = addItemToCart;
//update quantity
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found' });
        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item)
            return res.status(404).json({ message: 'Item not in cart' });
        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};
exports.updateCartItem = updateCartItem;
//delete product
const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing item', error });
    }
};
exports.removeItemFromCart = removeItemFromCart;
//checkout. turns cart into order
const checkoutCart = async (req, res) => {
    try {
        const userId = req.user.id; // middleware
        const cart = await Cart_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        let total = 0;
        // Validate stock. calc total
        for (const item of cart.items) {
            const product = item.product;
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }
            total += product.price * item.quantity;
        }
        // Create order
        const orderItems = cart.items.map(i => {
            const product = i.product;
            return {
                product: product._id,
                quantity: i.quantity,
                price: product.price
            };
        });
        const newOrder = new Order_1.default({
            customer: userId,
            items: orderItems,
            total,
            status: 'pending',
            paid: false
        });
        await newOrder.save();
        // Reduce stock (update)
        for (const item of cart.items) {
            const product = item.product;
            product.stock -= item.quantity;
            await product.save();
        }
        // empty cart
        cart.items = [];
        await cart.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during checkout', error });
    }
};
exports.checkoutCart = checkoutCart;
