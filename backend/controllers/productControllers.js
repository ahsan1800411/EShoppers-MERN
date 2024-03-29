import Product from "./../models/productModel.js";
import asyncHandler from "express-async-handler";

//  All Products ==> /api/products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

// a single Product ==> /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  } else {
    res.json(product);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({
      message: "Product successfully deleted",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Itel Vision 2",
    user: req.user._id,
    price: 0,
    description: "Good Phone",
    category: "Electronics",
    numReviews: 0,
    brand: "Itel",
    countInStock: 0,
    image: "/images/sample.jpg",
  });
  const createdProduct = await product.save();
  res.json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    numReviews,
    brand,
    countInStock,
    image,
  } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.brand = brand;
    product.countInStock = countInStock;
    product.image = image;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  createProductReview,
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
};
