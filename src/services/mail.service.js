import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendRecoveryMail = async (email, link) => {
    return await transport.sendMail({
        from: `Ecommerce Coder <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Restablecer contraseña',
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>¿Olvidaste tu contraseña?</h2>
                <p>Haz clic en el botón de abajo para restablecerla. Este enlace expirará en 1 hora.</p>
                <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                <p>Si no solicitaste esto, ignora este correo.</p>
            </div>
        `
    });
};