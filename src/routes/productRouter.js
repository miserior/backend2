import { Router } from 'express';
// Importamos el servicio desde el index de repositories
import { productService } from '../repositories/index.js';
import { uploader } from '../utils/multerUtil.js';

const router = Router();


// OBTENER PRODUCTOS
router.get('/', async (req, res) => {
    try {
        // Usamos el nombre de método estándar definido en el Repository
        const result = await productService.getProducts(req.query);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});


// OBTENER PRODUCTO POR ID
router.get('/:pid', async (req, res) => {
    try {
        const result = await productService.getProductById(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});


// CREAR PRODUCTO
router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = req.files.map(file => file.path);
    }

    try {
        const result = await productService.createProduct(req.body);
        res.status(201).send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});


// ACTUALIZAR PRODUCTO

router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files && req.files.length > 0) {
        req.body.thumbnails = req.files.map(file => file.filename);
    }

    try {
        const result = await productService.updateProduct(req.params.pid, req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});


// ELIMINAR PRODUCTO
router.delete('/:pid', async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;