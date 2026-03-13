import { Router } from 'express';
import passport from 'passport';
import { cartService } from '../repositories/index.js';
import { authorization } from '../middlewares/auth.middleware.js';

const router = Router();

//0. OBTENER TODOS LOS CARRITOS 

router.get('/', async (req, res) => {
    try {
        const carts = await cartService.getCarts(); 
        res.send({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


// 1. CREAR UN CARRITO

router.post('/', async (req, res) => {
    try {
        const result = await cartService.createCart();
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


// 2. OBTENER UN CARRITO POR ID 

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


// 3. AGREGAR PRODUCTO AL CARRITO

router.post('/:cid/product/:pid', 
    passport.authenticate('current', { session: false }),
    authorization('user'), 
    async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const result = await cartService.addProductToCart(cid, pid);
            res.send({ status: "success", message: "Producto agregado", payload: result });
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message });
        }
    }
);


// 4. FINALIZAR COMPRA

router.post('/:cid/purchase', 
    passport.authenticate('current', { session: false }),
    async (req, res) => {
        try {
            const cartId = req.params.cid;
            const userEmail = req.user.email; 

            const result = await cartService.purchase(cartId, userEmail);

            if (result.ticket) {
                res.send({ 
                    status: "success", 
                    message: "Compra procesada", 
                    ticket: result.ticket,
                    unprocessedProducts: result.unprocessedIds 
                });
            } else {
                res.status(400).send({ 
                    status: "error", 
                    message: "No se pudo procesar la compra",
                    unprocessedProducts: result.unprocessedIds 
                });
            }
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message });
        }
    }
);

/**
 * 5. ELIMINAR UN PRODUCTO DEL CARRITO
 */
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartService.deleteProductFromCart(cid, pid);
        res.send({ status: "success", message: "Producto eliminado", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


// 6. VACIAR EL CARRITO

router.delete('/:cid', async (req, res) => {
    try {
        const result = await cartService.emptyCart(req.params.cid);
        res.send({ status: "success", message: "Carrito vaciado", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;