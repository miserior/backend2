export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async (params) => {
        return await this.dao.getAllProducts(params);
    }

    // Método para obtener uno solo
    getProductById = async (id) => {
        return await this.dao.getProductByID(id);
    }

    updateProduct = async (id, data) => {
        return await this.dao.updateProduct(id, data);
    }

    createProduct = async (data) => {
        return await this.dao.createProduct(data);
    }

    deleteProduct = async (id) => {
        return await this.dao.deleteProduct(id);
    }
}