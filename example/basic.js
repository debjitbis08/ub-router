'use strict';

import { Routes } from '../src/index';

var StaticR = function () {
    return function handle() {
        var el = document.getElementById("content");
        el.innerHTML = "Static 3";
    };
};

var CountR = function (n) {
    var map = [ "One", "Two" ];
    return function handle() {
        var el = document.getElementById("content");
        el.innerHTML = map[n - 1];
    };
};

Routes
    //.config({mode: "history"})
    .add("page/three", StaticR)
    .add("page/#Number", CountR)
    .listen();
