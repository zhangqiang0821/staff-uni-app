/**
* 通过传入的children字段名，将多层级的对象打平为一个数组
* @param {T} source
* @param {string} children
* @returns {T[]}
* 例如  [{id: 1, children: [{id: 2}]}] => [{id: 1}, {id: 2}]
*/
export function flatObject(source, children = 'children') {
    const re = []
    const clone = JSON.parse(JSON.stringify(source))
    flatObjectDo(clone, children, re)
    return re
  }
  
export function flatObjectDo(source, children, re, parentId) {
    source.forEach((s) => {
      if (parentId) {
        s.parentId = parentId
      }
      re.push(s)
      if (s[children]) {
        flatObjectDo(s[children], children, re, s.id)
        delete s[children]
      }
    })
  }