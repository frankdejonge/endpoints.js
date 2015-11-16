var Endpoints = require('..');
var expect = require('expect.js');
var sut;

describe('@frankdejonge/endpoints', function () {
    beforeEach(function () {
       sut = new Endpoints('/');
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
                expect(sut.path('name', {param: 'replaced'})).to.equal('/segment/replaced');
            });

            it('should know which method the endpoint has', function () {
                expect(sut.method('name')).to.equal(httpMethod);
            });

            it('should expose the endpoint\'s pattern', function () {
                expect(sut.pattern('name')).to.equal('/segment/:param');
            });

            it('should give details about an endpoint', function () {
                expect(sut.details('name', {param: 'replaced'})).to.eql({
                    method: httpMethod,
                    pattern: '/segment/:param',
                    name: 'name'
                });
            });

            it('should give resolve information about an endpoint', function () {
                expect(sut.resolve('name', {param: 'replaced'})).to.eql({
                    method: httpMethod,
                    pattern: '/segment/:param',
                    name: 'name',
                    path: '/segment/replaced'
                });
            });
        });
    });

    describe ('when there are nested routes defined', function () {
        beforeEach(function () {
            sut.nest('nested', function () {
                sut.get('endpoint', 'via.nest');
            });

            sut.get('get', 'get.index', function () {
                sut.get('nested', 'via.callback');
            });
        });

        it ('should resolve nested endpoint paths', function () {
            expect(sut.path('via.nest')).to.equal('/nested/endpoint');
            expect(sut.path('via.callback')).to.equal('/get/nested');
        });
    });

    it ('should error when resolving an unknown endpoint path', function () {
        expect(function () {
            sut.path('unknown.endpoint');
        }).to.throwError();
    });

    describe('when an endpoint with parameters is registered', function () {
        beforeEach(function () {
            sut.get('/:param', 'param.endpoint');
        });

        it ('should error when path parameters are not supplied', function () {
            expect(function () {
                sut.path('param.endpoint');
            }).to.throwError();
        });
    });

    describe('when there is an error during nested endpoint registration', function () {
        it ('should let the error bubble up', function () {
            expect(function () {
                sut.nest('prefix', function () {
                    throw new Error();
                });
            }).to.throwError();
        });
    });
});