
const useGetNavOptions = () => {
    return [
        {
            id : 1,
            name : 'Home',
            url: '/',
        },
        {
            id : 2,
            name : 'Buscar Amigos',
            url: '/amigos?pagina=1',
        },
    ]
}

export {useGetNavOptions};