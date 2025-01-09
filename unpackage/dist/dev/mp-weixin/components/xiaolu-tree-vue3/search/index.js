"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      inputVal: ""
    };
  },
  methods: {
    handleFllter(e) {
      this.$emit("confirm", e.detail.value);
    },
    clears() {
      common_vendor.index.__f__("log", "at components/xiaolu-tree-vue3/search/index.vue:26", this.inputVal);
      this.inputVal = "";
      common_vendor.index.__f__("log", "at components/xiaolu-tree-vue3/search/index.vue:28", "清除了内容");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.handleFllter && $options.handleFllter(...args)),
    b: $data.inputVal,
    c: common_vendor.o(($event) => $data.inputVal = $event.detail.value)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9677f3db"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/xiaolu-tree-vue3/search/index.js.map
