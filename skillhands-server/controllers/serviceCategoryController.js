import ServiceCategory from "../models/ServiceCategory.js";

export const listCategories = async (req, res, next) => {
  try {
    const categories = await ServiceCategory.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, iconUrl, isActive, price } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const existing = await ServiceCategory.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await ServiceCategory.create({
      name: name.trim(),
      description: description || "",
      iconUrl: iconUrl || "",
      isActive: isActive !== undefined ? !!isActive : true,
      price: typeof price === "number" ? price : Number(price) || 0,
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description, iconUrl, isActive, price } = req.body;

    const category = await ServiceCategory.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (iconUrl !== undefined) category.iconUrl = iconUrl;
    if (isActive !== undefined) category.isActive = !!isActive;
    if (price !== undefined)
      category.price = typeof price === "number" ? price : Number(price) || 0;

    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await ServiceCategory.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await ServiceCategory.findByIdAndDelete(categoryId);
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};
