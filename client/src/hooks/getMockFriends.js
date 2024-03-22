const mockFriend = {
    id : 0,
    nombre: "Susana",
    apellido_paterno : "Merudia",
    apellido_materno: "Rodriguez",
    image : "/images/girl.png",
    edad : 20,
    descripcion: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum facere voluptate dicta obcaecati deserunt nobis suscipit eaque?" ,
    puntuacion: 5,
    n_clientes: 38,


}

const getMockFriends = (n) => {
    const friends = [];
    for (let index = 1; index < n; index++) {
        friends.push({...mockFriend,id : index,puntuacion: Math.round(Math.random() * 5),n_clientes : Math.round(Math.random() * 40)})
    }
    
    return friends;
}

export {getMockFriends};