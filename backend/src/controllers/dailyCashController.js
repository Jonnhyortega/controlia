import DailyCash from "../models/DailyCash.js";
import Sale from "../models/Sale.js";

/* ==========================================================
   🟢 OBTENER (O CREAR) LA CAJA DEL DÍA
========================================================== */
export const getTodayCash = async (req, res) => {
  console.log("📅 [DEBUG] getTodayCash ejecutado");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // 🧾 Buscar caja existente del día (por rango horario)
    let dailyCash = await DailyCash.findOne({
      user: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate({
        path: "sales",
        populate: { path: "products.product", select: "name price" },
      })
      .lean();

    // 🚫 Si no hay caja, creamos una con las ventas del día
    if (!dailyCash) {
      const sales = await Sale.find({
        user: req.user._id,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).populate("products.product", "name price");

      const totalSalesAmount = sales.reduce((sum, s) => sum + (s.total || 0), 0);
      const totalOperations = sales.length;

      dailyCash = await DailyCash.create({
        user: req.user._id,
        date: today,
        sales: sales.map((s) => s._id),
        totalSalesAmount,
        totalOperations,
        status: "abierta",
      });

      // Recargamos con populate para enviar al frontend
      dailyCash = await DailyCash.findById(dailyCash._id)
        .populate({
          path: "sales",
          populate: { path: "products.product", select: "name price" },
        })
        .lean();
    }

    // ✅ Devuelve todo con productos incluidos
    return res.status(200).json(dailyCash);
  } catch (error) {
    console.error("❌ Error al obtener caja del día:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la caja del día", error: error.message });
  }
};
/* ==========================================================
   🔴 CERRAR LA CAJA DEL DÍA
========================================================== */
export const closeDailyCash = async (req, res) => {
  try {
    const { extraExpenses = [], supplierPayments = [], finalReal = null } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyCash = await DailyCash.findOne({ user: req.user._id, date: today });
    if (!dailyCash) {
      return res.status(404).json({ message: "No existe una caja abierta para el día de hoy." });
    }

    if (dailyCash.status === "cerrada") {
      return res.status(400).json({ message: "⚠️ La caja del día ya fue cerrada." });
    }

    // Calcular totales
    const totalExpenses = extraExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalPayments = supplierPayments.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalOut = totalExpenses + totalPayments;
    const finalExpected = dailyCash.totalSalesAmount - totalOut;
    const real = finalReal ?? finalExpected;
    const difference = real - finalExpected;

    // Actualizar el registro
    dailyCash.extraExpenses = extraExpenses;
    dailyCash.supplierPayments = supplierPayments;
    dailyCash.totalOut = totalOut;
    dailyCash.finalExpected = finalExpected;
    dailyCash.finalReal = real;
    dailyCash.difference = difference;
    dailyCash.status = "cerrada";

    await dailyCash.save();

    res.status(200).json({
      message: "✅ Caja cerrada correctamente.",
      data: dailyCash,
    });
  } catch (error) {
    console.error("❌ Error al cerrar caja:", error);
    res.status(500).json({
      message: "Error al cerrar la caja.",
      error: error.message,
    });
  }
};

/* ==========================================================
   📆 LISTAR DÍAS CON CAJAS CERRADAS
========================================================== */
export const getClosedCashDays = async (req, res) => {
  try {
    const days = await DailyCash.find({ user: req.user._id, status: "cerrada" })
      .sort({ date: -1 })
      .select("date totalSalesAmount totalOut difference finalExpected finalReal");

    res.status(200).json(days);
  } catch (error) {
    console.error("❌ Error al obtener cierres:", error);
    res.status(500).json({ message: "Error al obtener días con cierres de caja." });
  }
};

/* ==========================================================
   📅 OBTENER CAJA POR FECHA
========================================================== */
export const getDailyCashByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Normalizar fecha
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Buscar caja diaria
    const dailyCash = await DailyCash.findOne({
      user: req.user._id,
      date: targetDate,
    })
      .populate({
        path: "sales",
        populate: { path: "products.product", select: "name price" },
      })
      .sort({ date: -1 });

    if (!dailyCash)
      return res
        .status(404)
        .json({ message: "No se encontró caja para esa fecha." });

    res.status(200).json(dailyCash);
  } catch (error) {
    console.error("❌ Error al obtener caja por fecha:", error);
    res
      .status(500)
      .json({ message: "Error al obtener caja por fecha", error: error.message });
  }
};
