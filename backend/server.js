import dotenv from "dotenv";
import connectDB from "./src/config/db_temp.js";
import app from "./src/app.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Controlia backend corriendo en puerto ${PORT}`));
