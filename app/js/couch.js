/**
 * Created by Ben on 29-11-2016.
 */

/**
 * Het laadscherm
 */
/*AFRAME.registerComponent('loading-screen', {
    init: function(){
        var scene = this.el;
        var overlay = document.getElementById('overlay');

        scene.addEventListener('loaded', function(){
            setTimeout(function(){
                overlay.style.width = '0%';
                overlay.style.height = '0%';
            }, 1000);
        })
    }
});*/


AFRAME.registerComponent('auto-enter-vr', {
    init: function () {
        this.el.sceneEl.enterVR();
    }
});

/**
 *  TODO: De fuse-timer reset niet altijd waardoor bij het snel hoveren over meerdere objecten de timer niet tot 700 telt overal
 * Note: Door het implementeren van de fuse-timer is vanaf nu elke 'mouse-enter' eventlistener
 * vervangen door 'click'. Behalve bij de fuse-timer zelf
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
            if (document.getElementById('menu-now') !== null) {
                menu.functions.clearMenu();
            }

            if ($(this).parent().attr('class') === 'menu-compat' && $(this).parent().attr('id') === 'couch') {
                //console.log(el.getAttribute('position'));
                menu.functions.showMenuCouch(el.getAttribute('position'));
                el.setAttribute('id', 'menu-now');
            }

            if ($(this).parent().attr('class') === 'menu-compat' && $(this).parent().attr('id') != 'couch') {
                //console.log(el.getAttribute('position'));
                menu.functions.showMenu(el.getAttribute('position'));
                el.setAttribute('id', 'menu-now');
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
                menu.functions.clearMenu();
            }
            else if (data.action === 'up') {
                var menu_now = document.getElementById('menu-now');
                var held = document.getElementById('held');

                $(menu_now).parent().removeClass('menu-compat');

                held.setAttribute('class', 'placed');
                menu_now.emit('click');
            }
            else {
                menu.functions.setColour(data.action);
            }
        });
    }
});


/**
 *
 * @type {{functions: {showMenu: menu.functions.showMenu}}}
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

        showMenuCouch: function (me) {
            var spawnerCouch = document.getElementById('spawnerCouch');
            var items = document.getElementsByClassName('menu-item');
            var i;

            for (i = 0; i < items.length; i++) {
                items[i].emit('move');
            }

            spawnerCouch.setAttribute('position', ( me.x * 75 ) + ' ' + ( me.y + 1.0 ) + ' ' + me.z);
        },

        clearMenu: function () {
            var menu_now = document.getElementById('menu-now');
            var spawner = document.getElementById('spawner');
            var spawnerCouch = document.getElementById('spawnerCouch');

            $(menu_now).removeClass('menu-compat');
            spawner.setAttribute('position', '0 0 0');
            spawnerCouch.setAttribute('position', '0 0 0');
            menu_now.setAttribute('id', null);
        },

        setColour: function (colour) {
            var target = document.getElementById('menu-now');
            target.setAttribute('color', colour);
        }
    }
};


// EINDE VAN DE COMPONENT FUNCTIES, BEGIN VAN DE STANDAARD JS FUNCTIES

// ARMREST = miniatuurtjes
// LEAN = Daadwerkelijke Component



/**
 *
 * @type {{init: pickup.init, setListeners: pickup.setListeners, functions: {getObj: pickup.functions.getObj}}}
 */
