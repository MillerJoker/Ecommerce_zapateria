export function validarCampos(camposRequeridos){
    return (req,res,next) => {
        const errores = [];
        for (const campo of camposRequeridos) {
            if(!req.body[campo]) {
                errores.push(`El campo ${campo} es requerido`)
            }
        }
        if(errores.length > 0) {
            return res.status(400).json({ error:"Faltan campos requeridos", errores })
        }
        next();
    }
}


export const asyncHandler = (fn) => 
    (req,res,next) => 
        fn(req,res,next).catch(next);
