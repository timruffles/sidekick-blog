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
  var root = root || {}
  var describeContext = root
  examples.forEach(function(node) {
    switch(node.type) {
    case "describe":
      var nodeRoot
      root[node.name] = nodeRoot = {}
      if(topLevel) describeContext = nodeRoot
      return Eg.TestTree.fromExamples(node.children,nodeRoot) 
    case "it":
      return describeContext[node.name] = node
    default:
      return describeContext[node.type] = node
    }
  })
  return root
}

Eg.Mocha = {}
Eg.Mocha.Bdd = function(tree) {
  this.tree = tree
}
Eg.Mocha.Bdd.prototype = {
  javascript: function() {
    var _this = this
    var output = ""
    walk(this.tree,function(key,node) {
      output += _this.byType(node)
    })
    return output
  },
  describe: function(node) {
    var _this = this
    'describe("' + node.name + '",function() {\n' +
      node.scoped ? '' : this.scoped(node) +
      node.before ? '' : this.before(node) +
      node.after ? '' : this.after(node) +
      omit(node,"scoped","before","after").reduce(function(str,it) {
        return str + _this.byType(it)
      },'')
    '})\n'
  },
  it: function(node) {
    return 'it("' + node.name + '",function() {\n' + node.content + '\n})\n'
  },
  before: function(node) {
    return 'before("' + node.name + '",function() {\n' + node.content + '\n})\n'
  },
  after: function(node) {
    return 'after("' + node.name + '",function() {\n' + node.content + '\n})\n'
  },
  scoped: function(node) {
    return node.content + '\n'
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
function walk(obj,fn) {
  for(var k in obj) fn(k,obj[k])
}

this.Eg = Eg
if(typeof module !== "undefined") module.exports = Eg

})(this)