var pickup = {
    init: function(){
        pickup.setListeners()
    },

    setListeners: function(){

        var held = document.getElementById('held');

        var armrest1L = document.getElementById('armrest1L');
        armrest1L.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj1L($(this));
            else
                console.log('doet t niet 1L');
        });

        var lean1L = document.getElementById('lean1L');
        lean1L.addEventListener('click', function () {
            console.log('click registered...');
            if (held.getAttribute('class') === 'placed' && lean1L.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR1L($(this));
            else
                console.log('doet t niet 1L ' + held.getAttribute('class') + ' ' + lean1L.getAttribute('class'));
        });

        var armrest1R = document.getElementById('armrest1R');
        armrest1R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj1R($(this));
            else
                console.log('doet t');
        });

        var lean1R = document.getElementById('lean1R');
        lean1R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && lean1R.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR1R($(this));
            else
                console.log('doet t');
        });

        var armrest2L = document.getElementById('armrest2L');
        armrest2L.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj2L($(this));
            else
                console.log('doet t');
        });

        var lean2L = document.getElementById('lean2L');
        lean2L.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && lean2L.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR2L($(this));
            else
                console.log('doet t');
        });

        var armrest2R = document.getElementById('armrest2R');
        armrest2R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj2R($(this));
            else
                console.log('doet t');
        });

        var lean2R = document.getElementById('lean2R');
        lean2R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && lean2R.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR2R($(this));
            else
                console.log('doet t');
        });

        var armrest3L = document.getElementById('armrest3L');
        armrest3L.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj3L($(this));
            else
                console.log('doet t');
        });

        var lean3L = document.getElementById('lean3L');
        lean3L.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && lean3L.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR3L($(this));
            else
                console.log('doet t');
        });

        var armrest3R = document.getElementById('armrest3R');
        armrest3R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj3R($(this));
            else
                console.log('doet t');
        });

        var lean3R = document.getElementById('lean3R');
        lean3R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && lean3R.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR3R($(this));
            else
                console.log('doet t');
        });

        var armrest4L = document.getElementById('armrest4L');
        armrest4L.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj4L($(this));
            else
                console.log('doet t');
        });

        var lean4L = document.getElementById('lean4L');
        lean4L.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && lean4L.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR4L($(this));
            else
                console.log('doet t');
        });

        var armrest4R = document.getElementById('armrest4R');
        armrest4R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObj4R($(this));
            else
                console.log('doet t');
        });

        var lean4R = document.getElementById('lean4R');
        lean4R.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && lean4R.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjR4R($(this));
            else
                console.log('doet t');
        });

        var backrest1 = document.getElementById('backrest1');
        backrest1.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObjB1($(this));
            else
                console.log('doet t');
        });

        var back1 = document.getElementById('back1');
        back1.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && back1.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjRB1($(this));
            else
                console.log('doet t');
        });

        var backrest2 = document.getElementById('backrest2');
        backrest2.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed')
                pickup.functions.getObjB2($(this));
            else
                console.log('doet t');
        });

        var back2 = document.getElementById('back2');
        back2.addEventListener('click', function () {
            if (held.getAttribute('class') === 'placed' && back2.getAttribute('class') !== 'menu-compat')
                pickup.functions.getObjRB2($(this));
            else
                console.log('doet t');
        });
    },

    functions : {
        getObj1L : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'A1L');
            $('#held').attr('obj-model', 'obj: #Armrest1L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR1L : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R1L');
            $('#held').attr('obj-model', 'obj: #Armrest1L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObj1R : function(me){
            var speaker1R = document.getElementById('pickupSound1L');
            speaker1R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'A1R');
            $('#held').attr('obj-model', 'obj: #Armrest1R-obj');
            $('#held').attr('rotation', '0 0 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR1R : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R1R');
            $('#held').attr('obj-model', 'obj: #Armrest1R-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObj2L : function(me){
            var speaker2L = document.getElementById('pickupSound1L');
            speaker2L.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'A2L');
            $('#held').attr('obj-model', 'obj: #Armrest2L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR2L : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R2L');
            $('#held').attr('obj-model', 'obj: #Armrest2L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObj2R : function(me){
            var speaker2R = document.getElementById('pickupSound1L');
            speaker2R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'A2R');
            $('#held').attr('obj-model', 'obj: #Armrest2R-obj');
            $('#held').attr('rotation', '0 0 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR2R : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R2R');
            $('#held').attr('obj-model', 'obj: #Armrest2R-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObj3L : function(me){
            var speaker3L = document.getElementById('pickupSound3L');
            speaker3L.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'A3L');
            $('#held').attr('obj-model', 'obj: #Armrest3L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR3L : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R3L');
            $('#held').attr('obj-model', 'obj: #Armrest3L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObj3R : function(me){
            var speaker3R = document.getElementById('pickupSound3L');
            speaker3R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'A3R');
            $('#held').attr('obj-model', 'obj: #Armrest3R-obj');
            $('#held').attr('rotation', '0 0 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR3R : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R3R');
            $('#held').attr('obj-model', 'obj: #Armrest3R-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObj4L : function(me){
            var speaker4L = document.getElementById('pickupSound4L');
            speaker4L.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'A4L');
            $('#held').attr('obj-model', 'obj: #Armrest4L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR4L : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R4L');
            $('#held').attr('obj-model', 'obj: #Armrest4L-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObj4R : function(me){
            var speaker4R = document.getElementById('pickupSound4L');
            speaker4R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'A4R');
            $('#held').attr('obj-model', 'obj: #Armrest4R-obj');
            $('#held').attr('rotation', '0 0 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjR4R : function(me){
            var speaker1L = document.getElementById('pickupSound1L');
            speaker1L.components.sound.playSound();
            $('#held').attr('class', 'R4R');
            $('#held').attr('obj-model', 'obj: #Armrest4R-obj');
            $('#held').attr('rotation', '0 180 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjB1 : function(me){
            var speaker4R = document.getElementById('pickupSound4L');
            speaker4R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'B1');
            $('#held').attr('obj-model', 'obj: #BackRest1-obj');
            $('#held').attr('rotation', '0 -90 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjRB1 : function(me){
            var speaker4R = document.getElementById('pickupSound4L');
            speaker4R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'RB1');
            $('#held').attr('obj-model', 'obj: #BackRest1-obj');
            $('#held').attr('rotation', '0 -90 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjB2 : function(me){
            var speaker4R = document.getElementById('pickupSound4L');
            speaker4R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'B2');
            $('#held').attr('obj-model', 'obj: #BackRest2-obj');
            $('#held').attr('rotation', '0 -90 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        getObjRB2 : function(me){
            var speaker4R = document.getElementById('pickupSound4L');
            speaker4R.components.sound.playSound();
            document.getElementById('pickupSound').play();
            $('#held').attr('class', 'RB2');
            $('#held').attr('obj-model', 'obj: #BackRest2-obj');
            $('#held').attr('rotation', '0 -90 0');
            $('#couch').children().attr('class', 'clear');
            pickup.functions.hideMe($(me));
            menu.functions.clearMenu();
        },
        hideMe : function(me){
            if ($('#held').attr('class') !== null) {
                $(me).children().attr('visible', false)
            }
        }
    }
};

