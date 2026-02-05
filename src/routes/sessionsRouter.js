import { Router } from 'express';
import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/constantsUtil.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();

// Registro con Hash
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), 
            role: 'user'
        };
        const result = await userModel.create(newUser);
        res.send({ status: "success", message: "Usuario registrado" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al registrar" });
    }
});

// Login JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !isValidPassword(user, password)) {
        return res.status(401).send({ status: "error", error: "Credenciales inválidas" });
    }

    // Generación doken
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'coderSecretKey', { expiresIn: '24h' });

    // Enviamos el token en una cookie para que Passport-JWT lo pueda leer
    res.cookie('coderCookieToken', token, { httpOnly: true }).send({ status: "success", message: "Login exitoso" });
});

router.get('/current', 
    passport.authenticate('current', { session: false }), 
    (req, res) => {
        // Devuelve los datos asociados al JWT extraídos por Passport
        res.send({ status: "success", payload: req.user });
    }
);

export default router;