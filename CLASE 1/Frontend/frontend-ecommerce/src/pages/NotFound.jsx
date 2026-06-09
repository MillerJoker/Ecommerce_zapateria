import { Link } from "react-router-dom";

export const NotFound = () =>{
    return(
        <div style={{textAlign:"center", padding:"50px"}}>
            <h1 style={{fontSize:"80px", margin:"0", color:"black"}}>Error 404</h1>
            <h2>La pagina no ha sido encontrada</h2>
            <Link to="/">
            </Link>
        </div>
    )
}