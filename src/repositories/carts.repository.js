import ticketModel from '../dao/models/ticketModel.js';
import { productService } from './index.js'; 
import { v4 as uuidv4 } from 'uuid';

export default class CartRepository {
    constructor(dao) {
        this.dao = dao; 
    }

    // 0. OBTENER TODOS LOS CARRITOS
    getCarts = async () => {
        return await this.dao.getAll();
    }

    // 1. Obtener carrito por ID
    getCartById = async (id) => {
        return await this.dao.getById(id);
    }

    // 2. Crear un carrito nuevo
    createCart = async () => {
        return await this.dao.create();
    }

    // 3. Agregar producto al carrito
    addProductToCart = async (cartId, productId) => {
        return await this.dao.addProduct(cartId, productId);
    }

    // 4. LÓGICA DE COMPRA
    purchase = async (cartId, userEmail) => {
        const cart = await this.dao.getById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        let totalAmount = 0;
        const productsNotProcessed = [];

        for (const item of cart.products) {
            const product = item.product; 
            const quantity = item.quantity;

            // Verificamos stock
            if (product.stock >= quantity) {
                // A. Restamos stock
                const newStock = product.stock - quantity;
                await productService.updateProduct(product._id, { stock: newStock });

                // B. Sumamos al total del Ticket
                totalAmount += product.price * quantity;
            } else {
                // C. Si no hay stock, guardamos el ID
                productsNotProcessed.push(product._id.toString());
            }
        }

        let ticket = null;

        if (totalAmount > 0) {
            ticket = await ticketModel.create({
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userEmail
            });

            const remainingProducts = cart.products.filter(item => 
                productsNotProcessed.includes(item.product._id.toString())
            );

            await this.dao.updateProducts(cartId, remainingProducts);
        }

        return {
            ticket,
            unprocessedIds: productsNotProcessed
        };
    }

    deleteProductFromCart = async (cartId, productId) => {
        return await this.dao.deleteProduct(cartId, productId);
    }

    emptyCart = async (cartId) => {
        return await this.dao.deleteAllProducts(cartId);
    }
}