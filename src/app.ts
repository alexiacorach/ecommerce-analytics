import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRouter from './routes/auth';


dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando " });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
};

startServer();