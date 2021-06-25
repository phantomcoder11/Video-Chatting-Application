const generatemessage = (text,username) =>{
    return {
        username,
        text,
        createdAt : new Date().getTime()
    }
}

// const generatemessage = (text) =>{
//     return {
        
//         text,
//         createdAt : new Date().getTime()
//     }
// }

module.exports = {
generatemessage
}