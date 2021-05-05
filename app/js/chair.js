/**
 * Created by Ben on 29-11-2016.
 */
/**
 * TODO audio werkt niet altijd
 */
AFRAME.registerComponent('cursor-fuse', {
    init: function () {
        var el = this.el;

        el.addEventListener('mouseenter', function () {
            $('#stop-count').remove();
            $('#counter').append('<a-animation ' +
                'id="start-count" ' +
                'easing="ease-in" ' +
                'attribute="theta-length" ' +
                'fill="forwards" ' +
                'from="0.0" ' +
                'to="360.0" ' +
                'dur="700">' +
                '</a-animation>');
            $('#stop-count').remove();
        });

        el.addEventListener('mouseleave', function () {
            $('#start-count').remove();
            $('#counter').append('<a-animation ' +
                'id="stop-count" ' +
                'easing="ease-in" ' +
                'attribute="theta-length" ' +
                'fill="backwards" ' +
                'from="360.0" ' +
                'to="0.0" ' +
                'dur="200" ' +
                '</a-animation>');
            $('#start-count').remove();
        })
    }
});

/**
 * Once you open the menu on an entity that entity receives the id 'menu-now', once you close the menu
 * the entity gets it's id removed. If you open the menu on another enity the old entity gets it's id
 * removed and the new entity get's it
 *
 * If class is 'menu-compat' > showmenu uitvoeren > vanuit showmenu kiezen
 */
AFRAME.registerComponent('menu', {
    init: function () {
        var el = this.el;

        el.addEventListener('click', function () {
            var menuNow = document.querySelectorAll("[data-menu='menu-now']")[0];

            if ( menuNow !== undefined ){
                menu.functions.clearMenu(menuNow);
            }

            if ($(this).parent().attr('class') === 'menu-compat') {
                menu.functions.showMenu(el.getAttribute('position'));
                el.setAttribute('data-menu', 'menu-now');
            }
        });
    }
});


/**
 * The actions are as follows
 * RGB value for color
 * rem for closing the menu
 * up for picking up object
 */
AFRAME.registerComponent('selection', {
    schema: {
        action: {
            default: 'none'
        }
    },

    init: function () {
        var el = this.el;
        var data = this.data;

        el.addEventListener('click', function () {
            if (data.action === 'rem') {
                var spawner = document.getElementById('spawner');

                spawner.setAttribute('position', '-10 -10 -11');
            }
            else if (data.action === 'up') {
                pickup.functions.playSound(null, document.querySelectorAll("[data-menu='menu-now']")[0].getAttribute('data-act-cat'));
                pickup.functions.getObject(null, document.querySelectorAll("[data-menu='menu-now']")[0]);
            }
            else {
                menu.functions.setColour(data.action);
            }
        });
    }
});




// EINDE VAN DE COMPONENT FUNCTIES, BEGIN VAN DE STANDAARD JS FUNCTIES

// ARMREST = miniatuurtjes
// LEAN = Daadwerkelijke Component


/**
 *
 * @type {{functions: {showMenu: menu.functions.showMenu, clearMenu: menu.functions.clearMenu, setColour: menu.functions.setColour}}}
 */
var menu = {
    functions: {
        showMenu: function (me) {
            var spawner = document.getElementById('spawner');
            var items = document.getElementsByClassName('menu-item');
            var i;

            for (i = 0; i < items.length; i++) {
                items[i].emit('move');
            }

            spawner.setAttribute('position', ( me.x * 75 ) + ' ' + ( me.y + 1.0 ) + ' ' + me.z);
        },

        clearMenu: function (menuNow) {
            var spawner = document.getElementById('spawner');
            var compat = document.getElementsByClassName('menu-compat')[0];

            menuNow.setAttribute('data-menu', '');
            spawner.setAttribute('position', '0 0 0');
        },

        setColour: function (colour) {
            var target = document.querySelectorAll("[data-menu='menu-now']")[0];
            target.setAttribute('color', colour);
        }
    }
};


/**
 *
 * @type {{init: pickup.init, setListeners: pickup.setListeners, functions: {getObject: pickup.functions.getObject, playSound: pickup.functions.playSound}}}
 */
var pickup = {

    init: function(){
        pickup.setListeners();
    },

    setListeners: function(){
        var selectablesArray = document.getElementsByClassName('selectab');
        var count;
        var actualArray = document.getElementsByClassName('actual');
        var refresh = document.getElementById('refresh');
        refresh.addEventListener('click', function(){
            for (count = 0; count < actualArray.length; count++){
                actualArray[count].setAttribute('position', '-10 -10 -10');
            }
        });

        for( count = 0; count < selectablesArray.length; count++ ){
            selectablesArray[count].addEventListener('click', function(){
                pickup.functions.getObject(this, null);
                pickup.functions.playSound(this.getAttribute('data-cat'), null);
            });
        }
    },

    functions : {
        getObject : function(obj, part){
            var hand = document.getElementById('held');

            if ( part === null ){

                hand.setAttribute('class', obj.getAttribute('data-cat'));
                hand.setAttribute('data-sort', obj.getAttribute('data-sort'));
                hand.setAttribute('obj-model', 'obj:' + obj.getAttribute('src'));
                hand.setAttribute('rotation', obj.getAttribute('rotation'));
                hand.setAttribute('data-place', obj.getAttribute('data-place'))

            } else {

                menu.functions.clearMenu( document.querySelectorAll("[data-menu='menu-now']")[0] );
                hand.setAttribute('class', part.getAttribute('data-act-cat'));
                hand.setAttribute('obj-model', 'obj:' + part.getAttribute('src'));
                part.setAttribute('position', '-10 -10 -10');
                hand.setAttribute('data-place', obj.getAttribute('data-place'))

            }
        },

        playSound : function(cat, part){
            var speaker;

            if ( part === null ){

                speaker = document.getElementById('pickupSound-' + cat);
                console.log(cat);

            } else {

                speaker = document.getElementById('pickupSound-act-' + part);
                console.log(part);

            }

            speaker.components.sound.playSound();
        }
    }
};


