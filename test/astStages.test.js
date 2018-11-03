const assert = require('assert')
const expect = require('expect.js')
var sinon = require('sinon')
const AstStages = require('../lib/astStages').AstStages
const stages = new AstStages()
const fs = require('fs')


suite("AST Stages", function() {
    suite("Parser", () => {
        /**
        * stages.parseToAst(file)
        * 1- test file parameter
        * 2- test parsedFile variable it should be equal to given ast
        * 3- returned value equal to parsedFile AST
        */
        let fn = sinon.spy(AstStages.prototype, 'parseToAst')
        const reactFilePath = './test/mockData/reactCodeMock.js'
        const returnedAST = require('./mockData/reactCodeASTMock').reactFileAST

        suite("given parameter to the parser is testing", () => {

          test("it should be defined", function() {
            expect(fn).to.be.a('function');

          });
          test("it should throw error if parameter is not string or Buffer", () => {
            expect(fn).withArgs(3).to.throwException();
          })

          test("it should throw error if no such a file", () => {
            expect(fn).withArgs('asdas').to.throwException();
          })

          test("it should be a valid file path", () => {
            expect(fn).withArgs(reactFilePath).to.not.throwException();
          })

          test("it should be a JavaScript file", () => {
            expect(reactFilePath).to.contain('.js');
          })

          test("returned value should be an Object", () => {
            expect(fn).withArgs(reactFilePath).to.not.throwException();
          })
        })

        suite("returned AST Object is testing", () => {

          test("it should be an object", () => {
            expect(fn(reactFilePath)).to.be.an('object');
          })

          test("it should not be an empy object", () => {
            expect(fn(reactFilePath)).to.not.be.empty();
          })

          test("it should be have property named PROGRAM", () => {
            expect(fn(reactFilePath)).to.have.property('program');
          })

          test("it shouldn't be an empty AST", () => {
            expect(fn(reactFilePath)).to.not.be.empty()
          })

          test("it should be a valid AST", () => {
             assert.deepEqual(fn(reactFilePath), returnedAST)
          })

        })
    })

});
