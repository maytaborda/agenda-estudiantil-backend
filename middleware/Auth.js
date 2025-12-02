const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    try {
        //obtener token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token){
            return res.status(401).json({
                message:'No hay token, autorización denegada'
            });
        }

        //verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({
            message:'Token no válido'
        });
    }
}

module.exports = auth;