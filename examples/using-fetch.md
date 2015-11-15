```js
require('es6-promise').polyfill();
require('isomorphic-fetch');
var Endpoint = require('@frankdejonge/endpoint');
var endpoint = new Endpoint('http://api.something.org/v1');

endpoint.post('posts', 'post.create');

fetch(endpoint.resolve('post.create), {
    method: endpoint.method('post.create')
})
    .then((resp) => console.log(resp));