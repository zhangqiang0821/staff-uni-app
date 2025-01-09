"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  search();
}
const search = () => "./search/index.js";
const _sfc_main = {
  __name: "tree",
  props: {
    treeNone: {
      type: Array,
      default: () => {
        return [];
      }
    },
    checkList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    keyValue: {
      type: String,
      default: "id"
    },
    searchIf: {
      type: Boolean,
      default: true
    },
    isCheck: true,
    checkList: {
      type: Array,
      default: () => []
    },
    parentList: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {
        return {
          label: "name",
          children: "children",
          multiple: false,
          checkStrictly: false
          //不关联
        };
      }
    }
  },
  emits: ["sendValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const catchTreeNone = JSON.parse(JSON.stringify(props.treeNone)), tree = common_vendor.ref(props.treeNone), newCheckList = common_vendor.ref(props.checkList), tree_stack = common_vendor.ref([1]), nodePathArray = common_vendor.ref([]), searchResult = common_vendor.ref([]), scrollLeft = common_vendor.ref(999), oldNum = common_vendor.ref(0), newNum = common_vendor.ref(0), isre = common_vendor.ref(false), searchRef = common_vendor.ref(null);
    const emit = __emit;
    const initComponent = () => {
      if (newCheckList.value.length !== 0) {
        if (props.options.multiple) {
          if (props.options.checkStrictly) {
            checkAllChoose();
          }
        } else {
          getNodeRoute(catchTreeNone, newCheckList.value[0][props.keyValue]);
          let arr = nodePathArray.value.reverse();
          if (arr.length == 0)
            return;
          tree_stack.value = tree_stack.value.concat(arr);
          tree.value = tree_stack.value[tree_stack.value.length - 1].children;
        }
      }
      common_vendor.index.__f__("log", "at components/xiaolu-tree-vue3/tree.vue:141", props.options);
    };
    initComponent();
    function getNodeRoute(tree2, targetId) {
      for (let index = 0; index < tree2.length; index++) {
        if (tree2[index].children) {
          let endRecursiveLoop = getNodeRoute(tree2[index].children, targetId);
          if (endRecursiveLoop) {
            nodePathArray.value.push(tree2[index]);
            return true;
          }
        }
        if (tree2[index][props.keyValue] === targetId) {
          return true;
        }
      }
    }
    const radioSelect = common_vendor.computed(() => {
      return (item) => {
        const list = newCheckList.value;
        return list.length > 0 && item[props.keyValue] == list[0][props.keyValue];
      };
    });
    const isActive = common_vendor.computed(() => {
      return (index) => {
        return index === tree_stack.value.length - 1;
      };
    });
    const isSelect = common_vendor.computed(() => {
      return (item) => {
        const checkList = newCheckList.value;
        if (checkList.length == 0) {
          props.options.checkStrictly ? (item.bx = 0, item.qx = 0) : "";
          return false;
        }
        const i = checkList.findIndex((e) => {
          return item[props.keyValue] == e[props.keyValue];
        }) > -1;
        return i && !item.qx;
      };
    });
    function toChildren(item) {
      if (item.user)
        return;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      let children = props.options.children;
      if (!item.user && item[children].length > 0 && !(tree_stack.value[0][props.keyValue] == item[props.keyValue])) {
        tree.value = item[children];
        tree_stack.value.push(item);
      }
      common_vendor.nextTick$1(() => {
        common_vendor.index.hideLoading();
        scrollLeft.value += 200;
      });
      if (props.options.checkStrictly)
        checkAllChoose();
    }
    function computAllNumber(arr) {
      for (let j = 0; j < arr.length; j++) {
        var e = arr[j];
        checkSum(e[props.keyValue]);
        if (e.user) {
          newNum.value++;
        } else {
          computAllNumber(e.children);
        }
      }
    }
    function checkSum(id) {
      for (let i = 0; i < newCheckList.value.length; i++) {
        if (id == newCheckList.value[i][props.keyValue]) {
          oldNum.value++;
          break;
        }
      }
    }
    function checkAllChoose() {
      let o = false, t = true;
      tree.value.forEach((e, i) => {
        if (!e.user) {
          e.qx = o;
          e.bx = o;
          computAllNumber(e.children);
          if (newNum.value != 0 && oldNum.value != 0) {
            if (newNum.value == oldNum.value) {
              e.qx = t;
              e.bx = o;
            } else {
              e.qx = o;
              e.bx = t;
            }
          }
          if (newNum.value != 0 && oldNum.value == 0) {
            tree.value[i].bx = o;
            tree.value[i].qx = o;
          }
          newNum.value = 0;
          oldNum.value = 0;
        }
      });
    }
    function checkbox(item, index) {
      const path = getPath();
      newCheckList.value = [{
        ...item,
        path
      }];
    }
    function getPath() {
      const path = [...tree_stack.value].map((e) => {
        const item = Object.assign({}, e);
        delete item[props.options.children];
        return item;
      });
      return path.slice(1, path.length) || [];
    }
    function getIdBydelete(arr) {
      arr.forEach((e) => {
        if (e.user) {
          for (var i = 0; i < newCheckList.value.length; i++) {
            if (e[props.keyValue] == newCheckList.value[i][props.keyValue]) {
              newCheckList.value.splice(i, 1);
              break;
            }
          }
        } else {
          getIdBydelete(e.children);
        }
      });
    }
    function checkboxChange(item, index, bx, qx) {
      const options = props.options;
      if (!options.multiple)
        return;
      let findIdex = newCheckList.value.findIndex((e) => item[props.keyValue] == e[props.keyValue]);
      const path = getPath();
      if (findIdex > -1) {
        if (options.checkStrictly) {
          if (item.user) {
            newCheckList.value.splice(findIdex, 1);
          } else {
            getIdBydelete(item.children);
          }
        } else {
          newCheckList.value.splice(findIdex, 1);
        }
      } else {
        if (!item.user && options.checkStrictly) {
          if (qx || bx) {
            getIdBydelete(item.children);
            item.qx = 0;
            item.bx = 0;
          } else {
            item.qx = 1;
            item.bx = 0;
            const {
              id,
              name,
              user
            } = item;
            const newObj = {
              id,
              name,
              user
            };
            const pathList = tree_stack.value.length === 1 ? [newObj, ...path] : [...path, newObj];
            chooseChild(item.children, pathList);
          }
          return;
        }
        newCheckList.value.push({
          ...item,
          path
        });
      }
    }
    function chooseChild(arr, path) {
      const oldPath = [...path];
      for (var i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        if (item.user) {
          newCheckList.value.push({
            ...item,
            path: oldPath
          });
        } else {
          const newItem = {
            ...item
          };
          delete newItem[props.options.children];
          const newPath = [...oldPath, newItem];
          chooseChild(item.children, newPath);
        }
      }
    }
    function confirmSearch(val) {
      searchResult.value = [];
      searchTree(catchTreeNone, val);
      isre.value = true;
      tree_stack.value.splice(1, 1e3);
      common_vendor.index.showLoading({
        title: "正在查找"
      });
      setTimeout(() => {
        tree.value = searchResult.value;
        common_vendor.index.hideLoading();
      }, 300);
    }
    function searchTree(data, keyword) {
      let children = props.options.children;
      let label = props.options.label;
      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i][label].indexOf(keyword) >= 0) {
          searchResult.value.push(data[i]);
        }
        if (!data[i].user && data[i][children].length > 0) {
          searchTree(data[i][children], keyword);
        }
      }
    }
    function backTree(item, index) {
      let max = 300;
      if (index === -1) {
        tree.value = catchTreeNone;
        tree_stack.value.splice(1, max);
        common_vendor.index.__f__("log", "at components/xiaolu-tree-vue3/tree.vue:383", tree.value);
        isre.value = false;
      } else if (index === -2) {
        tree.value = searchResult.value;
        tree_stack.value.splice(1, max);
      } else {
        if (tree_stack.value.length - index > 2) {
          tree_stack.value.splice(index + 1, max);
        } else if (index !== tree_stack.value.length - 1) {
          tree_stack.value.splice(tree_stack.value.length - 1, 1);
        }
        tree.value = item[props.options.children];
      }
      if (props.options.checkStrictly)
        checkAllChoose();
    }
    function backConfirm() {
      emit("sendValue", newCheckList.value, "back");
    }
    const handleClick = (item, index) => {
      let children = item[props.options.children];
      if (index > -1 && children && children.length > 0) {
        toChildren(item);
      } else if (props.options.multiple) {
        checkboxChange(item, index, item.bx, item.qx);
      } else {
        checkbox(item);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.searchIf
      }, __props.searchIf ? {
        b: common_vendor.sr(searchRef, "18dbbdc7-0", {
          "k": "searchRef"
        }),
        c: common_vendor.o(confirmSearch)
      } : {}, {
        d: common_vendor.f(tree_stack.value, (item, index, i0) => {
          return common_vendor.e({
            a: index == 0
          }, index == 0 ? {
            b: common_vendor.n(isActive.value(index) && !isre.value ? "none" : "active"),
            c: common_vendor.o(($event) => backTree(item, -1), index)
          } : {}, {
            d: index == 0 && isre.value
          }, index == 0 && isre.value ? {
            e: common_vendor.o(($event) => backTree(item, -2), index),
            f: common_vendor.n(index == tree_stack.value.length - 1 && isre.value ? "none" : "active")
          } : {}, {
            g: index != 0
          }, index != 0 ? {
            h: common_vendor.t(item[props.options.label]),
            i: common_vendor.n(isActive.value(index) ? "none inline-ite" : "active"),
            j: common_vendor.o(($event) => backTree(item, index), index)
          } : {}, {
            k: index
          });
        }),
        e: scrollLeft.value,
        f: common_vendor.f(tree.value, (item, index, i0) => {
          return common_vendor.e(props.options.multiple ? common_vendor.e({
            a: isSelect.value(item)
          }, isSelect.value(item) ? common_vendor.e({
            b: item.bx && newCheckList.value.length != 0
          }, item.bx && newCheckList.value.length != 0 ? {} : {}) : item.qx ? {} : item.bx ? {} : {}, {
            c: item.qx,
            d: item.bx,
            e: common_vendor.o(($event) => handleClick(item, -1), index)
          }) : (props.options.nodes ? item.user ? true : false : true) ? common_vendor.e({
            g: radioSelect.value(item)
          }, radioSelect.value(item) ? {} : {}, {
            h: common_vendor.o(($event) => handleClick(item, -1), index)
          }) : {}, {
            f: props.options.nodes ? item.user ? true : false : true,
            i: common_vendor.t(item[props.options.label]),
            j: !item.user && item.children.length > 0
          }, !item.user && item.children.length > 0 ? {} : {}, {
            k: common_vendor.o(($event) => handleClick(item, index), index),
            l: index
          });
        }),
        g: props.options.multiple,
        h: __props.isCheck,
        i: common_vendor.o(backConfirm)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-18dbbdc7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/xiaolu-tree-vue3/tree.js.map
