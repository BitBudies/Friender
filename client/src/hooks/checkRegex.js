

const checkPassword = () => {
    return (password) =>{
        if (password.length < 8) {
            return {pass : false,message : "La contraseña debe tener al menos 8 caracteres"}
        }
        if (!password.match(/[a-z]/g)){
            return {pass : false, message : "La contraseña debe tener al menos una letra en minúscula"}
        }
        if (!password.match(/[A-Z]/g)){
            return {pass : false, message : "La contraseña debe tener al menos una letra en mayúscula"}
        }
        if (!password.match(/\d/g)){
            return {pass : false, message : "La contraña debe tener al menos un número"}
        }
        if (!password.match(/[#!@$%&-*+/?¡]+/g)){
            return {pass : false, message : "La contraseña debe tener al menos un caracter especial"}
        }
        return {pass : true}
    }
   
}


export {checkPassword};