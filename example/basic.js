(function () {

    "use strict";

    var StaticR = function () {
        var handle = function () {
            var el = document.getElementById("content");
            el.innerHTML = "Static 3";
        };
        
        return { handle: handle };
    };

    var CountR = function (n) {
        var map = [ "One", "Two" ];
        var handle = function () {
            var el = document.getElementById("content");
            el.innerHTML = map[n - 1];
        };
        
        return { handle: handle };
    };

    Routes
    //.config({mode: "history"})
    .add("page/three", StaticR)
    .add("page/#Number", CountR)
    .listen();
})();
