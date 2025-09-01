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

    const { items, shippingAddress, paymentInfo }: {
      items: IOrderItem[],
      shippingAddress: {
        street: string,
        city: string,
        postalCode: string,
        country: string
      },
      paymentInfo: {
        method: string
      }
    } = req.body;

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

      //validate y discount stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();

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
      paid: false,
      shippingAddress,
      paymentInfo:{
        method: paymentInfo?.method || "unknown",
        status: "pending"
      }
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

//Order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const order = await Order.findById(req.params.id)
      .populate("items.product", "name price")
      .populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

//cancell order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // cancel only if pending order
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be canceled" });
    }

    order.status = "canceled";
    await order.save();

    res.json({ message: "Order canceled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error canceling order", error });
  }
};

// Simulate payment for an order
export const payOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // only client can pay
    if (order.customer.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to pay this order" });
    }

    if (order.paid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    // simulate payment
    order.paid = true;
    order.status = "paid";
    order.paymentInfo = {
      ...order.paymentInfo,
      status: "paid",
    };

    await order.save();

    res.json({ message: "Payment successful", order });
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error });
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

//admin can update status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

