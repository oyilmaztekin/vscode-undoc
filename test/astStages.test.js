const assert = require('assert')
const expect = require('expect.js')
var sinon = require('sinon')
const AstStages = require('../lib/astStages').AstStages
const stages = new AstStages()
const fs = require('fs')


suite("AST Stages", function() {
  let fnParser = sinon.spy(AstStages.prototype, 'parseToAst')
  let fnGenerate = sinon.spy(AstStages.prototype, 'generateCode')
  const reactFilePath = './test/mockData/reactCodeMock.js'
  const parsedFile = fnParser(reactFilePath)
  const returnedAST = require('./mockData/reactCodeASTMock').reactFileAST
  const returnedCode = fs.readFileSync(reactFilePath,'utf-8');

    suite("Parser", () => {
        /**
        * stages.parseToAst(file)
        * 1- test file parameter
        * 2- test parsedFile variable it should be equal to given ast
        * 3- returned value equal to parsedFile AST
        */
        suite("given parameter to the parser is testing", () => {

          test("it should be defined", function() {
            expect(fnParser).to.be.a('function');

          });
          test("it should throw error if parameter is not string or Buffer", () => {
            expect(fnParser).withArgs(3).to.throwException();
          })

          test("it should throw error if no such a file", () => {
            expect(fnParser).withArgs('asdas').to.throwException();
          })

          test("it should be a valid file path", () => {
            expect(fnParser).withArgs(reactFilePath).to.not.throwException();
          })

          test("it should be a JavaScript file", () => {
            expect(reactFilePath).to.contain('.js');
          })

          test("returned value should be an Object", () => {
            expect(fnParser).withArgs(reactFilePath).to.not.throwException();
          })
        })

        suite("returned AST Object is testing", () => {

          test("it should be an object", () => {
            expect(fnParser(reactFilePath)).to.be.an('object');
          })

          test("it should not be an empy object", () => {
            expect(fnParser(reactFilePath)).to.not.be.empty();
          })

          test("it should be have property named PROGRAM", () => {
            expect(fnParser(reactFilePath)).to.have.property('program');
          })

          test("it shouldn't be an empty AST", () => {
            expect(fnParser(reactFilePath)).to.not.be.empty()
          })

          test("it should be a valid AST", () => {
             assert.deepEqual(fnParser(reactFilePath), returnedAST)
          })

        })
    })

    // FIXME: after code transform... leadcomment does not exist
    suite("Code Generation", () => {
      suite("given parameter to the generator is testing", () => {
        test("it should be defined", function() {
          expect(fnGenerate).to.be.a('function');

        });
        test("it should throw error if parameter is not an Object", () => {
          expect(fnGenerate).withArgs(3).to.throwException();
          expect(fnGenerate).withArgs('3').to.throwException();
          expect(fnGenerate).withArgs([]).to.throwException();
        })

        test("it should be a valid AST Object", () => {
          expect(fnGenerate).withArgs(parsedFile).to.not.throwException();
        })

        // test("it should be a valid code", () => {
        //   expect(fnGenerate(parsedFile).code).to.be(returnedCode)
        // })


      })
    })


});
