

const checkPassword = () => {
    return (password) => password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$ %^&*-_]).{8,}$/); 
   
}


export {checkPassword};