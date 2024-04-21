

const checkPassword = () => {
    return (password) =>{
        console.log(password,"password")
        if (password.length < 8) {
            return {pass : false,message : "La contraseña debe ser mayor a 8 caracteres"}
        }
        if (!password.match(/[a-z]/g)){
            return {pass : false, message : "La contraseña debe tener al menos un carácter"}
        }
        if (!password.match(/[A-Z]/g)){
            return {pass : false, message : "La contraseña debe tener al menos un carácter en mayúscula"}
        }
        if (!password.match(/\d/g)){
            return {pass : false, message : "La contraña debe tener al menos un numero"}
        }
        if (!password.match(/[#!@$%&-*]+/g)){
            return {pass : false, message : "La contraseña debe tener al menos un carácter especial."}
        }
        return {pass : true}
    }
   
}


export {checkPassword};