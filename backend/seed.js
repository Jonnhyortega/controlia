import dotenv from "dotenv";
import connectDB from "./src/config/db_temp.js";
import User from "./src/models/User.js";
import Product from "./src/models/Product.js";
import Client from "./src/models/Client.js";
import Sale from "./src/models/Sale.js";
import Supplier from "./src/models/Supplier.js";

dotenv.config();
await connectDB();

try {
  console.log("🧹 Limpiando colecciones...");
  await Promise.all([
    Product.deleteMany(),
    Client.deleteMany(),
    Sale.deleteMany(),
    Supplier.deleteMany(),
  ]);

  // Obtener usuario actual
  const user = await User.findOne({ email: "jonathan@controlia.com" });
  if (!user) throw new Error("❌ No se encontró el usuario Jonathan");

  console.log("👤 Usuario encontrado:", user.email);

  // Crear productos
  const products = await Product.insertMany([
    {
      name: "Coca-Cola 500ml",
      category: "Bebidas",
      price: 1200,
      cost: 800,
      stock: 40,
      barcode: "CC500",
      description: "Refresco clásico",
      user: user._id,
    },
    {
      name: "Papas Lays 100g",
      category: "Snacks",
      price: 900,
      cost: 500,
      stock: 60,
      barcode: "LY100",
      description: "Papas fritas saladas",
      user: user._id,
    },
  ]);

  // Crear clientes
  const clients = await Client.insertMany([
    {
      name: "Carlos Pérez",
      phone: "1123456789",
      email: "carlos@gmail.com",
      address: "Av. Corrientes 1234",
      user: user._id,
    },
    {
      name: "Lucía Gómez",
      phone: "1198765432",
      email: "lucia@gmail.com",
      address: "Av. Rivadavia 4567",
      user: user._id,
    },
  ]);

  // Crear proveedor
  const supplier = await Supplier.create({
    name: "Distribuidora Norte",
    phone: "1144445555",
    email: "ventas@distribuidoranorte.com",
    address: "San Martín 3000",
    debt: 0,
    user: user._id,
  });

  // Crear venta
  const sale = await Sale.create({
    user: user._id,
    products: [
      { product: products[0]._id, quantity: 2, price: products[0].price },
      { product: products[1]._id, quantity: 1, price: products[1].price },
    ],
    total: products[0].price * 2 + products[1].price,
    paymentMethod: "efectivo",
  });

  console.log("✅ Datos generados correctamente:");
  console.log({
    products: products.length,
    clients: clients.length,
    suppliers: 1,
    sales: 1,
  });

  process.exit();
} catch (error) {
  console.error("❌ Error al generar datos:", error);
  process.exit(1);
}
