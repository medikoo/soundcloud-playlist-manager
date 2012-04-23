'use strict';

module.exports = function (t, a) {
  var el1, el2, el3, el4, fn = function () {};

  el1 = t('p');

  a(el1.nodeName, 'p', "NodeName");
  a(el1.nodeType, 1, "NodeType");
  a(el1.childNodes.length, 0, "Children");

  el2 = t('div', { 'class': 'test', onclick: fn });

  a(el2.nodeName, 'div', "With attrs: NodeName");
  a(el2.nodeType, 1, "With attrs: NodeType");
  a(el2.childNodes.length, 0, "With attrs: Children");
  a(el2.getAttribute('class'), 'test', "With attrs: Attribute");
  a(el2.onclick, fn, "With attrs: Listener attribute");

  el3 = t('form', el1, el2);
  a(el3.nodeName, 'form', "With children: NodeName");
  a(el3.nodeType, 1, "With children: NodeType");
  a.deep(Object.toArray(el3.childNodes), [el1, el2],
    "With children: Children");

  el4 = t('section', { 'class': 'bar' }, el3, el2);
  a(el4.nodeName, 'section', "With attrs & children: NodeName");
  a(el4.nodeType, 1, "With attrs & children: NodeType");
  a(el4.getAttribute('class'), 'bar', "With attrs & children: Attribute");
  a.deep(Object.toArray(el4.childNodes), [el3, el2],
    "With attrs & children: Children");

};
