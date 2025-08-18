import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { AuthRequest } from '../types/index';

// Total sales per period (day, month, year). Query params: ?start=YYYY-MM-DD&end=YYYY-MM-DD
export const getSalesByPeriod = async (req: AuthRequest, res: Response) => {
    try {
        const { start, end, groupBy } = req.query;

        //validate parameters
        if (!start || !end) {
            return res.status(400).json({ message: "Please insert start y end date in YYYY-MM-DD format" });
        }
        //turn dates to new date
        const startDate = new Date(start as string);
        const endDate = new Date(end as string)

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
        const sales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $ne: 'cancelled' }//avoid cancelled orders
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
        ])
        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obtaining" })
    };
}

// Products top sale. rankins x sales
export const getTopProducts = async (req: AuthRequest, res: Response) => {
    try {
        const { start, end, category, limit } = req.query;

        const startDate = start ? new Date(start as string) : undefined;
        const endDate = end ? new Date(end as string) : undefined;
        const topN = limit ? Number(limit) : 10;

        const pipeline: any[] = [];

        //filter by date. avoid cancelled
        const match: any = { status: { $ne: 'cancelled' } };
        if (startDate && endDate) {
            match.createdAt = { $gte: startDate, $lte: endDate }
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
        })
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
        })

        pipeline.push({ $sort: { unitsSold: -1, revenue: -1 } });
        pipeline.push({ $limit: topN });

        const result = await Order.aggregate(pipeline);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting top products" });
    }
}

// Top customers
export const getTopCustomers = async (_req: AuthRequest, res: Response) => {
    try {
        const topCustomers = await Order.aggregate([
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
        await User.populate(topCustomers, { path: "_id", select: "name email" });

        res.json(topCustomers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obtaining top customers" });
    }

};

// Low stock Products
export const getLowStockProducts = async (req: AuthRequest, res: Response) => {
    try {
        const threshold = parseInt(req.query.threshold as string) || 5;

        const products = await Product.find({ stock: { $lte: threshold } })
            .select("name stock price")
            .sort({ stock: 1 })

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obtaining low stock products" })

    }
}
