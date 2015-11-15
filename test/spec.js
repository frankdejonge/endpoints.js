var endpoint = require('..');
var expect = require('expect.js');
var sut;

describe('@frankdejonge/endpoint', function () {
    beforeEach(function () {
       sut = new endpoint('/');
    });

    var cases = [
        ['get', 'GET'],
        ['post', 'POST'],
        ['put', 'PUT'],
        ['delete', 'DELETE'],
        ['patch', 'PATCH'],
        ['options', 'OPTIONS'],
        ['head', 'HEAD']
    ];

    cases.forEach(function (testCase) {
        var method = testCase[0], httpMethod = testCase[1];
        describe('when a '+httpMethod+' route is registered', function () {
            beforeEach(function () {
                sut[method].apply(sut, ['/segment/:param', 'name']);
            });

            it('should resolve a url', function () {
                expect(sut.resolve('name', {param: 'replaced'})).to.equal('/segment/replaced');
            });

            it('should know which method the endpoint has', function () {
                expect(sut.method('name')).to.equal(httpMethod);
            });

            it('should expose the endpoint\'s pattern', function () {
                expect(sut.pattern('name')).to.equal('/segment/:param');
            });
        });
    });

    describe ('when there are nested routes defined', function () {
        beforeEach(function () {
            sut.nest('nested', function (endpoints) {
                endpoints.get('endpoint', 'via.nest');
            });

            sut.get('get', 'get.index', function (endpoints) {
                endpoints.get('nested', 'via.callback');
            });
        });

        it ('should resolve nested endpoints', function () {
            expect(sut.resolve('via.nest')).to.equal('/nested/endpoint');
            expect(sut.resolve('via.callback')).to.equal('/get/nested');
        });
    });

    it ('should error when resolving an unknown endpoint', function () {
        expect(function () {
            sut.resolve('unknown.endpoint');
        }).to.throwError();
    });

    describe('when an endpoint with parameters is registered', function () {
        beforeEach(function () {
            sut.get('/:param', 'param.endpoint');
        });

        it ('should error when parameters are not supplied for resolving', function () {
            expect(function () {
                sut.resolve('param.endpoint');
            }).to.throwError();
        });
    });
});