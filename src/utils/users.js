const users =[]

const addUser = ({id,username,room}) =>{
    //Cleaning The data
    // username = username.trim().toLowerCase()
    // room = room.trim().toLowerCase()
    //validate the data
    if(!username){
        return {
            error: " Usernames and room are required"
        }
    }
    //Checking for existing user
    const existingUser = users.find((user)=>{
        return user.room == room && user.username == username
    })

    if(existingUser){
        return {
            error:"Username is in Use "
        }
    }
    //Store User Name
    const user ={id,username,room}
    users.push(user)
    return {user}
}


const removeUser =(id)=>{
const index = users.findIndex((user)=>  user.id===id  )
if(index !== -1){
 return users.splice(index,1)[0]
}
}

const getUser =(id)=>{
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) =>{
    room=room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUserInRoom 
}