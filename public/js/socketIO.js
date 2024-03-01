let listUser=document.querySelector(".listUsers")
let chatUser=document.querySelector(".chat");
let textInputArea=document.querySelector(".textInputArea");
let sendButton=document.querySelector(".sendButton");
let mood=document.querySelector(".mood")


const socket=io()


function titleUser(username) {
    document.title=`bitTalks ( ${username} )`
}

socket.on("join-request",titleUser);



function addMessage(type,user,msg,userName) {

    switch(type) {
        case 'statusOn':
            chatUser.innerHTML+=`<li class="joined"><strong>${user}</strong> ${msg}</li>`
        break;
        case 'statusOff':
            chatUser.innerHTML+=`<li class="disjoined">${msg}</li>`
        break;
        case 'msg':
            chatUser.innerHTML+=`<li class="msgText">
                                    <div class="msgTextUserIdentify d-flex flex-row gap-2">                                
                                        <div class="circlePerfilMsg" style="background-image:url('${user}')"></div>
                                        <p class="userName2">${userName}</p>
                                    </div>
                                    <p class="textChat">${msg}</p>
                                </li>`
        break;
        case 'msgSended':
            chatUser.innerHTML+=`<li class="msgTextSended">
                                    <div class="msgTextUserIdentify d-flex flex-row gap-2">                                
                                        <div class="circlePerfilMsg" style="background-image:url('${user}')"></div>
                                        <p class="userName1">${userName}</p>
                                    </div>
                                    <p class="textChat">${msg}</p>
                                </li>`
        break;
    }
}


function renderUserList() {

    listUser.innerHTML="";


    usersList.forEach((u)=> {
                    listUser.innerHTML+=`<li class="userField d-flex align-items-center">
                                            <div class="perfilUser" style="background-image:url('${u.perfilUser}')"></div>
                                            <div class="userStatus d-block align-items-center">
                                                <p class="userTitle">${u.user}</p>
                                                <h5 class="subTitle">Online</h5>
                                            </div>
                                        </li>`
                })

}

socket.on("join-user",(list)=> {
    usersList=list
    

    renderUserList();
});

socket.on("reconnect",(list)=> {
    userList=list
    
    renderUserList()
})

function chatText(userName) {

    user=userName

    addMessage('statusOn',userName,`se juntou a sala...`)
}

socket.on("join-chat",chatText)


socket.on("disconnected",({exitedUser,listUpdate})=> {
    usersList=listUpdate

    console.log(exitedUser)


    addMessage('statusOff',null,`<strong>${exitedUser[0].user}</strong> Saiu da sala...`)

    listUser.innerHTML=""
    renderUserList()
})


textInputArea.addEventListener("keyup",(e)=> {
    if(e.keyCode===13) {

        let msg=textInputArea.value
    
        if(textInputArea.value!=="") {
            socket.emit("send-message",msg)
            textInputArea.value=""
        }
    }
})

socket.on("send-User",(data)=> {
    addMessage('msgSended',data.userBg,data.message,data.userName)
})


socket.on("send-message",(data)=> {
    addMessage('msg',data.userBg,data.message,data.userName)
})
