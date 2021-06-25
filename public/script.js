const username = prompt('Enter your Name');
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream;

 //If the the metadata is loaded completely after that our video starts to play i.e. our camera becomes on
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
};

const connectToNewUser = (userId, stream) => {
  console.log("Connecting to new user");
  //This function will call a user with userId passed and it will pass the stream to that user
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    
    //THis events does that when we call this user we're gonna send them 
    //our video stream and when they send us back their video 
    //stream we are gonna get this event here called the 
    //stream which is going to take their video stream so 
    call.on('stream', userVideoStream => {
      console.log("Adding video stream")
       //We are taking stream from the other user that we are calling and adding it to out own custom video element on our page
        addVideoStream(video, userVideoStream);
    })

    //Whenever someone leaves the video call we want to remove their video so we use the following code
    call.on('close',function(){
        console.log("removing User at",new Date())
        video.remove();
    })

    
    peer[userId]=call;
}

//coneecting our video
//stream is out audio and video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    console.log("Tik TIk")
    //When someone tries to call us we will send our stream through it
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close',function(){
            console.log("removing User 1")
            video.remove();
        })
    })

    socket.on('user-connected', (userId) => {
      console.log("User connected with userId",userId)
        connectToNewUser(userId, stream);
    })

    socket.on('user-disconnected', (userId) => {
        console.log("User disconnected with userId",userId,"at",new Date());    
        connectToNewUser(userId, stream); 
      })
})

peer.on('open', id => {
    console.log("Opening peer")
    socket.emit('join-room', ROOM_ID, id,username);
});






let text = $('input');
    $('html').keydown(e => {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val(),username);
            // console.log(text.val());
            text.val('')
        }
    });



    const $messageTemplate = document.querySelector('#message_template').innerHTML;
    const $show_message = document.querySelector('#show_message'); 

    const autoscroll = () => {
        // New message element
        const $newMessage = $show_message.lastElementChild
    
        // Height of the new message
        const newMessageStyles = getComputedStyle($newMessage)
        const newMessageMargin = parseInt(newMessageStyles.marginBottom)
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
        console.log(newMessageMargin)
        //Now let's find the visible height
        const visibleHeight = $show_message.offsetHeight
        //Height of show_message Container
        const containerHeight = $show_message.scrollHeight
        //How far i have scrolled
        const scrollOffset = $show_message.scrollTop + visibleHeight

        
        if (containerHeight - newMessageHeight <= scrollOffset) {
            $show_message.scrollTop = $show_message.scrollHeight
        }
       
    }

    socket.on('createMessage', (message) => {
        const html = Mustache.render($messageTemplate,{
            username : message.username,
            message : message.text,
            createdAt : moment(message.createdAt).format('h:mm a')
        })
        $show_message.insertAdjacentHTML('beforeend',html);
        autoscroll();
    })


    // To show user List
    const showUsersTemplate = document.querySelector('#showUsersTemplate').innerHTML
    socket.on('roomData', ({ room, users }) => {
        const html = Mustache.render(showUsersTemplate, {
            users
        })
        document.querySelector('#showUsers').innerHTML = html
    })



const play = () => {
    const changes = `
    <i class="red fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.camonoff').innerHTML = changes

}

const stop = () => {
    const changes = `
    <i class=" fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.camonoff').innerHTML = changes

}


const camera = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        // setPlayVideo();
        play();
    }
    else {
        // setStopVideo();
        stop();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}



const muteMike = () => {
    let changes = `
    <i class=" fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.unmute').innerHTML = changes

}

const unmuteMike = () => {
    let changes = `
    <i class="red fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.mute').innerHTML = changes

}

const microphone = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        unmuteMike()
    }
    else {
       muteMike()
        myVideoStream.getAudioTracks()[0].enabled = true;
    }

    
}
var temp=1;
const chats = () => {
    var element = document.getElementById("main_right");
   
    if(temp){
        element.classList.remove("disappear");
        element.classList.add("flex");
        temp=0;
        let changes = `
        <i class="fas fa-comment"></i>
        <span>Close Chat</span>
        `
        document.querySelector('.chatbutton').innerHTML = changes
     
    }
    else{
        element.classList.add("disappear");
        element.classList.remove("flex"); 
        temp=1;
        let changes = `
        <i class="fas fa-comment-slash red"></i>
        <span>Chat</span>
        `
        document.querySelector('.chatbutton').innerHTML = changes
    }


}

// const copied = () =>{
//     alert('https://sleepy-plateau-83555.herokuapp.com/'+ROOM_ID)
// }

function copyToClipboard(text) {
    var inputc = document.body.appendChild(document.createElement("input"));
    inputc.value = 'https://sleepy-plateau-83555.herokuapp.com/'+ROOM_ID;
    inputc.focus();
    inputc.select();
    document.execCommand('copy');
    inputc.parentNode.removeChild(inputc);
    
    
    var tooltip = document.getElementById("myTooltip");
      tooltip.innerHTML = "Copied";
    }


    
    function outFunc() {
      var tooltip = document.getElementById("myTooltip");
      tooltip.innerHTML = "Copy to clipboard";
    }

    

    // socket.emit('showuser',username)
    