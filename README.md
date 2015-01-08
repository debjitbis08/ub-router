ub-router
=========

A front-end router with path segment validation.

Examples
--------

###Basic Usage

```javascript
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
Routes.pathPiece("Natural", function (piece) {
    var n = Routes.fromPathPiece(Routes.types.Integer)(piece);
    if (n === null || n < 0) { return null; } else { return n; }
}, function (n) {
    return String(n);
});
```
