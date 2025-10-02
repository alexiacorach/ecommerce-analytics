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
app.use(cors({
  origin: 'https://d1a7h2pd8rli18.cloudfront.net', // tu frontend en CloudFront
  methods: ['GET', 'POST', 'PUT', 'DELETE'],        // métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // headers permitidos
}));
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

const PORT = parseInt(process.env.PORT || "5000", 10);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => console.log(`Servidor en puerto ${PORT}`));
};

startServer();