
let select=document.querySelector('.backgroundPerfil');
let userName=document.querySelector('.userChangeName');

function backgroundChoose() {
    let perfilUser = document.querySelector('.perfilUser');

    let selectedBg=select.value


    perfilUser.style.backgroundImage = `url("${selectedBg}")`
}

select.addEventListener('change',backgroundChoose);


function editName() {   

    if(userName.readOnly==true) {
        userName.readOnly = false;
    }

}


userName.addEventListener('click',editName);
