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
							<input type="text" v-model="formData.other_work_type" placeholder="请输入其它岗位" />
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
							<input type="text" v-model="formData.other_work_position" placeholder="请输入其它岗位" />
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
			<tree  :checkList="formData.work_type_list"  v-if="workTypeOpt.length>0"  :options="{
				label: 'name',
				children: 'children',
				multiple:true,
				checkStrictly:true
			}" @sendValue="confirm"  :isCheck="true" :treeNone="workTypeOpt"></tree>
		</uni-popup>
		<!-- 从业领域 end -->
		
		<!-- 从业岗位 start -->
		<uni-popup ref="workPosition" type="bottom" safeArea backgroundColor="#fff">
			<tree  :checkList="formData.work_position_list"  v-if="workPositionOpt.length>0"  :options="{
				label: 'name',
				children: 'children',
				multiple:true,
				checkStrictly:true
			}" @sendValue="confirm"  :isCheck="true" :treeNone="workPositionOpt"></tree>
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
				workTypeOpt: [],
				workPositionOpt: [
					{
						id: '1',
						name: "机械设计",
						user: false,
						children: [{
							id: '1-1',
							name: "pre1",
							user: true
						},{
							id: '1-2',
							name: "pre2",
							user: true
						}]
					},
					{
						id: '2',
						name: "视觉",
						user: false,
						children: [{
							id: '2-1',
							name: "PS1",
							user: true
						},{
							id: '2-2',
							name: "PS2",
							user: true
						},{
							id: '2-3',
							name: "PS3",
							user: true
						},{
							id: '2-4',
							name: "PS4",
							user: true
						},{
							id: '2-5',
							name: "PS5",
							user: true
						},{
							id: '2-6',
							name: "PS6",
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
					"work_position_list": [] , // 从业岗位
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
			confirm(val) {
				console.log(val)
				this.formData.work_position = val
				this.$refs.popup.close()
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
