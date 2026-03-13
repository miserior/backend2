export const authorization = (role) => {
    return async (req, res, next) => {
        // Si no hay usuario (Passport no lo encontró)
        if (!req.user) return res.status(401).send({ status: "error", error: "No autenticado" });
        
        // Si el rol no coincide
        if (req.user.role !== role) {
            return res.status(403).send({ status: "error", error: "No tienes permisos suficientes" });
        }
        
        next();
    }
}