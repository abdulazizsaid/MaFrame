var h = require("virtual-dom/h")
var diff = require("virtual-dom/diff")

var leftNode = h("div")
var rightNode = h("text")

var patches = diff(leftNode, rightNode)
/*
  -> {
    a: leftNode,
    0: vpatch<REPLACE>(rightNode) // a replace operation for the first node
  }
*/