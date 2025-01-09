<template>
	<view class="container">
		<uni-section title="个人信息" type="line">
			<uni-forms :modelValue="formData" :rules="rules" ref="form" label-width="80px" label-align="right">
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
					<uni-data-checkbox mode="button" v-model="formData.education" :localdata="education"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="从业时间" name="date_list" required>
					<uni-datetime-picker 
						type="daterange" 
						rangeSeparator="至"
					 	start="2021-3-20"
						end="2025-5-20"
						v-model="formData.date_list"
					 />
				</uni-forms-item>
				<uni-forms-item label="从业领域" name="work_type" required>
					<uni-data-checkbox mode="button" multiple v-model="formData.work_type" :localdata="workType"></uni-data-checkbox>
					<view class="other-work-type">
						<text class="other-work-type-label">其它:</text>
						<view class="other-work-type-input">
							<uni-easyinput type="text" v-model="formData.email" placeholder="请输入其它领域" />
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="从业岗位" name="checkList" required>
					<uni-card :is-shadow="false" margin="0px" @click="onShowTree">
						<text class="uni-body">{{workPositionLabel}}</text>
					</uni-card>
				</uni-forms-item>
			</uni-forms>
			<view class="save-btn">
				<button type="primary"  @click="onSave">提交</button>
			</view>
			
			<!-- <button @click="getUserInfoMethods">调用wx.login方法</button> -->

		</uni-section>
		
		<uni-popup ref="popup" type="bottom" safeArea backgroundColor="#fff">
			<tree  :checkList="formData.work_position"  v-if="treeOpt.length>0"  :options="{
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
	import {flatObject} from "@/utils/utils.js"
	export default {
		components: {
			Tree
		},
		data() {
			return {
				treeOpt: [
					{
						id: '1',
						name: "机械设计",
						user: false,
						children: [{
							id: '1-1',
							name: "pre",
							user: true
						},{
							id: '1-2',
							name: "pre",
							user: true
						}]
					},
					{
						id: '2',
						name: "视觉",
						user: false,
						children: [{
							id: '2-1',
							name: "PS",
							user: true
						}]
					},
				],
				workType: [{
					text: '整车',
					value: 'COMPLETE_VEHICLE'
				},{
					text: '零部件',
					value: "COMPONENTS"
				}],
				education: [{
					text: '硕士',
					value: 'MASTER'
				},{
					text: '本科',
					value: 'BACHELOR'
				},{
					text: '大专',
					value: 'JUNIOR_COLLEGE'
				},{
					text: '其它',
					value: 'OTHER'
				}],
				sex: [{
					text: '男',
					value: 'MALE'
				}, {
					text: '女',
					value: 'FEMALE'
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
					// checkList: [],
					// workingArea: [],
					// datetimesingle: [],
					// education: [],
					// email: '',
					// sex:1,
					// name: '',
					
					"openid": "",
					"name": "",
					"sex": "MALE",
					"phone": "",
					"email": "",
					
					"date_list": [], // 从业时间
					"work_start_date": "",
					"work_end_date": "",
					
					"education": "", // 学历
					"work_type": [], // 从业领域
					"other_work_type": '',
					"work_position": [] , // 从业岗位
					"other_work_position": ''
				},
			}
		},
		computed: {
		    workPositionLabel() {				
				const list = flatObject(this.treeOpt)
				const lables = list.filter(item => this.formData.work_position.includes(item.id)).map(item => item.name).join((','))
				// const list = Utils.flatObject(this.treeOpt)
				// console.log(list)
				console.log('lables',lables)
				return lables
		      // return this.formData.work_position.map(item => item.)
		    }
		  },
		onLoad(){
		},
		methods: {
			// https://gtq.dairoot.cn/user/user-worker-info
			
			// {
			//  "name": "n2a123me",
			//  "openid": "openweiqwed",
			//  "sex": "MALE",
			//  "phone": "12345678901",
			//  "education": "education",
			//  "work_start_date": "2015-02-10",
			//  "work_end_date": "2015-01-11",
			//  "email": "xxx@11.com",
			//  "work_type": "xwork_atype",
			//  "work_position": "work_position"
			// }
			onSave() {
				uni.showLoading()
				this.$refs.form.validate((err, formDate) => {
					uni.hideLoading()
					console.log(err,formDate)
					if (!err) {
						console.log(err,formDate)
						uni.request({
						    url: "https://gtq.dairoot.cn/user/user-worker-info",
							method: "POST",
							data: {
							 "name": "n2a123me",
							 "openid": "openweiqwed",
							 "sex": "MALE",
							 "phone": "12345678901",
							 "education": "education",
							 "work_start_date": "2015-02-10",
							 "work_end_date": "2015-01-11",
							 "email": "xxx@11.com",
							 "work_type": "xwork_atype",
							 "work_position": "work_position"
							},
						  header: {
								'content-type': 'application/json', // 默认值
							},
						  })
						  .then((res) => {
						    // 此处的 res 参数，与使用默认方式调用时 success 回调中的 res 参数一致
						    console.log(res.data);
						  })
						  .catch((err) => {
						    // 此处的 err 参数，与使用默认方式调用时 fail 回调中的 err 参数一致
						    console.error(err);
						  })
					}
				})
			},
			confirm(val) {
				console.log(val)
				this.$refs.popup.close()
			},
			onShowTree() {
				this.$refs.popup.open()
			},
			
			getUserInfoMethods() {
				uni.login({
					timeout: 6000,
					success: (res) => {
						console.log('success:login方法返回的值：', res)
						if (res.code) {
						  uni.request({
						      url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx1298b5933a8df337&secret=05d62f57e2268e30df0de1a6942982a1&js_code=${res.code}&grant_type=authorization_code`,
						    })
						    .then((res) => {
						      // 此处的 res 参数，与使用默认方式调用时 success 回调中的 res 参数一致
						      console.log(res.data);
						    })
						    .catch((err) => {
						      // 此处的 err 参数，与使用默认方式调用时 fail 回调中的 err 参数一致
						      console.error(err);
						    });

						    } else {
						      console.log('登录失败！' + res.errMsg)
						    }
						
					},
					fail(err) {
						console.log('fail:login方法返回错误：', err)
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 15px;
		background-color: #fff;
	}
	.other-work-type {
		display: flex;
		align-items: center;
	}
	.other-work-type-label {
		margin-right: 12px;
	}
	.other-work-type-input {
		width: 160px;
	}
	.save-btn {
		margin-top: 70px;
	}
</style>