/**
 *
 * @type {{init: placedown.init, setListeners: placedown.setListeners, functions: {setObj1R: placedown.functions.setObj1R, setObj1L: placedown.functions.setObj1L, setObj2L: placedown.functions.setObj2L, setObj2R: placedown.functions.setObj2R}}}
 */
var placedown = {
    init: function(){
        placedown.setListeners()
    },
    setListeners: function(){
        var couch = document.getElementById('couch');
        var held = document.getElementById('held');
        var cross = document.getElementById('cross');
        var cross2 = document.getElementById('cross2');
        var cross3 = document.getElementById('cross3');
        var refresh = document.getElementById('refresh');
        var checkout = document.getElementById('checkout');


        couch.addEventListener('click', function () {
            if (held.getAttribute('class') === "A1R" && $('#couch').children().attr('class') !== 'rightFull' || held.getAttribute('class') === "R1R" && $('#couch').children().attr('class') !== 'rightFull') {
                placedown.functions.setObj1R();

                var speaker1R = document.getElementById('placeDownSound1R');
                speaker1R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A1L" && $('#couch').children().attr('class') !== 'leftFull' || held.getAttribute('class') === "R1L" && $('#couch').children().attr('class') !== 'leftFull') {
                placedown.functions.setObj1L();

                var speaker1L = document.getElementById('placeDownSound1L');
                speaker1L.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A2R" && $('#couch').children().attr('class') !== 'rightFull') {
                placedown.functions.setObj2R();

                var speaker2R = document.getElementById('placeDownSound2R');
                speaker2R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A2L" && $('#couch').children().attr('class') !== 'leftFull') {
                placedown.functions.setObj2L();

                var speaker2L = document.getElementById('placeDownSound2L');
                speaker2L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "A3R" && $('#couch').children().attr('class') !== 'rightFull') {
                placedown.functions.setObj3R();

                var speaker3R = document.getElementById('placeDownSound3R');
                speaker3R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A3L" && $('#couch').children().attr('class') !== 'leftFull') {
                placedown.functions.setObj3L();

                var speaker3L = document.getElementById('placeDownSound3L');
                speaker3L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "A4R" && $('#couch').children().attr('class') !== 'rightFull') {
                placedown.functions.setObj4R();

                var speaker4R = document.getElementById('placeDownSound2R');
                speaker4R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A4L" && $('#couch').children().attr('class') !== 'leftFull') {
                placedown.functions.setObj4L();

                var speaker4L = document.getElementById('placeDownSound2L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "B1" && $('#couch').children().attr('class') !== 'rightFull') {
                placedown.functions.setObjB1();

                var speaker4R = document.getElementById('placeDownSound2R');
                speaker4R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "B2" && $('#couch').children().attr('class') !== 'leftFull') {
                placedown.functions.setObjB2();

                var speaker4L = document.getElementById('placeDownSound2L');
                speaker4L.components.sound.playSound();
            }
        });


        cross.addEventListener('click', function () {
            if (held.getAttribute('class') === "A1L") {
                placedown.functions.setBackObj1L();

                var speaker1L = document.getElementById('placeDownSound1L');
                speaker1L.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A2L") {
                placedown.functions.setBackObj2L();

                var speaker2L = document.getElementById('placeDownSound2L');
                speaker2L.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A3L") {
                placedown.functions.setBackObj3L();

                var speaker3L = document.getElementById('placeDownSound3L');
                speaker3L.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A4L") {
                placedown.functions.setBackObj4L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }

            if (held.getAttribute('class') === "R1L") {
                placedown.functions.rmvObj1L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "R2L") {
                placedown.functions.rmvObj2L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "R3L") {
                placedown.functions.rmvObj3L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "R4L") {
                placedown.functions.rmvObj4L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }

        });

        cross2.addEventListener('click', function () {

            if (held.getAttribute('class') === "A1R") {
                placedown.functions.setBackObj1R();

                var speaker1R = document.getElementById('placeDownSound1R');
                speaker1R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A2R") {
                placedown.functions.setBackObj2R();

                var speaker2R = document.getElementById('placeDownSound2R');
                speaker2R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A3R") {
                placedown.functions.setBackObj3R();

                var speaker3R = document.getElementById('placeDownSound3R');
                speaker3R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "A4R") {
                placedown.functions.setBackObj4R();

                var speaker4R = document.getElementById('placeDownSound4R');
                speaker4R.components.sound.playSound();
            }
            if (held.getAttribute('class') === "R1R") {
                placedown.functions.rmvObj1L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "R2R") {
                placedown.functions.rmvObj2L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "R3R") {
                placedown.functions.rmvObj3L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "R4R") {
                placedown.functions.rmvObj4L();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
        });

        cross3.addEventListener('click', function () {
            if (held.getAttribute('class') === "B1") {
                placedown.functions.setBackObjB1();

                var speaker3R = document.getElementById('placeDownSound3R');
                speaker3R.components.sound.playSound();
            }

            if (held.getAttribute('class') === "B2") {
                placedown.functions.setBackObjB2();

                var speaker4R = document.getElementById('placeDownSound4R');
                speaker4R.components.sound.playSound();
            }
            if (held.getAttribute('class') === "RB1") {
                placedown.functions.rmvObjB1();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
            if (held.getAttribute('class') === "RB2") {
                placedown.functions.rmvObjB2();

                var speaker4L = document.getElementById('placeDownSound4L');
                speaker4L.components.sound.playSound();
            }
        });
        refresh.addEventListener('click', function () {
                placedown.functions.refreshObj();
                var speaker3R = document.getElementById('placeDownSound3R');
                speaker3R.components.sound.playSound();
        });
        checkout.addEventListener('click', function () {

            var speaker3R = document.getElementById('placeDownSound3R');
            speaker3R.components.sound.playSound();
            sessionStorage.setItem('bank', 'Custom Couch €1399,-');
            $('#info-text-parent').append('<a-entity id="info-text" bmfont-text="text:Zet je VR bril af;align:center;color:#202020" position="-2.48 1.25 0.13"></a-entity>');

            setTimeout(function () {
                location.href = '/end.html';
            }, 5000);
        });
    },


    functions : {
        refreshObj : function(){
            $('#lean1R').children().attr('position', '-10 -10 -10');
            $('#lean2R').children().attr('position', '-10 -10 -10');
            $('#lean3R').children().attr('position', '-10 -10 -10');
            $('#lean4R').children().attr('position', '-10 -10 -10');
            $('#lean1L').children().attr('position', '-10 -10 -10');
            $('#lean2L').children().attr('position', '-10 -10 -10');
            $('#lean3L').children().attr('position', '-10 -10 -10');
            $('#lean4L').children().attr('position', '-10 -10 -10');
            $('#back1').children().attr('position', '-10 -10 -10');
            $('#back2').children().attr('position', '-10 -10 -10');
        },
        setObj1R : function(){
            $('#lean1R').children().attr('position', '0.01 0.4 -0.5');
            $('#lean1R').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'rightFull');
            $('#lean1R').attr('class', 'placed');
            $('#lean1R').attr('class', 'menu-compat');
            $('#lean2R').children().attr('position', '-10 -10 -10');
            $('#lean3R').children().attr('position', '-10 -10 -10');
            $('#lean4R').children().attr('position', '-10 -10 -10');
            $('#armrest1R').children().attr('position', '3 2 0');
            $('#armrest1R').children().attr('visible', 'true');
        },
        setObj1L : function(){
            $('#lean1L').children().attr('position', '-0.01 0.4 -0.5');
            $('#lean1L').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#lean2L').children().attr('position', '-10 -10 -10');
            $('#lean3L').children().attr('position', '-10 -10 -10');
            $('#lean4L').children().attr('position', '-10 -10 -10');
            $('#couch').children().attr('class', 'leftFull');
            $('#lean1L').attr('class', 'placed');
            $('#lean1L').attr('class', 'menu-compat');
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
        },
        setObj2L : function(){
            $('#lean2L').children().attr('position', '-0.01 0.4 -0.5');
            $('#lean2L').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'leftFull');
            $('#lean2L').attr('class', 'placed');
            $('#lean2L').attr('class', 'menu-compat');
            $('#lean1L').children().attr('position', '-10 -10 -10');
            $('#lean3L').children().attr('position', '-10 -10 -10');
            $('#lean4L').children().attr('position', '-10 -10 -10');
            $('#armrest2L').children().attr('position', '-3.5 2 1');
            $('#armrest2L').children().attr('visible', 'true');
        },
        setObj2R : function(){
            $('#lean2R').children().attr('position', '0.01 0.4 -0.5');
            $('#lean2R').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'rightFull');
            $('#lean2R').attr('class', 'placed');
            $('#lean2R').attr('class', 'menu-compat');
            $('#lean1R').children().attr('position', '-10 -10 -10');
            $('#lean3R').children().attr('position', '-10 -10 -10');
            $('#lean4R').children().attr('position', '-10 -10 -10');
            $('#armrest2R').children().attr('position', '3.5 2 1');
            $('#armrest2R').children().attr('visible', 'true');
        },
        setObj3L : function(){
            $('#lean3L').children().attr('position', '-0.01 0.4 -0.5');
            $('#lean3L').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'leftFull');
            $('#lean3L').attr('class', 'placed');
            $('#lean3L').attr('class', 'menu-compat');
            $('#lean1L').children().attr('position', '-10 -10 -10');
            $('#lean2L').children().attr('position', '-10 -10 -10');
            $('#lean4L').children().attr('position', '-10 -10 -10');
            $('#armrest3L').children().attr('position', '-3 1 0');
            $('#armrest3L').children().attr('visible', 'true');
        },
        setObj3R : function(){
            $('#lean3R').children().attr('position', '0.01 0.4 -0.5');
            $('#lean3R').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'rightFull');
            $('#lean3R').attr('class', 'placed');
            $('#lean3R').attr('class', 'menu-compat');
            $('#lean1R').children().attr('position', '-10 -10 -10');
            $('#lean2R').children().attr('position', '-10 -10 -10');
            $('#lean4R').children().attr('position', '-10 -10 -10');
            $('#armrest3R').children().attr('position', '3 1 0');
            $('#armrest3R').children().attr('visible', 'true');
        },
        setObj4L : function(){
            $('#lean4L').children().attr('position', '-0.01 0.4 -0.5');
            $('#lean4L').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'leftFull');
            $('#lean4L').attr('class', 'placed');
            $('#lean4L').attr('class', 'menu-compat');
            $('#lean1L').children().attr('position', '-10 -10 -10');
            $('#lean2L').children().attr('position', '-10 -10 -10');
            $('#lean3L').children().attr('position', '-10 -10 -10');
            $('#armrest4L').children().attr('position', '-3.5 1 1');
            $('#armrest4L').children().attr('visible', 'true');
        },
        setObj4R : function(){
            $('#lean4R').children().attr('position', '0.01 0.4 -0.5');
            $('#lean4R').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'rightFull');
            $('#lean4R').attr('class', 'placed');
            $('#lean4R').attr('class', 'menu-compat');
            $('#lean1R').children().attr('position', '-10 -10 -10');
            $('#lean2R').children().attr('position', '-10 -10 -10');
            $('#lean3R').children().attr('position', '-10 -10 -10');
            $('#armrest4R').children().attr('position', '3.5 1 1');
            $('#armrest4R').children().attr('visible', 'true');
        },

        setObjB1 : function(){
            $('#back1').children().attr('position', '-0.005 0.35 -0.5');
            $('#back1').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'leftFull');
            $('#back1').attr('class', 'placed');
            $('#back1').attr('class', 'menu-compat');
            $('#back2').children().attr('position', '-10 -10 -10');
            $('#backrest1').children().attr('position', '-0.5 2 -2');
            $('#backrest1').children().attr('visible', 'true');
        },
        setObjB2 : function(){
            $('#back2').children().attr('position', '0.005 0.35 -0.5');
            $('#back2').children().attr('visible', true);
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
            $('#couch').children().attr('class', 'leftFull');
            $('#back2').attr('class', 'placed');
            $('#back2').attr('class', 'menu-compat');
            $('#back1').children().attr('position', '-10 -10 -10');
            $('#backrest2').children().attr('position', '0.5 2 -2');
            $('#backrest2').children().attr('visible', 'true');
        },

        setBackObj1L : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj1L : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObj1R : function(){
            $('#armrest1R').children().attr('position', '3 2 0');
            $('#armrest1R').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj1R : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObj2L : function(){
            $('#armrest2L').children().attr('position', '-3.5 2 1');
            $('#armrest2L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj2L : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObj2R : function(){
            $('#armrest2R').children().attr('position', '3.5 2 1');
            $('#armrest2R').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj2R : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObj3L : function(){
            $('#armrest3L').children().attr('position', '-3 1 0');
            $('#armrest3L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj3L : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObj3R : function(){
            $('#armrest3R').children().attr('position', '3 1 0');
            $('#armrest3R').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj3R : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObj4L : function(){
            $('#armrest4L').children().attr('position', '-3.5 1 1');
            $('#armrest4L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj4L : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObj4R : function(){
            $('#armrest4R').children().attr('position', '3.5 1 1');
            $('#armrest4R').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObj4R : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObjB1 : function(){
            $('#backrest1').children().attr('position', '-0.5 2 -2');
            $('#backrest1').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObjB1 : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        setBackObjB2 : function(){
            $('#backrest2').children().attr('position', '0.5 2 -2');
            $('#backrest2').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
        rmvObjB2 : function(){
            $('#armrest1L').children().attr('position', '-3 2 0');
            $('#armrest1L').children().attr('visible', 'true');
            $('#held').removeAttr('obj-model');
            $('#held').attr('class', 'placed');
        },
    }
};

/**
 *
 * @type {{init: select.init, setListeners: select.setListeners, functions: {selectVisible: select.functions.selectVisible, bankVisible: select.functions.bankVisible, tableVisible: select.functions.tableVisible}}}
 */
var select = {
    init: function () {
        select.setListeners()
    },

    setListeners: function () {
        var selectVisible = document.getElementById('selectVisible');
        selectVisible.addEventListener('click', function () {
            select.functions.selectVisible($(this));
        });
        var bankVisible = document.getElementById('bankVisible');
        bankVisible.addEventListener('click', function () {
            select.functions.bankVisible($(this));
        });
        var tableVisible = document.getElementById('tableVisible');
        tableVisible.addEventListener('click', function () {
            select.functions.tableVisible($(this));
        });
    },

    functions: {
        selectVisible: function (me) {
            if (Visible.getAttribute('visible') === true)
                $('#Visible').attr('visible', 'false');
            else
                $('#Visible').attr('visible', 'true');
        },
        bankVisible: function (me) {
            $('#Table').attr('visible', 'false');
            $('#Bank').attr('visible', 'true');
            $('#Visible').attr('visible', 'false');
        },
        tableVisible: function (me) {
            $('#Bank').attr('visible', 'false');
            $('#Table').attr('visible', 'true');
            $('#Visible').attr('visible', 'false');
        }
    }
};


/**
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
     * Call functions on page load
     */


    setupApi.init();
    pickup.init();
    placedown.init();
});

