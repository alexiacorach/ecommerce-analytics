"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockProducts = exports.getTopCustomers = exports.getTopProducts = exports.getSalesByPeriod = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
// Total sales per period (day, month, year). Query params: ?start=YYYY-MM-DD&end=YYYY-MM-DD
const getSalesByPeriod = async (req, res) => {
    try {
        const { start, end, groupBy } = req.query;
        //validate parameters
        if (!start || !end) {
            return res.status(400).json({ message: "Please insert start y end date in YYYY-MM-DD format" });
        }
        //turn dates to new date
        const startDate = new Date(start);
        const endDate = new Date(end);
        //Define group by format
        let dateFormat;
        switch (groupBy) {
            case 'month':
                dateFormat = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
                break;
            case 'year':
                dateFormat = { year: { $year: "$createdAt" } };
                break;
            default: //day by default
                dateFormat = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } };
        }
        //Pipelines 
        const sales = await Order_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $ne: 'cancelled' } //avoid cancelled orders
                }
            },
            {
                $group: {
                    _id: dateFormat,
                    totalSales: { $sum: "$total" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);
        res.json(sales);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obtaining" });
    }
    ;
};
exports.getSalesByPeriod = getSalesByPeriod;
// Products top sale. rankins x sales
const getTopProducts = async (req, res) => {
    try {
        const { start, end, category, limit } = req.query;
        const startDate = start ? new Date(start) : undefined;
        const endDate = end ? new Date(end) : undefined;
        const topN = limit ? Number(limit) : 10;
        const pipeline = [];
        //filter by date. avoid cancelled
        const match = { status: { $ne: 'cancelled' } };
        if (startDate && endDate) {
            match.createdAt = { $gte: startDate, $lte: endDate };
        }
        pipeline.push({ $match: match });
        //explode items
        pipeline.push({ $unwind: "$items" });
        //join products to obtain name/category
        pipeline.push({
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "product"
            }
        });
        pipeline.push({ $unwind: "$product" });
        //optional filter by category
        if (category) {
            pipeline.push({ $match: { "product.category": category } });
        }
        //group by product (cuant, income)
        pipeline.push({
            $group: {
                _id: "$product._id",
                name: { $first: "$product.name" },
                category: { $first: "$product.category" },
                unitsSold: { $sum: "$items.quantity" },
                // usamos el precio guardado en el item (precio al momento de la compra)
                revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
            }
        });
        pipeline.push({ $sort: { unitsSold: -1, revenue: -1 } });
        pipeline.push({ $limit: topN });
        const result = await Order_1.default.aggregate(pipeline);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting top products" });
    }
};
exports.getTopProducts = getTopProducts;
// Top customers
const getTopCustomers = async (_req, res) => {
    try {
        const topCustomers = await Order_1.default.aggregate([
            {
                $match: { status: { $ne: 'cancelled' } } // excludes  cancelles=d orders
            },
            {
                $group: {
                    _id: "$customer",
                    totalSpent: { $sum: "$total" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);
        // Populate customer with basic info
        await User_1.default.populate(topCustomers, { path: "_id", select: "name email" });
        res.json(topCustomers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obtaining top customers" });
    }
};
exports.getTopCustomers = getTopCustomers;
// Low stock Products
const getLowStockProducts = async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 5;
        const products = await Product_1.default.find({ stock: { $lte: threshold } })
            .select("name stock price")
            .sort({ stock: 1 });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obtaining low stock products" });
    }
};
exports.getLowStockProducts = getLowStockProducts;
