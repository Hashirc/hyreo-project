"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.updateCart = updateCart;
const dbService_1 = require("../services/dbService");
async function getCart(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const cart = await (0, dbService_1.dbGetCart)(req.user.uid);
        return res.status(200).json(cart);
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ message: error.message || 'Error fetching cart' });
    }
}
async function updateCart(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Cart items array is required' });
        }
        const updatedCart = await (0, dbService_1.dbUpdateCart)(req.user.uid, items);
        return res.status(200).json({
            message: 'Cart updated successfully',
            cart: updatedCart
        });
    }
    catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ message: error.message || 'Error updating cart' });
    }
}
