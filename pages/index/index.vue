<template>
	<view class="container">
		<uni-section title="基本用法" type="line">
			<uni-forms :modelValue="formData" :rules="rules" ref="form" label-width="160">
				<uni-forms-item label="姓名" name="name" required>
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="性别" name="sex" required>
					<uni-data-checkbox mode="button" v-model="formData.sex" :localdata="sex"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="电话" name="phone" required>
					<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入电话" />
				</uni-forms-item>
				<uni-forms-item label="邮箱" name="email">
					<uni-easyinput type="text" v-model="formData.email" placeholder="请输入邮箱" />
				</uni-forms-item>
				<uni-forms-item label="学历" name="education" required>
					<uni-data-checkbox mode="button" multiple v-model="formData.education" :localdata="education"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="从业时间" name="datetimesingle" required>
					<uni-datetime-picker type="datetime" v-model="formData.datetimesingle" />
				</uni-forms-item>
				<uni-forms-item label="从业领域" name="workingArea" required>
					<uni-data-checkbox mode="button" multiple v-model="formData.workingArea" :localdata="workingArea"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="从业岗位" name="checkList" required>
					<uni-card :is-shadow="false" margin="0px" @click="onShowTree">
						<text class="uni-body">修车</text>
					</uni-card>
				</uni-forms-item>
			</uni-forms>
			<uni-button type="primary"  @click="onSave">确定</uni-button>
		</uni-section>
		
		<uni-popup ref="popup" type="bottom" safeArea backgroundColor="#fff">
			<tree  :checkList="formData.checkList"  v-if="treeOpt.length>0"  :options="{
				label: 'name',
				children: 'children',
				multiple:true,
				checkStrictly:true
			}" @sendValue="confirm"  :isCheck="true" :treeNone="treeOpt"></tree>
		</uni-popup>
	</view>
</template>

<script>
	import Tree from "@/components/xiaolu-tree-vue3/tree.vue"
	// https://ext.dcloud.net.cn/plugin?id=12067
	export default {
		components: {
			Tree
		},
		data() {
			return {
				treeOpt: [
					{
						id: 664214366998,
						name: "校长443",
						user: false,
						children: [{
							id: 885655454545454545678,
							name: "小陆",
							user: true
						}]
					},
				],
				workingArea: [{
					text: '修车',
					value: 0
				},{
					text: '整车',
					value: 1
				},{
					text: '零部件',
					value: 2
				}],
				education: [{
					text: '硕士',
					value: 0
				},{
					text: '本科',
					value: 1
				},{
					text: '大专',
					value: 2
				},{
					text: '其它',
					value: 3
				}],
				sex: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}],
				rules: {
					email: {
						rules: [{
							format: 'email',
							errorMessage: '请输入正确的邮箱地址',
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '请输入手机号'
						}]
					},
					sex: {
						rules: [{
							required: true,
							errorMessage: '请选择性别'
						}]
					},
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入姓名'
						}]
					},
					// hobby: {
					// 	rules: [{
					// 			format: 'array'
					// 		},
					// 		{
					// 			validateFunction: function(rule, value, data, callback) {
					// 				if (value.length < 2) {
					// 					callback('请至少勾选两个兴趣爱好')
					// 				}
					// 				return true
					// 			}
					// 		}
					// 	]
					// }

				},
				formData: {
					checkList: [],
					workingArea: [],
					datetimesingle: [],
					education: [],
					email: '',
					sex:1,
					name: '',
				},
			}
		},
		methods: {
			onSave() {
				uni.showLoading()
				this.$refs.form.validate((err, formDate) => {
					uni.hideLoading()
					console.log(err,formDate)
					
					if (!err) {
						console.log(err,formDate)
					}
				})
			},
			confirm(val) {
				console.log(val)
				this.$refs.popup.close()
			},
			onShowTree() {
				this.$refs.popup.open()
			}
		}
	}
</script>

<style>
	.container {
		padding: 15px;
		background-color: #fff;
		
	}
</style>
