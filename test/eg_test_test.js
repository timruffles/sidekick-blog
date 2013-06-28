Eg = require("../content/js/eg_test")

describe("Eg.Parser",function() {
  
  var testing = 
    '<div data-describe="scopeOne">' +
    '  <div data-scoped>' +
    '    function shouldBeVisibleInScopeOneCode(weight) {' +
    '    }' +
    '  </div>' +
    '  <div data-before>' +
    '    shouldBeVisibleInScopeOneCode()' +
    '  </div>' +
    '  <div data-after>' +
    '    shouldBeVisibleInScopeOneCode()' +
    '  </div>' +
    '  <div data-it="isTheFirstTestInScopeOne">' +
    '    if(!(typeof shouldBeVisibleInScopeOneCode === "function")) {' +
    '      throw new Error("Can not see variables in describe scope when nesting")' +
    '    }' +
    '  </div>' +
    '  <div data-describe="scopeThree">' +
    '    <div data-it="firstTestInScopeThree"' +
    '      if(!(typeof shouldBeVisibleInScopeOneCode === "function")) {' +
    '        throw new Error("Can not see variables in parent scope when nesting")' +
    '      }' +
    '    </div>' +
    '  </div>' +
    '</div>' +
    '<div data-it="implicitlyInScopeOne">' +
    '  if(!(typeof shouldBeVisibleInScopeOneCode === "function")) {' +
    '    throw new Error("Can not see variables in describe scope when nesting")' +
    '  }' +
    '</div>' +
    '<div data-describe="scopeTwo">' +
    '</div>'
    '<div data-it="implicitlyInScopeTwo">' +
    '  if(typeof shouldBeVisibleInScopeOneCode === "function") {' +
    '    throw new Error("Can see variables another describe scope")' +
    '  }' +
    '</div>'


  
  var parsed;
  before(function() {
    //parsed = new Eg.Dom($(testing)[0]).tests
  })


})

function node(name,data,children) {
  data = data || {}
  data.content = "var a = 1 + 1;"
  return new Eg.Dsl.Node(name,data,children)
}
var tree = [
  node("describe",{name: "scopeOne"},[
    node("scoped"),
    node("before"),
    node("after"),
    node("it",{name: "it1"}),
    node("describe",{name: "scopeThree"},[
      node("it",{name: "it2"})
    ]),
    node("it",{name: "it5"}) // this shouldn't be given to scopeThree
  ]),
  node("it",{name: "it3"}),
  node("describe",{name: "scopeTwo"}),
  node("it",{name: "it4"})
]

describe("Eg.Tree",function() {

  var testTree 

  function forLookup(tree) {
    tree.describes.forEach(function(d) {
      tree[d.name] = d
      forLookup(d)
    })
  }
  function testNames(scope) {
    return scope.tests.map(function(n) { return n.name })
  }

  before(function() {
    testTree = Eg.TestTree.fromExamples(tree)
    forLookup(testTree)
  })

  it("has top level describes at top level",function() {
    assert.defined( testTree.scopeOne )
    assert.defined( testTree.scopeTwo )
    refute.defined( testTree.scopeThree )
  })

  it("supports nested describes",function() {
    assert.defined( testTree.scopeOne.scopeThree )
  })

  it("can define befores",function() {
    assert.defined( testTree.scopeOne.before )
  })

  it("can define code to be run in describe scope",function() {
    assert.defined( testTree.scopeOne.scoped )
  })

  it("can group its at top level implicitly",function() {
    assert.contains( testNames(testTree.scopeOne), "it3" )
    refute.contains( testNames(testTree.scopeOne), "it4" )
    assert.contains( testNames(testTree.scopeTwo), "it4" )
    refute.contains( testNames(testTree.scopeTwo), "it3" )
  })

})

describe("Eg.Mocha.Bdd",function() {

  var code
  before(function() {
    var testTree = Eg.TestTree.fromExamples(tree)
    code = new Eg.Mocha.Bdd(testTree).javascript()
  })

  it("can generate code",function() {
    assert.match(code,'describe')
  })

})
