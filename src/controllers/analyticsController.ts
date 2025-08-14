import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../types';

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


// 2. Productos más vendidos
export const getTopProducts = async (_req: AuthRequest, res: Response) => {
    // Agregación para rankear productos por cantidad vendida
};

// 3. Clientes con más compras
export const getTopCustomers = async (_req: AuthRequest, res: Response) => {
    // Agregación para rankear clientes por total gastado
};

// 4. Productos con bajo stock
export const getLowStockProducts = async (_req: AuthRequest, res: Response) => {
    // Consulta simple: stock < threshold
};
