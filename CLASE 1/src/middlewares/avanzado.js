


export function loggerDetallado(req,res,next){
    const inicio = Date.now();
    const id = Math.random().toString(36).slice(7)
    req.requestId = id
    console.log(`Request ${id} - ${req.method} ${req.url} - Inicio: ${new Date().toISOString()}`)

    res.on('finish',()=>{
        const ms = Date.now() - inicio;
        console.log(`Request ${id} ${res.statusCode} - Duracion: ${ms}ms`)
    })
    next();
}



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


export const asynHandler = (fn) => 
    (req,res,next) => 
        fn(req,res,next).catch(next);
