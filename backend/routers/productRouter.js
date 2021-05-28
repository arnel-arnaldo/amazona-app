import express from 'express';
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import { isAuth, isAdmin, isSellerOrAdmin } from '../utils.js';

const productRouter = express.Router();

// create API to get (GET) list of data to frontend
productRouter.get('/', expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};
    const products = await Product.find({...sellerFilter});
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
productRouter.post('/', isAuth, isAdmin, isSellerOrAdmin, expressAsyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample_Product_Name_' + Date.now(),
        seller: req.user._id,
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

// create API to update (PUT) a product
productRouter.put('/:id', isAuth, isAdmin, isSellerOrAdmin, expressAsyncHandler(async(req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product){
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct = await product.save();
        res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

// create API to delete a product
productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const deleteProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

export default productRouter;