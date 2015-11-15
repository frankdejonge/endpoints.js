```js
require('es6-promise').polyfill();
require('isomorphic-fetch');
var Endpoint = require('@frankdejonge/endpoint');
var endpoint = new Endpoint('http://api.something.org/v1');

endpoint.post('posts', 'post.create');
var createPost = endpoint.resolve('post.create');


fetch(createPost.path, {
    method: createPost.method
})
    .then((resp) => console.log(resp));
```