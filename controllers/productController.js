const { default: slugify } = require("slugify");
const productModel = require("../models/productModel");
const fs = require("fs");

const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "category is required" });
      case !photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is required and should be less then 1mb" });
    }
    const product = await new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(207).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

// get all products
const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      quantity: products.length,
      message: "All product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// get single product
const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geting single product",
      error,
    });
  }
};

// get photo
const productPhotoController = async (req, res) => {
    try {
        const product = await productModel
          .findById(req.params.pid).select("photo")
          if(product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
          }
       
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while geting photo",
          error,
        });
      }
};


// delete product
const deleteProductController = async (req, res) => {
    try {
      const {pid} = req.params;
      await productModel.findByIdAndDelete(pid).select("-photo")
      res.status(200).send({
        success: true,
        message: "Product sucessfully deleted"
      }) 
       
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while deleteing product",
          error,
        });
      }
};

// update product
const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "category is required" });
      case !photo?.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is required and should be less then 1mb" });
    }
    const {pid} = req.params;
    const product = await new productModel.findByIdAndUpdate(pid, {
      ...req.fields, slug: slugify(name)
    }, {new: true})
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(207).send({
      success: true,
      message: "Product updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating product",
      error,
    });
  }
};


//
const productFiltersController = async (req, res) => {
  try{
    const {checked, priceRange} = req.body;
    let args = {}
    if(checked.length > 0) {
      args.category = checked;
    }
    if(priceRange.length) {
      args.price = {$gte: priceRange[0], $lte: priceRange[1]};
    }
    console.log(args)
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products
    })

  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while filtering product",
      error,
    });
  }
}

const productSerarchController = async (req, res) => {
  try{
    const { keyword } = req.params
    const result = await productModel.find({
      $or: [
        {name: {$regex: keyword, $options:"i"}},
        {description: {$regex: keyword, $options:"i"}}
      ]
    }).select("-photo")
    res.json(results);

  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while searching product",
      error,
    });
  }
}






module.exports = {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productSerarchController
};
