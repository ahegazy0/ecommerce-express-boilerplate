const Product = require("../../models/Product");
const wrapAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
const uploadStream = require("../../utils/uploadStream");

const addProduct = wrapAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError("No images uploaded", 400);
  }

  const cloudUpladImage = req.files.map((file) =>
    uploadStream(file.buffer, "E-commerce Products")
  );

  const uploadResult = await Promise.all(cloudUpladImage);

  const imageUrls = uploadResult.map((image) => image.secure_url);

  const features = req.body.features
    ? req.body.features.split(",").map((f) => f.trim())
    : [];

  const tags = req.body.tags
    ? req.body.tags.split(",").map((t) => t.trim().toLowerCase())
    : [];

  const newProduct = new Product({
    ...req.body,
    images: imageUrls,
    features,
    tags,
  });

  await newProduct.save();

  return res.jsend.success({ product: newProduct }, 201);
});

const updateProduct = wrapAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({ _id: productId, isActive: true });

  if (!product) {
    throw new AppError("Product with this ID not found.", 400);
  }

  if (req.files && req.files.length > 0) {
    const cloudUpladImage = req.files.map((file) =>
      uploadStream(file.buffer, "E-commerce Products")
    );
    const uploadResults = await Promise.all(cloudUpladImage);
    const newImageUrls = uploadResults.map((result) => result.secure_url);
    product.images = [...(product.images || []), ...newImageUrls];
  }

  const updates = req.body;
  Object.keys(updates).forEach((key) => {
    if (key !== "images" && updates[key] !== undefined)
      product[key] = updates[key];
  });

  const updatedProduct = await product.save();

  return res.jsend.success({ updatedProduct });
});

const deleteProduct = wrapAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findByIdAndUpdate(
    productId,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError("Product with this ID not found.", 400);
  }
  res.jsend.success({ message: "Product deleted successfully" });
});

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
};
