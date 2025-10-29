import Sale from "../models/Sale.js";
import Product from "../models/Product.js";


export const createSale = async (req, res) => {
try {
const { products, paymentMethod } = req.body;


if (!products || products.length === 0)
return res.status(400).json({ message: "No se enviaron productos." });


let total = 0;
for (const item of products) {
const product = await Product.findOne({ _id: item.product, user: req.user._id });
if (!product) throw new Error(`Producto no encontrado o no pertenece al usuario.`);
if (product.stock < item.quantity)
throw new Error(`Stock insuficiente para ${product.name}`);


total += item.price * item.quantity;
}


const sale = await Sale.create({ user: req.user._id, products, total, paymentMethod });


for (const item of products) {
await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
}


res.status(201).json(sale);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


export const getSales = async (req, res) => {
try {
const sales = await Sale.find({ user: req.user._id })
.populate("user", "name email")
.populate("products.product", "name price");
res.json(sales);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


export const getSaleById = async (req, res) => {
try {
const sale = await Sale.findOne({ _id: req.params.id, user: req.user._id })
.populate("user", "name email")
.populate("products.product", "name price");


if (!sale) return res.status(404).json({ message: "Venta no encontrada" });
res.json(sale);
} catch (error) {
res.status(500).json({ message: error.message });
}
};