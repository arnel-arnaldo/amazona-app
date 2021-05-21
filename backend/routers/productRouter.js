import express from 'express';
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

// create API to get (GET) list of data to frontend
productRouter.get('/', expressAsyncHandler(async (req, res) => {
    const products = await Product.find({}); // find({}) means to display all
    res.send(products);
}));

productRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
}));

// create API to get (GET) details of a product
productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

// create API to create (POST) a new product
productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample_Product_Name_' + Date.now(),
        image: '/images/newproduct.jpg',
        price: 0,
        category: 'Sample Category',
        brand: 'Sample Brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'Sample Description'
    });
    const createdProduct = await product.save(); // After saving a new product,
    // these codes below will pass the created product to frontend
    res.send({ message: 'Product Created', product: createdProduct });
}));

export default productRouter;