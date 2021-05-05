$(document).ready(function () {
    $('#test').append(sessionStorage.getItem('bank'));
    $('#test').append(sessionStorage.getItem('tafel'));
    $('#test').append(sessionStorage.getItem('stoel'));
    $('#test').append(sessionStorage.getItem('lamp'));
    console.log("ready!");
    sessionStorage.clear();
});