import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { createHash, isValidPassword } from '../utils/constantsUtil.js';
import { userService } from '../repositories/index.js'; 
import { sendRecoveryMail } from '../services/mail.service.js'; 

const router = Router();


// 1. REGISTRO DE USUARIO
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    
    if (!first_name || !email || !password) {
        return res.status(400).send({ status: "error", error: "Faltan datos obligatorios" });
    }

    try {
        const exists = await userService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), 
            role: 'user'
        };
        
        await userService.createUser(newUser);
        res.send({ status: "success", message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al registrar: " + error.message });
    }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.getUserByEmail(email);

        if (!user || !isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Enviamos el token
        res.cookie('coderCookieToken', token, { 
            httpOnly: true, 
            maxAge: 60 * 60 * 24 * 1000 // 24 horas
        }).send({ status: "success", message: "Login exitoso" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// 3. RUTA CURRENT
router.get('/current', 
    passport.authenticate('current', { session: false }), 
    (req, res) => {
        // req.user viene de la estrategia de Passport
        const userDTO = userService.getUserDTO(req.user);
        res.send({ status: "success", payload: userDTO });
    }
);


// 4. SOLICITUD DE RECUPERACIÓN PASS
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "Usuario no encontrado" });

        // Token de 1 hora para el link
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const link = `http://localhost:8080/reset-password?token=${token}`;

        await sendRecoveryMail(email, link);
        res.send({ status: "success", message: "Correo de recuperación enviado." });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// 5. RESTABLECER CONTRASEÑA

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ status: "error", error: "Datos incompletos" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserByEmail(decoded.email);

        if (isValidPassword(user, newPassword)) {
            return res.status(400).send({ 
                status: "error", 
                error: "No puedes usar la misma contraseña anterior. Elige una diferente." 
            });
        }

        const hashedPass = createHash(newPassword);
        await userService.updateUserPassword(user._id, hashedPass);

        res.send({ status: "success", message: "Contraseña actualizada correctamente" });
    } catch (error) {
        // Captura si el token expiró (TokenExpiredError) o es alterado
        res.status(400).send({ 
            status: "error", 
            error: "El link ha expirado o es inválido. Por favor, solicita uno nuevo." 
        });
    }
});


// 6. LOGOUT ok

router.post('/logout', (req, res) => {
    res.clearCookie('coderCookieToken').send({ status: "success", message: "Sesión cerrada correctamente" });
});

export default router;