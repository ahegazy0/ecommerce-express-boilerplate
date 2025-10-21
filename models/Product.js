const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        default:
          "https://via.placeholder.com/400x400/cccccc/969696?text=Product",
      },
    ],
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
    },
    brand: {
      type: String,
      trim: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for primary image
Product.virtual("primaryImage").get(function () {
  return (
    this.images[0] ||
    "https://via.placeholder.com/400x400/cccccc/969696?text=Product"
  );
});

// Virtual for discount percentage
Product.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for is in stock
Product.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Indexes for performance
Product.index({ name: 1 });
Product.index({ category: 1 });
Product.index({ price: 1 });
Product.index({ isActive: 1 });
Product.index({ isFeatured: 1 });
Product.index({ "ratings.average": -1 });
Product.index({ createdAt: -1 });
Product.index({ tags: 1 });

// Text index for search
Product.index({
  name: "text",
  description: "text",
  tags: "text",
});

// Instance method to update stock
Product.methods.updateStock = function (quantity, operation = "decrease") {
  if (operation === "decrease") {
    if (this.stock < quantity) {
      throw new Error("Insufficient stock available");
    }
    this.stock -= quantity;
  } else if (operation === "increase") {
    this.stock += quantity;
  }
  return this.save();
};

// Static method to search products
Product.statics.searchProducts = function (query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy = "createdAt",
    sortOrder = -1,
    page = 1,
    limit = 20,
  } = options;

  const searchQuery = {
    isActive: true,
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  if (category) {
    searchQuery.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    searchQuery.price = {};
    if (minPrice !== undefined) searchQuery.price.$gte = minPrice;
    if (maxPrice !== undefined) searchQuery.price.$lte = maxPrice;
  }

  if (inStock) {
    searchQuery.stock = { $gt: 0 };
  }

  const skip = (page - 1) * limit;

  return this.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model("Product", Product, "products");
