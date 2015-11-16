# @frankdejonge/endpoints - UNPUBLISHED

## Scenario

This package allows you to register and resolve endpoints. Endpoints can be internal,
for example to allow named routing in react-router, or create a lookup table for any API
endpoints your application may consume. It's merely a lookup table tailored towards endpoints.

## Install

```js
npm i --save @frankdejonge/endpoints
```

## Usage

```js
var Endpoint = require('@frankdejonge/endpoints');
var endpoint = new Endpoints('http://api.example.org');

// Simple declaration
endpoints.get('/articles', 'articles.index');
console.log(endpoints.path('article.index')); // http://api.example.org/articles

// Nested
endpoints.get('/writers', 'writer.index', function () {
    endpoints.post('/', 'writer.create');
    sendpoint.get('/:writerId', 'writer.details', function () {
        endpoints.get('/publications', 'writer.publications');
    });
    endpoints.delete('/:writerId', 'writer.delete');
});

console.log(endpoints.path('writers.publications', {writerId: 2}));
// http://api.example.org/writers/2/publications
```

Nesting can also be done through the `endpoints.nest` method which doesn't register an
endpoint for the group.

```js
endpoints.nest('prefix', function () {
    // Register endpoints here.
});
```

