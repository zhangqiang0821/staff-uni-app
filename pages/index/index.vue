<template>
	<view class="container">
		<uni-section title="个人信息" type="line">
			<uni-forms :modelValue="formData" :rules="rules" ref="form" label-width="76px" label-align="right">
				<uni-forms-item label="姓名" name="name" required>
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="性别" name="sex" required>
					<uni-data-checkbox mode="button" v-model="formData.sex" :localdata="sex"></uni-data-checkbox>
				</uni-forms-item>
				
				<uni-forms-item label="出生年月" name="phone" required>
					{{formData.csny}}
					<uni-datetime-picker type="date" clear-icon v-model="formData.csny" @maskClick="maskClick" />
				</uni-forms-item>
				
				<uni-forms-item label="电话" name="phone" required>
					<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入电话" />
				</uni-forms-item>
				<uni-forms-item label="邮箱" name="email">
					<uni-easyinput type="text" v-model="formData.email" placeholder="请输入邮箱" />
				</uni-forms-item>
				
				<uni-forms-item label="优选工作城市" name="yxgzcs">
					{{formData.yxgzcs}}
					<uni-easyinput type="text" v-model="formData.yxgzcs" placeholder="请输入优选工作城市" />
				</uni-forms-item>
				
				<uni-forms-item label="学历" name="education" required>
					<uni-data-checkbox mode="button" v-model="formData.education" :localdata="education"></uni-data-checkbox>
				</uni-forms-item>
				
				<uni-forms-item label="签证" name="qz" required>
					<view class="visa-list">
						<view class="visa-item" v-for="(item,idx) in formData.visaList">
							<view class="visa-country">
								<uni-easyinput type="text" v-model="item.qzgj" placeholder="签证国家" />
							</view>
							<view class="visa-validity">
								<uni-datetime-picker
									type="daterange" 
									rangeSeparator="至"
									start="2021-3-20"
									end="2025-5-20"
									v-model="item.date_list"
								 />
							</view>
							<uni-icons type="clear" size="30" v-if="idx>0" @click="onDelVisa(idx)"></uni-icons>
						</view>
					</view>
					<view class="visa-add">
						<button type="primary" size="mini"  @click="onAddVisa">增加签证</button>
					</view>
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
				<uni-forms-item label="从业领域" name="work_type_list" required>
					<uni-card :is-shadow="false" margin="0px" @click="onShowWorkType" padding="6px">
						<view class="work-position-label" v-if="workTypeLabel.length">
							<uni-tag 
								type="primary" 
								v-for="item in workTypeLabel" :key="item"
								:text="item" 
								class="work-position-tag" ></uni-tag>
				
						</view>
						<view class="work-position-label-placeholder" v-else>请选择从业领域</view>
					</uni-card>
					<view class="other-type other-position-label">
						<text class="other-label">其它:</text>
						<view class="other-input">
							<input type="text" v-model="formData.other_work_type" placeholder="请输入其它从业领域" />
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="从业岗位" name="work_position_list" required>
					<uni-card :is-shadow="false" margin="0px" @click="onShowWorkPosition" padding="6px">
						<view class="work-position-label" v-if="workPositionLabel.length">
							<uni-tag 
								type="primary" 
								v-for="item in workPositionLabel" :key="item"
								:text="item" 
								class="work-position-tag" ></uni-tag>

						</view>
						<view class="work-position-label-placeholder" v-else>请选择从业岗位</view>
					</uni-card>
					<view class="other-type other-position-label">
						<text class="other-label">其它:</text>
						<view class="other-input">
							<input type="text" v-model="formData.other_work_position" placeholder="请输入其它从业岗位" />
						</view>
					</view>
				</uni-forms-item>
			</uni-forms>
		</uni-section>
		<view class="save-btn">
			<button type="primary"  @click="onSave">提交</button>
		</view>
		
		<!-- 从业领域 start -->
		<uni-popup ref="workType" type="bottom" safeArea backgroundColor="#fff">
			{{formData.work_type_list}}
			<tree  :checkList="formData.work_type_list"  v-if="workTypeOpt.length>0"  :options="{
				label: 'name',
				children: 'children',
				multiple:true,
				checkStrictly:true
			}" @sendValue="onConfirmWorkType"  :isCheck="true" :treeNone="workTypeOpt"></tree>
		</uni-popup>
		<!-- 从业领域 end -->
		
		<!-- 从业岗位 start -->
		<uni-popup ref="workPosition" type="bottom" safeArea backgroundColor="#fff">
			{{formData.work_position_list}}
			<tree  :checkList="formData.work_position_list"  v-if="workPositionOpt.length>0"  :options="{
				label: 'name',
				children: 'children',
				multiple:true,
				checkStrictly:true
			}" @sendValue="onConfirmWorkPosition"  :isCheck="true" :treeNone="workPositionOpt"></tree>
		</uni-popup>
		<!-- 从业岗位 end -->
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
				workTypeOpt: [
					{
						id: '1',
						name: "汽车",
						user: false,
						children: [{
							id: '1-1',
							name: "整车",
							user: true
						},{
							id: '1-2',
							name: "零部件",
							user: true
						}]
					},
					{
						id: '2',
						name: "食品",
						user: true,
					},
					{
						id: '3',
						name: "机加工",
						user: true,
					},
					{
						id: '4',
						name: "机械制造",
						user: true,
					},
				],
				workPositionOpt: [
					{
						id: '1',
						name: "机械设计",
						user: false,
						children: [{
							id: '1-1',
							name: "擅长软件",
							user: false,
							children: [{
								id: '1-1-1',
								name: "SolidWorks",
								user: true
							},{
								id: '1-1-2',
								name: "UG",
								user: true
							},{
								id: '1-1-3',
								name: "Siemens NX",
								user: true
							},{
								id: '1-1-4',
								name: "CATIA",
								user: true
							},{
								id: '1-1-5',
								name: "3ds Max",
								user: true
							},{
								id: '1-1-6',
								name: "CAD",
								user: true
							}]
						}]
					},
					{
						id: '2',
						name: "仿真",
						user: false,
						children: [{
							id: '2-1',
							name: "擅长软件",
							user: false,
							children: [{
								id: '2-1-1',
								name: "RobotStudio",
								user: true
							},{
								id: '2-1-2',
								name: "PD",
								user: true
							},{
								id: '2-1-3',
								name: "PS",
								user: true
							},{
								id: '2-1-4',
								name: "Roboguide",
								user: true
							},{
								id: '2-1-5',
								name: "WorkVisual",
								user: true
							},]
						}]
					},
					{
						id: '3',
						name: "机器人调试",
						user: false,
						children: [
							{
								id: '3-1',
								name: "擅长品牌",
								user: false,
								children: [{
									id: '3-1-1',
									name: "FANUC",
									user: true
								},{
									id: '3-1-2',
									name: "ABB",
									user: true
								},{
									id: '3-1-3',
									name: "KUKA",
									user: true
								},{
									id: '3-1-4',
									name: "NACHI",
									user: true
								},{
									id: '3-1-5',
									name: "Yaskawa",
									user: true
								},{
									id: '3-1-6',
									name: "Panasonic",
									user: true
								},{
									id: '3-1-7',
									name: "ESTUN",
									user: true
								},{
									id: '3-1-8',
									name: "Epson",
									user: true
								},]
							},
							{
								id: '3-2',
								name: "擅长工艺",
								user: false,
								children: [{
									id: '3-2-1',
									name: "搬运应用",
									user: true
								},{
									id: '3-2-2',
									name: "涂胶应用",
									user: true
								},{
									id: '3-2-3',
									name: "滚边应用",
									user: true
								},{
									id: '3-2-4',
									name: "点焊应用",
									user: true
								},{
									id: '3-2-5',
									name: "激光焊应用",
									user: true
								},{
									id: '3-2-6',
									name: "弧焊应用",
									user: true
								},{
									id: '3-2-7',
									name: "视觉应用",
									user: true
								},{
									id: '3-2-8',
									name: "FDS应用",
									user: true
								},{
									id: '3-2-9',
									name: "SPR应用",
									user: true
								},{
									id: '3-2-10',
									name: "搅拌摩擦焊应用",
									user: true
								}]
							},
							
							{
								id: '3-3',
								name: "擅长标准",
								user: false,
								children: [{
									id: '3-3-1',
									name: "大众标准(有证书)",
									user: true
								},{
									id: '3-3-2',
									name: "大众标准(无证书)",
									user: true
								},{
									id: '3-3-3',
									name: "TESLA标准(有证书)",
									user: true
								},{
									id: '3-3-4',
									name: "TESLA标准(无证书)",
									user: true
								},{
									id: '3-3-5',
									name: "奔驰标准(有证书)",
									user: true
								},{
									id: '3-3-6',
									name: "奔驰标准(无证书)",
									user: true
								},{
									id: '3-3-7',
									name: "宝马标准(有证书)",
									user: true
								},{
									id: '3-3-8',
									name: "宝马标准(无证书)",
									user: true
								},{
									id: '3-3-9',
									name: "奇瑞标准(有证书)",
									user: true
								},{
									id: '3-3-10',
									name: "奇瑞标准(无证书)",
									user: true
								},{
									id: '3-3-11',
									name: "吉利标准(有证书)",
									user: true
								},{
									id: '3-3-12',
									name: "吉利标准(无证书)",
									user: true
								},{
									id: '3-3-13',
									name: "长城标准(有证书)",
									user: true
								},{
									id: '3-3-14',
									name: "长城标准(无证书)",
									user: true
								},{
									id: '3-3-15',
									name: "上汽通用标准(有证书)",
									user: true
								},{
									id: '3-3-16',
									name: "上汽通用标准(无证书)",
									user: true
								},{
									id: '3-3-17',
									name: "赛力斯标准(有证书)",
									user: true
								},{
									id: '3-3-18',
									name: "赛力斯标准(无证书)",
									user: true
								},{
									id: '3-3-19',
									name: "比亚迪标准",
									user: true
								},{
									id: '3-3-20',
									name: "北汽标准",
									user: true
								}]
							},
							{
								id: '3-4',
								name: "电气调试",
								user: false,
								children: [{
									id: '3-4-1',
									name: "擅长软件",
									user: false,
									children: [{
										id: '3-4-1-1',
										name: "Siemens",
										user: true
									},{
										id: '3-4-1-2',
										name: "OMRON",
										user: true
									},{
										id: '3-4-1-3',
										name: "Schneider",
										user: true
									},{
										id: '3-4-1-4',
										name: "AB",
										user: true
									},{
										id: '3-4-1-5',
										name: "汇川",
										user: true
									},{
										id: '3-4-1-6',
										name: "Mitsubishi",
										user: true
									},]
								}]
							}, {
								id: '3-5',
								name: "安装",
								user: false,
								children: [{
									id: '3-5-1',
									name: "电气",
									user: false,
									children: [{
										id: '3-5-1-1',
										name: "电工证(有)",
										user: true
									},{
										id: '3-5-1-2',
										name: "电工证(无)",
										user: true
									},{
										id: '3-5-1-3',
										name: "盘柜",
										user: true
									},{
										id: '3-5-1-4',
										name: "现场安装",
										user: true
									}]
								},]
							}, {
								id: '3-6',
								name: "机械",
								user: false,
								children: [{
									id: '3-6-1',
									name: "电气",
									user: false,
									children: [{
										id: '3-6-1-1',
										name: "有证",
										user: true
									},{
										id: '3-6-1-2',
										name: "无证",
										user: true
									},{
										id: '3-6-1-3',
										name: "气路安装",
										user: true
									},{
										id: '3-6-1-4',
										name: "机械安装",
										user: true
									}]
								},]
							}
						]
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
					text: '研究生',
					value: 'MASTER'
				},{
					text: '本科',
					value: 'BACHELOR'
				},{
					text: '专科',
					value: 'JUNIOR_COLLEGE'
				},{
					text: '其他',
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
					work_position_list: {
						rules: [{
								format: 'array'
							},
							{
								validateFunction: (rule, value, data, callback) => {
									const { work_position_list,other_work_position } = this.formData
									if (!work_position_list.length && !other_work_position) {
										callback('请选择从业岗位')
									}
									return true
								}
							}
						]
					},
					work_type_list: {
						rules: [{
								format: 'array'
							},
							{
								validateFunction: (rule, value, data, callback) => {
									const { work_type_list,other_work_type } = this.formData
									if (!work_type_list.length && !other_work_type) {
										callback('请选择从业领域')
									}
									return true
								}
							}
						]
					},
					date_list: {
						rules: [{
								format: 'array'
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (!value.length) {
										callback('请选择从业时间')
									}
									return true
								}
							}
						]
					},
					education: {
						rules: [{
							required: true,
							errorMessage: '请选择学历',
						}]
					},
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

				},
				formData: {
					"visaList": [{
						"date_list": [],
						"qzgj": "",
						
					}],
					"date_list": [], // 从业时间
					"work_start_date": "", // 从业开始时间
					"work_end_date": "", // 从业结束时间
					
					"yxgzcs": "", // 优选工作城市
					"csny":"", // 出生年月
					
					"name": "", // 姓名
					"sex": "MALE",  // 性别
					"phone": "", // 手机号
					"email": "", // 邮箱
					
					"education": "", // 学历
					"work_type_list": [], // 从业领域
					"other_work_type": '', // 
					"work_position_list": [
					  {
						"id": "1-1-4",
						// "name": "CATIA",
						// "user": true,
						// "bx": 0,
						// "qx": 0,
						// "path": [
						//   {
						// 	"id": "1",
						// 	"name": "机械设计",
						// 	"user": false,
						// 	"bx": 0,
						// 	"qx": 0
						//   },
						//   {
						// 	"id": "1-1",
						// 	"name": "擅长软件",
						// 	"user": false,
						// 	"qx": 0,
						// 	"bx": 0
						//   }
						// ]
					  },
					  {
						// "id": "1-1-5",
						"name": "3ds Max",
						// "user": true,
						// "bx": 0,
						// "qx": 0,
						// "path": [
						//   {
						// 	"id": "1",
						// 	"name": "机械设计",
						// 	"user": false,
						// 	"bx": 0,
						// 	"qx": 0
						//   },
						//   {
						// 	"id": "1-1",
						// 	"name": "擅长软件",
						// 	"user": false,
						// 	"qx": 0,
						// 	"bx": 0
						//   }
						// ]
					  }
					] , // 从业岗位
					"other_work_position": '', // 其它岗位
					"openid": "", // 用户微信唯一id
				},
			}
		},
		computed: {
			workTypeLabel() {
				const { work_type_list } = this.formData
				return work_type_list.map(item => item.name)
			},
		    workPositionLabel() {
				const { work_position_list } = this.formData
				return work_position_list.map(item => item.name)
		    }
		  },
		onLoad(){
		},
		methods: {
			onDelVisa(idx) {
				this.formData.visaList.splice(idx, 1)
			},
			onAddVisa() {
				console.log('------', this.formData)
				this.formData.visaList.push({
					qzgj: "",
					date_list: [],
				})
			},
			onSave() {
				// https://gtq.dairoot.cn/user/user-worker-info
				
				// {
				// 	 "name": "n2a123me",
				// 	 "openid": "openweiqwed",
				// 	 "sex": "MALE",
				// 	 "phone": "12345678901",
				// 	 "education": "education",
				// 	 "work_start_date": "2015-02-10",
				// 	 "work_end_date": "2015-01-11",
				// 	 "email": "xxx@11.com",
				// 	 "other_work_type": "xwork_atype",
				// 	 "other_work_position": "work_position",
					
					
				// 	"work_type_list": [],
				// 	"work_position_list": [].
				// }
				this.$refs.form.validate((err, formDate) => {
					console.log(err,formDate)
					if (!err) {
						console.log(err,formDate)
						this.getUserInfoMethods((openidInfo) => {
							console.log(openidInfo)
							if (!(openidInfo.data && openidInfo.data.openid)) {
								uni.showToast({
									icon: 'none',
									duration: 3000,
									title: openidInfo
								});
								return 
							}
							const {name,sex,phone,email,date_list,education,work_type_list,other_work_type,work_position_list,other_work_position} = this.formData
							const [work_start_date,work_end_date] = date_list
							
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
							}
							if(work_position_list.length) {
								postData.work_position_list = work_position_list.map(item => item.id)
							}
							uni.showLoading()
							uni.request({
								url: "https://gtq.dairoot.cn/user/user-worker-info",
								method: "POST",
								data: postData,
								header: {
									'content-type': 'application/json', // 默认值
								},
							}).then((res) => {
								uni.hideLoading()
								// 此处的 res 参数，与使用默认方式调用时 success 回调中的 res 参数一致
								if (res.statusCode === 200) {
									uni.showToast({
										icon: 'none',
										duration: 3000,
										title: '提交成功'
									});
								} else {
									uni.showToast({
										icon: 'none',
										duration: 3000,
										title: JSON.stringify(res.data)
									});
								}
								console.log(res)
								console.log(res.data);
							
							  })
							  .catch((err) => {
								uni.hideLoading()
								// 此处的 err 参数，与使用默认方式调用时 fail 回调中的 err 参数一致
								console.error(err);
							  })
						})
					}
				})
			},
			onConfirmWorkPosition(val) {
				console.log(val)
				this.formData.work_position_list = val
				this.$refs.workPosition.close()
			},
			onConfirmWorkType(val) {
				console.log(val)
				this.formData.work_type_list = val
				this.$refs.workType.close()
			},
			onShowWorkPosition() {
				this.$refs.workPosition.open()
			},
			onShowWorkType() {
				this.$refs.workType.open()
			},
			getUserInfoMethods(callBack) {
				uni.login({
					timeout: 6000,
					success: (res) => {
						console.log('success:login方法返回的值：', res)
						if (res.code) {
							uni.showLoading()
							uni.request({
							  url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx1298b5933a8df337&secret=05d62f57e2268e30df0de1a6942982a1&js_code=${res.code}&grant_type=authorization_code`,
							})
							.then((res) => {
								uni.hideLoading()
							    callBack&&callBack(res)
							})
							.catch((err) => {
								uni.hideLoading()
								callBack&&callBack(err)
							});
						} else {
						  console.log('登录失败！' + res.errMsg)
						  callBack&&callBack(res.errMsg)
						}
					},
					fail(err) {
						console.log('fail:login方法返回错误：', err)
						callBack&&callBack(err)
					}
				})
			}
		}
	}
</script>

<style>
	.visa-add {
		margin-top: 12rpx;
	}
	.visa-item .visa-validity {
		width: 230px;
	}
	.visa-item .visa-country {
		width: 120rpx;
	}
	.visa-list .visa-item {
		display: flex;
		flex-direction: row;
	}
	.container {
		padding: 15px;
		background-color: #fff;
	}
	.other-input .uni-easyinput-error {
		color: #999!important;
		border-color: yellow!important;
	}
	.work-position-tag {
		margin-right: 12px;
	}
	.work-position-label-placeholder {
		color: #999;
	}
	.other-type {
		display: flex;
		align-items: center;
	}
	.other-label {
		margin-right: 12px;
	}
	.other-work-label {
		/* margin-top: 6px; */
	}
	.other-position-label {
		margin-top:6px;
	}
	.other-input {
		width: 160px;
		border-bottom: 1px solid #ddd;
		padding: 8px 6px;
	}
	.save-btn {
		margin-top: 70px;
	}
</style>
