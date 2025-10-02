"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
dotenv_1.default.config();
const seedData = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        //clean coleccions
        await User_1.default.deleteMany();
        await Product_1.default.deleteMany();
        //hashed password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash("12345", salt);
        //User Data
        const users = [
            { name: "Admin User", email: "admin@example.com", password: hashedPassword, role: "admin" },
            { name: "John Doe", email: "john@example.com", password: hashedPassword, role: "customer" },
            { name: "Jane Smith", email: "jane@example.com", password: hashedPassword, role: "customer" }
        ];
        const products = [
            { name: "Laptop Dell XPS", price: 1500, stock: 5, category: "Electronics" },
            { name: "Mouse Logitech", price: 30, stock: 20, category: "Electronics" },
            { name: "Keyboard Mechanical", price: 80, stock: 15, category: "Electronics" }
        ];
        await User_1.default.insertMany(users);
        await Product_1.default.insertMany(products);
        console.log("Seed data inserted successfully");
        mongoose_1.default.connection.close();
    }
    catch (error) {
        console.error(" Error seeding data:", error);
        mongoose_1.default.connection.close();
    }
};
seedData();
