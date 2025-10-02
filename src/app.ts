import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRouter from './routes/auth';
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import analyticsRouter from "./routes/analyticsRoutes"
import cartRouter from './routes/cartRoutes';


dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter)
app.use("/api/analytics", analyticsRouter)
app.use('/api/cart', cartRouter);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando " });
});

const PORT = process.env.PORT || "5000";

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
};

startServer();