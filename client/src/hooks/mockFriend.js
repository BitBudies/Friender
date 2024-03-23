const mockFriend = {
    id : 0,
    nombre: "Susana",
    apellido_paterno : "Merudia",
    apellido_materno: "Rodriguez",
    imagen : "/images/girl.png",
    edad : 20,
    descripcion: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum facere voluptate dicta obcaecati deserunt nobis suscipit eaque?" ,
    puntuacion: 5,
    n_clientes: 38,
    precio : 20,
}

const friends = [];

const generateMockFriends = (n) => {
    if(!friends.length){
        console.log("generating")
        for (let index = 1; index < 30 ; index++) {
            friends.push({
                ...mockFriend,
                id : index,puntuacion: (Math.random() * 5).toFixed(2),
                n_clientes : Math.round(Math.random() * 40),
                precio : Math.round(Math.random() * (40 - 5)) + 5
            })
        }
    }  
}

const getMockFriends = () => {
    return friends.map((friend) => {
        const {descripcion, ...simpleFriend} = friend;
       return simpleFriend;
    });
}

const getMockFriendById = (id) => {
    return friends.find((friend) => friend.id === Number(id))
}

export {getMockFriends,getMockFriendById,generateMockFriends};