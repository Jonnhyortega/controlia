import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import DailyCash from "../models/DailyCash.js";

/* ==========================================================
   🟢 CREAR VENTA
========================================================== */
export const createSale = async (req, res) => {
  try {
    const { products, total, paymentMethod } = req.body;

    // ✅ Crear venta
    const newSale = await Sale.create({
      user: req.user._id,
      products,
      total,
      paymentMethod,
    });

    // 📅 Fecha sin hora
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Buscar caja del día o crearla
    let dailyCash = await DailyCash.findOne({ user: req.user._id, date: today });

    if (!dailyCash) {
      dailyCash = new DailyCash({
        user: req.user._id,
        date: today,
        sales: [newSale._id],
        totalSalesAmount: total,
        totalOperations: 1,
        status: "abierta",
      });
    } else {
      dailyCash.sales.push(newSale._id);
      dailyCash.totalSalesAmount += total;
      dailyCash.totalOperations += 1;
    }

    await dailyCash.save();

    res.status(201).json({
      message: "✅ Venta registrada correctamente",
      sale: newSale,
      dailyCash,
    });
  } catch (error) {
    console.error("❌ Error al registrar venta:", error);
    res.status(500).json({
      message: "Error al registrar venta",
      error: error.message,
    });
  }
};

/* ==========================================================
   📋 LISTAR TODAS LAS VENTAS
========================================================== */
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

/* ==========================================================
   🔍 OBTENER VENTA POR ID
========================================================== */
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("user", "name email")
      .populate("products.product", "name price");

    if (!sale)
      return res.status(404).json({ message: "Venta no encontrada" });

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================================================
   🔴 REVERTIR VENTA
========================================================== */
export const revertSale = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🧾 Revirtiendo venta ID:", id);

    const sale = await Sale.findOne({ _id: id, user: req.user._id }).populate(
      "products.product"
    );

    if (!sale)
      return res.status(404).json({ message: "Venta no encontrada." });

    if (sale.status === "reverted")
      return res.status(400).json({ message: "La venta ya fue revertida." });

    // 🧮 Revertir stock
    for (const item of sale.products) {
      const productId = item.product?._id || item.product;
      if (!productId) continue;

      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }

    // 🚫 Marcar venta como revertida
    sale.status = "reverted";
    await sale.save();

    // 📅 Normalizar fecha de la venta
    const saleDate = new Date(sale.date);
    saleDate.setHours(0, 0, 0, 0);

    // 📊 Buscar caja diaria y actualizar totales
    const dailyCash = await DailyCash.findOne({
      user: req.user._id,
      date: saleDate,
    });

    if (dailyCash) {
      dailyCash.totalSalesAmount = Math.max(
        0,
        (dailyCash.totalSalesAmount || 0) - sale.total
      );
      dailyCash.totalOperations = Math.max(
        0,
        (dailyCash.totalOperations || 1) - 1
      );
      dailyCash.sales = dailyCash.sales.filter(
        (s) => s.toString() !== sale._id.toString()
      );
      await dailyCash.save();
    } else {
      console.warn("⚠️ No se encontró registro de DailyCash para esta fecha.");
    }

    res.status(200).json({ message: "✅ Venta revertida correctamente." });
  } catch (err) {
    console.error("❌ Error en revertSale:", err);
    res.status(500).json({
      message: "Error interno al revertir la venta.",
      error: err.message,
    });
  }
};
