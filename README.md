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
var Endpoints = require('@frankdejonge/endpoints');
var endpoints = new Endpoints('http://api.example.org');

// Simple declaration
endpoints.get('/articles', 'articles.index');
console.log(endpoints.path('article.index')); // http://api.example.org/articles

// Available method by http verb
endpoints.get(pattern, name);
endpoints.post(pattern, name);
endpoints.put(pattern, name);
endpoints.patch(pattern, name);
endpoints.delete(pattern, name);
endpoints.options(pattern, name);
endpoints.head(pattern, name);

// Nested declaration via a callback.
endpoints.get('/writers', 'writer.index', function () {
    endpoints.post('/', 'writer.create');
    endpoint.get('/:writerId', 'writer.details', function () {
        endpoints.get('/publications', 'writer.publications');
    });
    endpoints.delete('/:writerId', 'writer.delete');
});

// Resolving endpoint paths with parameters
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

## Endpoint blueprints.

```js
endpoints.get('/article/:id', 'article.details');
var blueprint = endpoints.blueprint('article.details');
var httpMethod = blueprint.method;
var pattern = blueprint.pattern;
```

## Resolving endpoints.

Apart from blueprints you can `resolve` an endpoint to get the blueprint with
the generated path.

```js
endpoints.get('/article/:id', 'article.details');
var articleEndpoint = endpoints.resolve('article.details');
var httpMethod = articleEndpoint.method;
var pattern = articleEndpoint.pattern;
var path = articleEndpoint.path;
```