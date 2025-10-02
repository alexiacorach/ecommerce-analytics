"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/analytics", analyticsRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "API funcionando " });
});
const PORT = process.env.PORT || "5000";
const startServer = async () => {
    await (0, db_1.default)();
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
};
startServer();
