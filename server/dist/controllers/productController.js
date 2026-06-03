"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getCategories = getCategories;
exports.createProduct = createProduct;
const dbService_1 = require("../services/dbService");
async function getProducts(req, res) {
    try {
        const { category, search } = req.query;
        const products = await (0, dbService_1.dbGetProducts)(category || undefined, search || undefined);
        return res.status(200).json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: error.message || 'Error fetching products' });
    }
}
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await (0, dbService_1.dbGetProductById)(id);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${id} not found` });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        console.error(`Error fetching product ${req.params.id}:`, error);
        return res.status(500).json({ message: error.message || 'Error fetching product' });
    }
}
async function getCategories(req, res) {
    try {
        const categories = await (0, dbService_1.dbGetCategories)();
        return res.status(200).json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: error.message || 'Error fetching categories' });
    }
}
async function createProduct(req, res) {
    try {
        const { name, description, price, categoryId, stock, imageUrl } = req.body;
        if (!name || !price || !categoryId || stock === undefined) {
            return res.status(400).json({ message: 'Name, price, categoryId, and stock are required' });
        }
        const newProduct = await (0, dbService_1.dbCreateProduct)({
            name,
            description,
            price: Number(price),
            categoryId,
            stock: Number(stock),
            imageUrl
        });
        return res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: error.message || 'Error creating product' });
    }
}
