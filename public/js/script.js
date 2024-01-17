
let select=document.querySelector('.backgroundPerfil');

function backgroundChoose() {
    let perfilUser = document.querySelector('.perfilUser');

    let selectedBg=select.value


    perfilUser.style.backgroundImage = `url("${selectedBg}")`
}

select.addEventListener('change',backgroundChoose);


function editMode() {
    let userName=document.querySelector('.userName');
    

    if(userName.readOnly==true) {
        userName.readOnly = false;
        select.disabled=false;
    }
    else {
        userName.readOnly = true;
        select.disabled=false;
    }


}
