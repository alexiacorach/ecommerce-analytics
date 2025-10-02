"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
//Returns every product from database
const getAllProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};
exports.getAllProducts = getAllProducts;
//Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving product", error });
    }
};
exports.getProductById = getProductById;
//Creates a new product on the database
const createProduct = async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;
        if (!name || !category || !price) {
            return res.status(400).json({ message: "Name, category and price are required" });
        }
        const newProduct = new Product_1.default({ name, category, price, stock });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};
exports.createProduct = createProduct;
// Updates Product by ID
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;
        const updatedProduct = await Product_1.default.findByIdAndUpdate(productId, updates, {
            new: true,
            runValidators: true
        });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};
exports.updateProduct = updateProduct;
//delete product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteProduct = deleteProduct;
