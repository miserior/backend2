import { cartModel } from "./models/cartModel.js";

class cartDBManager {
    constructor(productDBManager) {
        this.productDBManager = productDBManager;
    }

    async create() {
        return await cartModel.create({ products: [] });
    }

    async getAll() {
        return await cartModel.find();
    }

    async getById(cid) {
        const cart = await cartModel.findOne({ _id: cid }).populate('products.product');
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        return cart;
    }

async addProduct(cid, pid) {
    // 1. Buscamos el carrito
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    // 2. Buscamos si el producto ya existe en el carrito
    const existIndex = cart.products.findIndex(item => 
        item.product.toString() === pid || item.product._id?.toString() === pid
    );

    if (existIndex !== -1) {
        cart.products[existIndex].quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    return await cartModel.findByIdAndUpdate(cid, { products: cart.products }, { new: true });
}

    async update(cid, cartData) {
        return await cartModel.updateOne({ _id: cid }, { products: cartData.products });
    }

    async deleteProduct(cid, pid) {
        const cart = await cartModel.findOne({ _id: cid });
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        const newProducts = cart.products.filter(item => item.product.toString() !== pid);
        await cartModel.updateOne({ _id: cid }, { products: newProducts });
        return await this.getById(cid);
    }

    async updateProducts(cid, products) {
        await cartModel.updateOne({ _id: cid }, { products: products });
        return await this.getById(cid);
    }

    async deleteAllProducts(cid) {
        await cartModel.updateOne({ _id: cid }, { products: [] });
        return await this.getById(cid);
    }
}

export { cartDBManager };