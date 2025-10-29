import Product from "../models/Product.js";


export const createProduct = async (req, res) => {
  try {
  const { name, category, price, cost, stock, barcode, description } = req.body;
  
  
  const productExists = await Product.findOne({ barcode, user: req.user._id });
  if (productExists) return res.status(400).json({ message: "El producto ya existe" });

  const product = await Product.create({
    barcode,
    description,
    user: req.user._id,
    });
    
    
    res.status(201).json(product);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
    
    
    export const getProducts = async (req, res) => {
    try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
    
    
    export const getProductById = async (req, res) => {
    try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
    
    
    export const updateProduct = async (req, res) => {
    try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    
    
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
    
    
    export const deleteProduct = async (req, res) => {
    try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    
    
    await product.deleteOne();
    res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };