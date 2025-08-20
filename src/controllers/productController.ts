import { Request, Response } from "express";
import Product from "../models/Product";

//Returns every product from database
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
}
//Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

//Creates a new product on the database
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, category, price, stock } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ message: "Name, category and price are required" })
        }

        const newProduct = new Product({ name, category, price, stock });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
}

// Updates Product by ID
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const updates = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
            new: true,
            runValidators: true
        })

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct)
    }catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
}

//delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};