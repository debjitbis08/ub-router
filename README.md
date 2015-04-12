ub-router
=========

A front-end router with path segment validation.

Examples
--------

###Basic Usage

```javascript
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
    .add("page/three", StaticR)
    .add("page/#Number", CountR)
    .listen();

/**
 * "page/1" is valid
 * "page/two" is invalid
 * "page/three" is valid
 */
```

###Adding a custom path piece data type

To create a new PathPiece data type use the pathPiece
function. It will also be available in the Routes.types
namespace for future use.

```javascript
Routes.registerPathPiece("Natural", function (piece) {
    var n = Routes.types.Integer.fromPathPiece(piece);
    if (n === null || n < 0) { return null; } else { return n; }
}, function (n) {
    return String(n);
});

Routes
    .add("page/#Natural", CountR)
    .listen();
```
