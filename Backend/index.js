const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();

const userRoutes = require("./routes/UserRoutes");
const InventoryRoutes = require("./routes/InventoryRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const warrantyRoutes = require("./routes/WarrantyRoutes");

const app = express();
app.use(cors());
connectDB();

app.use(express.json({ extended: false }));

app.use("/api/auth", userRoutes);
app.use("/api/inventory", InventoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/warranty", warrantyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
