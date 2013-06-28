;(function() {

var Eg = {}

// Dsl
Eg.Dsl = {}

Eg.Dsl.Node = function(type,data,children) {
  if(data) assert(typeof data === "object","Expects data to be an object")
  if(children) assert(typeof children.forEach === "function","Expects children to an array")
  return extend(data || {},{type: type,children: children || []})
}

// test tree
Eg.TestTree = {}
Eg.TestTree.fromExamples = function(examples,root) {
  var topLevel = !root
  var root = root || {name: "root",tests: [], describes: [],type: "describe"}
  var describeContext = root
  examples.forEach(function(node) {
    switch(node.type) {
    case "describe":
      var testNode = {name: node.name, type: "describe",tests: [],describes: []}
      root.describes.push(testNode)
      if(topLevel) describeContext = testNode
      return Eg.TestTree.fromExamples(node.children,testNode) 
    case "it":
      var testNode = pick(node,"type","content","name")
      return describeContext.tests.push(testNode)
    default:
      var testNode = pick(node,"type","content")
      return describeContext[node.type] = testNode
    }
  })
  return root
}

Eg.Mocha = {}
Eg.Mocha.Bdd = function(tree) {
  this.tree = tree
  this.indentLevel = 0;
}
Eg.Mocha.Bdd.prototype = {
  javascript: function() {
    return this.describe(this.tree)
  },
  describe: function(node) {
    var _this = this
    var output = []
    output.push( this.i('describe("' + node.name + '",function() {\n') )
    this.outdent()
    output.push([
      node.scoped ? this.scoped(node.scoped) : '',
      node.before ? this.before(node.before) : '',
      node.after ? this.after(node.after) : '',
      node.tests.reduce(function(str,it) {
        return str + _this.it(it)
      },''),
      node.describes.reduce(function(str,it) {
        return str + _this.describe(it)
      },'')
    ].join(""))
    this.indent()
    output.push( this.i('})\n') )
    return output.join("")
  },
  i: function(str,n) {
    return repeatString("  ",this.indentLevel + (n || 0)) + str
  },
  indent: function() { this.indentLevel -= 1 },
  outdent: function() { this.indentLevel += 1 },
  it: function(node) {
    return this.i('it("' + node.name + '",function() {\n')
      + this.i(node.content + '\n',1) + this.i('})\n')
  },
  before: function(node) {
    return this.i('before(function() {\n') + this.i(node.content + '\n',1) + 
      this.i('})\n')
  },
  after: function(node) {
    return this.i('after(function() {\n') + this.i(node.content + '\n',1) + 
      this.i('})\n')
  },
  scoped: function(node) {
    return this.i(node.content + '\n')
  },
  byType: function(node) {
    var handler = this[node.type]
    if(handler) return this[node.type](node)
    throw new Error("Have no handler for " + node.type + " nodes")
  }
}

function inherit() {
  return {}
}

function qsa(q,el) {
  el = el || document;
  return [].slice.call(el.querySelectorAll(q))
}

function xpath(xpath,el) {
  var nodes = document.evaluate(xpath, el || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
 
  var results = new Array(nodes.snapshotLength); // faster for chrome to know how long this'll be
  for(var i = 0, length = nodes.snapshotLength; i < length; i++) {
    results[i] = nodes.snapshotItem(i);
  }
 
  return results;
}

function extend(o) {
  return [].slice.call(arguments,1).reverse().reduce(function(extended,obj) {
    for(var k in obj) extended[k] = obj[k]
    return extended
  },o)
}
function copy(o) {
  return extend({},o)
}
function assert(t,msg) {
  if(!t) throw new Error(msg)
}
function omit(o) {
  var keys = [].slice.call(arguments,1).reduce(function(o,k) { o[k] = 1; return o },{})
  var omitted = {}
  for(var k in o) {
    if(keys[k]) continue
    omitted[k] = o[k]
  }
  return omitted
}
function pick(o) {
  var keys = [].slice.call(arguments,1).reduce(function(o,k) { o[k] = 1; return o },{})
  var picked = {}
  for(var k in o) {
    if(!keys[k]) continue
    picked[k] = o[k]
  }
  return picked
}
function walk(obj,fn) {
  for(var k in obj) fn(k,obj[k])
}
function repeatString(str,n) {
  var output = new Array(n)
  while(n--) output[n] = str
  return output.join("")
}

this.Eg = Eg
if(typeof module !== "undefined") module.exports = Eg

})(this)
