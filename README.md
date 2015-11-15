# @frankdejonge/endpoint - UNPUBLISHED

## Install

```js
npm i --save @frankdejonge/endpoint
```

## Usage

```js
var Endpoint = require('@frankdejonge/endpoint');
var endpoint = new Endpoint('http://api.example.org');

// Simple declaration
endpoint.get('/articles', 'articles.index');
console.log(endpoint.resolve('article.index')); // http://api.example.org/articles

// Nested
endpoint.get('/writers', 'writer.index', function () {
    endpoint.post('/', 'writer.create');
    endpoint.get('/:writerId', 'writer.details', function () {
        endpoint.get('/publications', 'writer.publications');
    });
    endpoint.delete('/:writerId', 'writer.delete');
});

console.log(endpoint.resolve('writers.publications', {writerId: 2}));
// http://api.example.org/writers/2/publications
```

Nesting can also be done through the `endpoint.nest` method which doesn't register an
endpoint for the group.

```js
endpoint.nest('prefix', function () {
    // Register endpoints here.
});
```