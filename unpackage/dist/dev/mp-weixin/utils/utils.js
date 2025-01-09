"use strict";
function flatObject(source, children = "children") {
  const re = [];
  const clone = JSON.parse(JSON.stringify(source));
  flatObjectDo(clone, children, re);
  return re;
}
function flatObjectDo(source, children, re, parentId) {
  source.forEach((s) => {
    if (parentId) {
      s.parentId = parentId;
    }
    re.push(s);
    if (s[children]) {
      flatObjectDo(s[children], children, re, s.id);
      delete s[children];
    }
  });
}
exports.flatObject = flatObject;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/utils.js.map
