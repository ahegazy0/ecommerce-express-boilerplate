const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const wrapAsync = require("../utils/catchAsync");

const getAllProducts = wrapAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = { isActive: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  if (req.query.featured) {
    filter.isFeatured = req.query.featured === "true";
  }

  // Build sort object
  let sort = { createdAt: -1 };
  if (req.query.sort) {
    switch (req.query.sort) {
      case "price_asc":
        sort = { price: 1 };
        break;
      case "price_desc":
        sort = { price: -1 };
        break;
      case "rating":
        sort = { "ratings.average": -1 };
        break;
      case "name":
        sort = { name: 1 };
        break;
    }
  }

  const totalProducts = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  if (products.length === 0) {
    return res.jsend.success({
      products: [],
      pagination: {
        total: totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        pageSize: limit,
      },
    });
  }

  return res.jsend.success({
    products,
    pagination: {
      total: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      pageSize: limit,
    },
  });
});

const getSingleProduct = wrapAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  }).lean();

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  // Increment view count
  await Product.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });

  return res.jsend.success({ product });
});

const getFeaturedProducts = wrapAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isActive: true, isFeatured: true })
    .sort({ "ratings.average": -1 })
    .limit(limit)
    .lean();

  return res.jsend.success({ products });
});

const getProductCategories = wrapAsync(async (req, res) => {
  const categories = await Product.distinct("category", { isActive: true });

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const count = await Product.countDocuments({ category, isActive: true });
      return { category, count };
    })
  );

  return res.jsend.success({ categories: categoriesWithCount });
});

const searchProducts = wrapAsync(async (req, res) => {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const skip = (page - 1) * limit;

  const results = await Product.searchProducts(query, {
    category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    sortBy: sort || "createdAt",
    sortOrder: -1,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  const totalResults = await Product.countDocuments({
    isActive: true,
    ...(query && { $text: { $search: query } }),
    ...(category && { category }),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice && { $gte: parseFloat(minPrice) }),
            ...(maxPrice && { $lte: parseFloat(maxPrice) }),
          },
        }
      : {}),
  });

  return res.jsend.success({
    products: results,
    pagination: {
      total: totalResults,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / parseInt(limit)),
      pageSize: parseInt(limit),
    },
  });
});

module.exports = {
  getAllProducts,
  getSingleProduct,
  getFeaturedProducts,
  getProductCategories,
  searchProducts,
};
