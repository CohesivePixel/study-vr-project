/**
 * Created by Ben on 12-1-2017.
 */
var countDown = {
    objects : {
        cipher: document.getElementById('timer'),
        start: 10,
        count: null,
        loadingScreen: document.getElementById('main-compound'),
        mainStage: document.getElementById('main-stage')
    },

    init: function()
    {
        countDown.setStage();
        countDown.startCountDown();
    },

    setStage: function(){
        $(countDown.objects.mainStage).hide();
    },

    startCountDown : function()
    {
        countDown.objects.count = countDown.objects.start;

        function looper()
        {
            countDown.objects.cipher.innerHTML = countDown.objects.count;
            countDown.objects.count -= 1;

            if ( countDown.objects.count !== -1 )
            {
                setTimeout(looper, 1000);
                console.log( countDown.objects.count );
            }

            if ( countDown.objects.count === -1 )
            {
                console.log('Entering VR...');
                countDown.objects.cipher.innerHTML = 'GO';
                setTimeout(function(){
                    countDown.postCountDown();
                },1000);
            }

        }
        looper();
    },

    postCountDown : function()
    {
        console.log('Entered VR-Scene');
       $(countDown.objects.mainStage).show();
       $(countDown.objects.loadingScreen).hide();
    }
};

countDown.init();

















































/**
 * Click button in index
 * Set object in javascript according to choice in html
 * In enter vr link user through based on choice from html
 */

/*
 var linkScenes = {

 dataLink : {
 choice : null,
 links : document.getElementsByClassName('furn-btn'),
 link_btn : document.getElementById('enter-vr')
 },

 setListeners : function(){
 var i;
 for ( i = 0; i < linkScenes.dataLink.links.length; i++ ) {
 linkScenes.dataLink.links[i].addEventListener('click', function () {
 linkScenes.storeValue(this);
 });
 }

 linkScenes.dataLink.link_btn.addEventListener('click', function(){
 linkScenes.linkThrough();
 })

 },

 storeValue : function(link) {
 linkScenes.dataLink.choice = link.getAttribute('data-type');
 },

 linkThrough : function(){
 switch ( linkScenes.dataLink.choice ){
 case 'couch' : window.location = 'couch.html';
 break;

 case 'table' : window.location = 'table.html';
 break;

 case 'chair' : console.log('chair');
 break;

 case 'lamp' : console.log('chair');
 break;

 default: console.log('none chosen');
 break;
 }
 }
 };
 */





