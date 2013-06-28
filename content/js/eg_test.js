;(function() {

var Eg = {}


// Dom
Eg.Dom = function(el) {
  this.el = el
  this.children = []
}
Eg.Dom.domToDsl = function(el) {
  return new Eg.Dom(el).toDsl()
}

function fromAttribute(attribute,fn) {
  return function(el) {
    var val = el.getAttribute(attribute)
    if(val) return fn.call(this,el,val)
  }
}
function hasAttribute(attribute,fn) {
  return function(el) {
    if(el.hasAttribute(attribute)) return fn.call(this,el)
  }
}
function codeNode(type,attribute) {
  return hasAttribute(attribute,function(el) {
    assert(el.children.length === 0,type + " nodes should have no child elements - just code")
    return {type: type,content: this.getCode(el)}
  })
}

Eg.Dom.prototype = {
  toDsl: function() {
    var _this = this
    var children = [];
    [].forEach.call(this.el.children,function(el) {
      var wasDslNode = ["describe","it","scoped","after","before"].some(function(matcher) {
        var node = _this[matcher](el)
        if(node) children.push(node)
        return node
      })
      if(!wasDslNode) children = children.concat( new Eg.Dom(el).toDsl().children )
    })
    return {type: "describe",name: "*root*", children: children}
  },
  getCode: function(el) {
    return el.innerHTML.trim()
  },
  cleanAttribute: function(attr) {
    return attr.trim()
  },
  describe: fromAttribute("data-describe",function(el,describe) {
    return {type:"describe",children: new Eg.Dom(el).toDsl().children,name: this.cleanAttribute(describe)}
  }),
  it: fromAttribute("data-it",function(el,it) {
    return {type: "it",content: this.getCode(el), name: this.cleanAttribute(it)}
  }),
  scoped: codeNode("scoped","data-scoped"),
  after: codeNode("after","data-after"),
  before: codeNode("before","data-before")
}

// Dsl
Eg.Dsl = {}

Eg.Dsl.Node = function(type,data,children) {
  if(data) assert(typeof data === "object","Expects data to be an object")
  if(children) assert(typeof children.forEach === "function","Expects children to an array")
  return extend(data || {},{type: type,children: children || []})
}

// test tree
Eg.TestTree = {}
Eg.TestTree.dslToTree = function(node,root) {
  var topLevel = !root
  var root = root || {name: "*root*",tests: [], describes: [],type: "describe"}
  var describeContext = root
  node.children.forEach(function(node) {
    switch(node.type) {
    case "describe":
      var testNode = {name: node.name, type: "describe",tests: [],describes: []}
      root.describes.push(testNode)
      if(topLevel) describeContext = testNode
      return Eg.TestTree.dslToTree(node,testNode) 
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
Eg.Mocha.Bdd.treeToJavascript = function(tree) {
  return new Eg.Mocha.Bdd(tree).javascript()
}
Eg.Mocha.Bdd.prototype = {
  javascript: function() {
    return this.describe(this.tree)
  },
  describe: function(node) {
    var _this = this
    var output = []
    var root = node.name === "*root*"
    if(!root) {
      output.push( this.i('describe("' + node.name + '",function() {\n') )
      this.outdent()
    }
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
    if(!root) {
      this.indent()
      output.push( this.i('})\n') )
    }
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
if(!String.prototype.trim) String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g,'')
}

this.Eg = Eg
if(typeof module !== "undefined") module.exports = Eg

})(this)
