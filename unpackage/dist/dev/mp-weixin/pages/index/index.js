"use strict";
const common_vendor = require("../../common/vendor.js");
const Tree = () => "../../components/xiaolu-tree-vue3/tree.js";
const _sfc_main = {
  components: {
    Tree
  },
  data() {
    return {
      workTypeOpt: [],
      workPositionOpt: [
        {
          id: "1",
          name: "机械设计",
          user: false,
          children: [{
            id: "1-1",
            name: "pre1",
            user: true
          }, {
            id: "1-2",
            name: "pre2",
            user: true
          }]
        },
        {
          id: "2",
          name: "视觉",
          user: false,
          children: [{
            id: "2-1",
            name: "PS1",
            user: true
          }, {
            id: "2-2",
            name: "PS2",
            user: true
          }, {
            id: "2-3",
            name: "PS3",
            user: true
          }, {
            id: "2-4",
            name: "PS4",
            user: true
          }, {
            id: "2-5",
            name: "PS5",
            user: true
          }, {
            id: "2-6",
            name: "PS6",
            user: true
          }]
        }
      ],
      workType: [{
        text: "整车",
        value: "COMPLETE_VEHICLE"
      }, {
        text: "零部件",
        value: "COMPONENTS"
      }],
      education: [{
        text: "研究生",
        value: "MASTER"
      }, {
        text: "本科",
        value: "BACHELOR"
      }, {
        text: "专科",
        value: "JUNIOR_COLLEGE"
      }, {
        text: "其他",
        value: "OTHER"
      }],
      sex: [{
        text: "男",
        value: "MALE"
      }, {
        text: "女",
        value: "FEMALE"
      }],
      rules: {
        work_position_list: {
          rules: [
            {
              format: "array"
            },
            {
              validateFunction: (rule, value, data, callback) => {
                const { work_position_list, other_work_position } = this.formData;
                if (!work_position_list.length && !other_work_position) {
                  callback("请选择从业岗位");
                }
                return true;
              }
            }
          ]
        },
        work_type_list: {
          rules: [
            {
              format: "array"
            },
            {
              validateFunction: (rule, value, data, callback) => {
                const { work_type_list, other_work_type } = this.formData;
                if (!work_type_list.length && !other_work_type) {
                  callback("请选择从业领域");
                }
                return true;
              }
            }
          ]
        },
        date_list: {
          rules: [
            {
              format: "array"
            },
            {
              validateFunction: function(rule, value, data, callback) {
                if (!value.length) {
                  callback("请选择从业时间");
                }
                return true;
              }
            }
          ]
        },
        education: {
          rules: [{
            required: true,
            errorMessage: "请选择学历"
          }]
        },
        email: {
          rules: [{
            format: "email",
            errorMessage: "请输入正确的邮箱地址"
          }]
        },
        phone: {
          rules: [{
            required: true,
            errorMessage: "请输入手机号"
          }]
        },
        sex: {
          rules: [{
            required: true,
            errorMessage: "请选择性别"
          }]
        },
        name: {
          rules: [{
            required: true,
            errorMessage: "请输入姓名"
          }]
        }
      },
      formData: {
        "visaList": [{
          "date_list": [],
          "qzgj": ""
        }],
        "date_list": [],
        // 从业时间
        "work_start_date": "",
        // 从业开始时间
        "work_end_date": "",
        // 从业结束时间
        "yxgzcs": "",
        // 优选工作城市
        "csny": "",
        // 出生年月
        "name": "",
        // 姓名
        "sex": "MALE",
        // 性别
        "phone": "",
        // 手机号
        "email": "",
        // 邮箱
        "education": "",
        // 学历
        "work_type_list": [],
        // 从业领域
        "other_work_type": "",
        // 
        "work_position_list": [],
        // 从业岗位
        "other_work_position": "",
        // 其它岗位
        "openid": ""
        // 用户微信唯一id
      }
    };
  },
  computed: {
    workTypeLabel() {
      const { work_type_list } = this.formData;
      return work_type_list.map((item) => item.name);
    },
    workPositionLabel() {
      const { work_position_list } = this.formData;
      return work_position_list.map((item) => item.name);
    }
  },
  onLoad() {
  },
  methods: {
    onDelVisa(idx) {
      this.formData.visaList.splice(idx, 1);
    },
    onAddVisa() {
      common_vendor.index.__f__("log", "at pages/index/index.vue:338", "------", this.formData);
      this.formData.visaList.push({
        qzgj: "",
        date_list: []
      });
    },
    onSave() {
      this.$refs.form.validate((err, formDate) => {
        common_vendor.index.__f__("log", "at pages/index/index.vue:364", err, formDate);
        if (!err) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:366", err, formDate);
          this.getUserInfoMethods((openidInfo) => {
            common_vendor.index.__f__("log", "at pages/index/index.vue:368", openidInfo);
            if (!(openidInfo.data && openidInfo.data.openid)) {
              common_vendor.index.showToast({
                icon: "none",
                duration: 3e3,
                title: openidInfo
              });
              return;
            }
            const { name, sex, phone, email, date_list, education, work_type_list, other_work_type, work_position_list, other_work_position } = this.formData;
            const [work_start_date, work_end_date] = date_list;
            let postData = {
              "openid": openidInfo.data.openid,
              name,
              sex,
              phone,
              email,
              education,
              work_start_date,
              work_end_date,
              work_type_list,
              other_work_type,
              other_work_position
            };
            if (work_position_list.length) {
              postData.work_position_list = work_position_list.map((item) => item.id);
            }
            common_vendor.index.showLoading();
            common_vendor.index.request({
              url: "https://gtq.dairoot.cn/user/user-worker-info",
              method: "POST",
              data: postData,
              header: {
                "content-type": "application/json"
                // 默认值
              }
            }).then((res) => {
              common_vendor.index.hideLoading();
              if (res.statusCode === 200) {
                common_vendor.index.showToast({
                  icon: "none",
                  duration: 3e3,
                  title: "提交成功"
                });
              } else {
                common_vendor.index.showToast({
                  icon: "none",
                  duration: 3e3,
                  title: JSON.stringify(res.data)
                });
              }
              common_vendor.index.__f__("log", "at pages/index/index.vue:420", res);
              common_vendor.index.__f__("log", "at pages/index/index.vue:421", res.data);
            }).catch((err2) => {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pages/index/index.vue:427", err2);
            });
          });
        }
      });
    },
    confirm(val) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:434", val);
      this.formData.work_position = val;
      this.$refs.popup.close();
    },
    onShowWorkPosition() {
      this.$refs.workPosition.open();
    },
    onShowWorkType() {
      this.$refs.workType.open();
    },
    getUserInfoMethods(callBack) {
      common_vendor.index.login({
        timeout: 6e3,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:448", "success:login方法返回的值：", res);
          if (res.code) {
            common_vendor.index.showLoading();
            common_vendor.index.request({
              url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx1298b5933a8df337&secret=05d62f57e2268e30df0de1a6942982a1&js_code=${res.code}&grant_type=authorization_code`
            }).then((res2) => {
              common_vendor.index.hideLoading();
              callBack && callBack(res2);
            }).catch((err) => {
              common_vendor.index.hideLoading();
              callBack && callBack(err);
            });
          } else {
            common_vendor.index.__f__("log", "at pages/index/index.vue:463", "登录失败！" + res.errMsg);
            callBack && callBack(res.errMsg);
          }
        },
        fail(err) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:468", "fail:login方法返回错误：", err);
          callBack && callBack(err);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _component_tree = common_vendor.resolveComponent("tree");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_datetime_picker2 + _easycom_uni_icons2 + _easycom_uni_tag2 + _easycom_uni_card2 + _easycom_uni_forms2 + _easycom_uni_section2 + _component_tree + _easycom_uni_popup2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_datetime_picker + _easycom_uni_icons + _easycom_uni_tag + _easycom_uni_card + _easycom_uni_forms + _easycom_uni_section + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.formData.name = $event),
    b: common_vendor.p({
      type: "text",
      placeholder: "请输入姓名",
      modelValue: $data.formData.name
    }),
    c: common_vendor.p({
      label: "姓名",
      name: "name",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.sex = $event),
    e: common_vendor.p({
      mode: "button",
      localdata: $data.sex,
      modelValue: $data.formData.sex
    }),
    f: common_vendor.p({
      label: "性别",
      name: "sex",
      required: true
    }),
    g: common_vendor.t($data.formData.csny),
    h: common_vendor.o(_ctx.maskClick),
    i: common_vendor.o(($event) => $data.formData.csny = $event),
    j: common_vendor.p({
      type: "date",
      ["clear-icon"]: true,
      modelValue: $data.formData.csny
    }),
    k: common_vendor.p({
      label: "出生年月",
      name: "phone",
      required: true
    }),
    l: common_vendor.o(($event) => $data.formData.phone = $event),
    m: common_vendor.p({
      type: "text",
      placeholder: "请输入电话",
      modelValue: $data.formData.phone
    }),
    n: common_vendor.p({
      label: "电话",
      name: "phone",
      required: true
    }),
    o: common_vendor.o(($event) => $data.formData.email = $event),
    p: common_vendor.p({
      type: "text",
      placeholder: "请输入邮箱",
      modelValue: $data.formData.email
    }),
    q: common_vendor.p({
      label: "邮箱",
      name: "email"
    }),
    r: common_vendor.t($data.formData.yxgzcs),
    s: common_vendor.o(($event) => $data.formData.yxgzcs = $event),
    t: common_vendor.p({
      type: "text",
      placeholder: "请输入优选工作城市",
      modelValue: $data.formData.yxgzcs
    }),
    v: common_vendor.p({
      label: "优选工作城市",
      name: "yxgzcs"
    }),
    w: common_vendor.o(($event) => $data.formData.education = $event),
    x: common_vendor.p({
      mode: "button",
      localdata: $data.education,
      modelValue: $data.formData.education
    }),
    y: common_vendor.p({
      label: "学历",
      name: "education",
      required: true
    }),
    z: common_vendor.f($data.formData.visaList, (item, idx, i0) => {
      return common_vendor.e({
        a: "7525ff05-17-" + i0 + ",7525ff05-16",
        b: common_vendor.o(($event) => item.qzgj = $event),
        c: common_vendor.p({
          type: "text",
          placeholder: "签证国家",
          modelValue: item.qzgj
        }),
        d: "7525ff05-18-" + i0 + ",7525ff05-16",
        e: common_vendor.o(($event) => item.date_list = $event),
        f: common_vendor.p({
          type: "daterange",
          rangeSeparator: "至",
          start: "2021-3-20",
          end: "2025-5-20",
          modelValue: item.date_list
        }),
        g: idx > 0
      }, idx > 0 ? {
        h: common_vendor.o(($event) => $options.onDelVisa(idx)),
        i: "7525ff05-19-" + i0 + ",7525ff05-16",
        j: common_vendor.p({
          type: "clear",
          size: "30"
        })
      } : {});
    }),
    A: common_vendor.o((...args) => $options.onAddVisa && $options.onAddVisa(...args)),
    B: common_vendor.p({
      label: "签证",
      name: "qz",
      required: true
    }),
    C: common_vendor.o(($event) => $data.formData.date_list = $event),
    D: common_vendor.p({
      type: "daterange",
      rangeSeparator: "至",
      start: "2021-3-20",
      end: "2025-5-20",
      modelValue: $data.formData.date_list
    }),
    E: common_vendor.p({
      label: "从业时间",
      name: "date_list",
      required: true
    }),
    F: $options.workTypeLabel.length
  }, $options.workTypeLabel.length ? {
    G: common_vendor.f($options.workTypeLabel, (item, k0, i0) => {
      return {
        a: item,
        b: "7525ff05-24-" + i0 + ",7525ff05-23",
        c: common_vendor.p({
          type: "primary",
          text: item
        })
      };
    })
  } : {}, {
    H: common_vendor.o($options.onShowWorkType),
    I: common_vendor.p({
      ["is-shadow"]: false,
      margin: "0px",
      padding: "6px"
    }),
    J: $data.formData.other_work_type,
    K: common_vendor.o(($event) => $data.formData.other_work_type = $event.detail.value),
    L: common_vendor.p({
      label: "从业领域",
      name: "work_type_list",
      required: true
    }),
    M: $options.workPositionLabel.length
  }, $options.workPositionLabel.length ? {
    N: common_vendor.f($options.workPositionLabel, (item, k0, i0) => {
      return {
        a: item,
        b: "7525ff05-27-" + i0 + ",7525ff05-26",
        c: common_vendor.p({
          type: "primary",
          text: item
        })
      };
    })
  } : {}, {
    O: common_vendor.o($options.onShowWorkPosition),
    P: common_vendor.p({
      ["is-shadow"]: false,
      margin: "0px",
      padding: "6px"
    }),
    Q: $data.formData.other_work_position,
    R: common_vendor.o(($event) => $data.formData.other_work_position = $event.detail.value),
    S: common_vendor.p({
      label: "从业岗位",
      name: "work_position_list",
      required: true
    }),
    T: common_vendor.sr("form", "7525ff05-1,7525ff05-0"),
    U: common_vendor.p({
      modelValue: $data.formData,
      rules: $data.rules,
      ["label-width"]: "76px",
      ["label-align"]: "right"
    }),
    V: common_vendor.p({
      title: "个人信息",
      type: "line"
    }),
    W: common_vendor.o((...args) => $options.onSave && $options.onSave(...args)),
    X: $data.workTypeOpt.length > 0
  }, $data.workTypeOpt.length > 0 ? {
    Y: common_vendor.o($options.confirm),
    Z: common_vendor.p({
      checkList: $data.formData.work_type_list,
      options: {
        label: "name",
        children: "children",
        multiple: true,
        checkStrictly: true
      },
      isCheck: true,
      treeNone: $data.workTypeOpt
    })
  } : {}, {
    aa: common_vendor.sr("workType", "7525ff05-28"),
    ab: common_vendor.p({
      type: "bottom",
      safeArea: true,
      backgroundColor: "#fff"
    }),
    ac: $data.workPositionOpt.length > 0
  }, $data.workPositionOpt.length > 0 ? {
    ad: common_vendor.o($options.confirm),
    ae: common_vendor.p({
      checkList: $data.formData.work_position_list,
      options: {
        label: "name",
        children: "children",
        multiple: true,
        checkStrictly: true
      },
      isCheck: true,
      treeNone: $data.workPositionOpt
    })
  } : {}, {
    af: common_vendor.sr("workPosition", "7525ff05-30"),
    ag: common_vendor.p({
      type: "bottom",
      safeArea: true,
      backgroundColor: "#fff"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