/**
 *
 * @type {{init: placedown.init, setListeners: placedown.setListeners, functions: {setObject: placedown.functions.setObject, playSound: placedown.functions.playSound}}}
 */
var placedown = {

    init: function(){
        placedown.setListeners();
    },

    setListeners: function(){
        var placer = document.getElementById('placer');
        var hand = document.getElementById('held');
        var refresh = document.getElementById('refresh');
        var checkout = document.getElementById('checkout');

        refresh.addEventListener('click', function () {
            /*placedown.functions.refreshObj();
             var speaker3R = document.getElementById('placeDownSound3R');
             speaker3R.components.sound.playSound();*/
        });
        checkout.addEventListener('click', function () {

            var speaker3R = document.getElementById('placeDownSound3R');
            /*speaker3R.components.sound.playSound();*/
            sessionStorage.setItem('stoel', 'Custom Chair €69,-');
            $('#info-text-parent').append('<a-entity id="info-text" bmfont-text="text:Zet je VR bril af;align:center;color:#202020" position="-2.48 1.25 0.13"></a-entity>');

            setTimeout(function () {
                location.href = '/end.html';
            }, 5000);
        });

        placer.addEventListener('click', function(){
            placedown.functions.returnAll(hand.getAttribute('data-place'));
            placedown.functions.setObject(hand);
            placedown.functions.playSound(hand.getAttribute('class'));
        });


    },

    functions : {
        returnAll : function(spot){
            var allObjects = document.querySelectorAll('[data-act-place='+ spot + ']');
            var count;

            for ( count = 0; count < allObjects.length; count++ ){
                allObjects[count].setAttribute('position', '-10 -10 -10');
                console.log(spot);
            }
        },

        setObject : function(hand){
            var modelActual = document.getElementById(hand.getAttribute('class') + '-actual-model');
            var modelParent = document.getElementById(hand.getAttribute('class') + '-actual');

            hand.setAttribute('obj-model', null);
            modelActual.setAttribute('position', '0 0.4 0');
            modelParent.setAttribute('class', 'menu-compat');
        },

        playSound : function(cat){
            var speaker = document.getElementById('placeDownSound-act-' + cat);
            speaker.components.sound.playSound();
        }
    }
};

var empty = {
    init : function(){
        empty.setListeners();
    },

    setListeners : function(){
        var hand = document.getElementById('held');
        var crossR = document.getElementById('crossR');
        var crossL = document.getElementById('crossL');

        crossR.addEventListener('click', function(){
            hand.setAttribute('obj-model', null);
            hand.setAttribute('class', '');
            console.log('hi');
        });

        crossL.addEventListener('click', function(){
            hand.setAttribute('obj-model', null);
            hand.setAttribute('class', '');
            console.log('hi');
        });
    }
};


/**
 * Deze functie maakt contact met de API en stelt op basis van de teruggeven waarden de kleur van
 * de lucht buiten in.
 *
 * @type {{init: setupApi.init, functions: {makeCall: setupApi.functions.makeCall}}}
 */
var setupApi = {
    init: function () {
        setupApi.functions.makeCall();
    },
    functions: {
        makeCall: function () {
            $.ajax({
                url: "https://api.darksky.net/forecast/b210ecc387da1da24dc2df75f86ac22b/52.1583,4.4931",

                // The name of the callback parameter, as specified by the YQL service
                jsonp: "callback",

                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",

                // Tell YQL what we want and that we want JSON
                data: {
                    format: "json"
                },
                // Work with the response

                success: function (response) {
                    if (response['currently']['cloudCover'] < "0.26") {
                        console.log('lightblue');
                        $('#sky').attr('color', '#a5f7ff');
                    }
                    if (response['currently']['cloudCover'] > "0.25" && response['currently']['cloudCover'] < "0.51") {
                        console.log('darkblue');
                        $('#sky').attr('color', '#49778f');
                    }
                    if (response['currently']['cloudCover'] > "0.50" && response['currently']['cloudCover'] < "0.91") {
                        console.log('white');
                        $('#sky').attr('color', '#e5e1e1');
                    }
                    if (response['currently']['cloudCover'] > "0.90") {
                        console.log('dark');
                        $('#sky').attr('color', '#616161');
                    } // server response
                }
            });
        }
    }
};

$(document).ready(function () {
    /**
     * Start the engine
     */
    setupApi.init();
    pickup.init();
    placedown.init();
    empty.init();

});

