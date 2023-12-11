
let select=document.querySelector('.backgroundPerfil');

function backgroundChoose() {
    let perfilUser = document.querySelector('.perfilUser');

    let selectedBg=select.value


    perfilUser.style.backgroundImage = `url("${selectedBg}")`
}

select.addEventListener('change',backgroundChoose);