import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    iconUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

serviceCategorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
  next();
});

const ServiceCategory = mongoose.model(
  "ServiceCategory",
  serviceCategorySchema
);
export default ServiceCategory;
