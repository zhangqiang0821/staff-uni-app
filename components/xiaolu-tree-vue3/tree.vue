<template>
	<view>
		<view class="header">
			<search v-if="searchIf" ref="searchRef" @confirm="confirmSearch" />
			<view class="title">
				<scroll-view scroll-x style="width: 100%;white-space: nowrap;" :scroll-left="scrollLeft">
					<view v-for="(item,index) in tree_stack" class="inline-item" :key="index">
						<view class="inline-item" v-if="index==0" @click="backTree(item,-1)">
							<text :class="[(isActive(index)&&!isre)?'none':'active']">全部</text>
						</view>
						<view v-if="index==0&&isre" @click="backTree(item,-2)"
							:class="[(index==tree_stack.length-1&&isre)?'none':'active','inline-item']">
							<i class="iconfont icon-z043 iconclass" />
							搜索结果
						</view>
						<view class="inline-item" @click="backTree(item,index)" v-if="index!=0">
							<i class="iconfont icon-z043 iconclass" />
							<text :class="isActive(index)?'none inline-ite':'active'">
								{{item[props.options.label]}}
							</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view>
			<view class="container-list">
				<view class="common" v-for="(item, index) in tree" @click="handleClick(item,index)" :key="index">
					<label class="content">
						<view class="list-item" v-show="isCheck">
							<!-- 多选 -->
							<view class="checkbox" v-if="props.options.multiple" @click.stop="handleClick(item,-1)">
								<span v-if="isSelect(item)">
									<i v-if="item.bx&&newCheckList.length!=0"
										class="iconfont icon-banxuanzhongshousuo1-shi icons" />
									<i v-else class="iconfont icon-xuanzhong txt icon-selected" />
								</span>
								<i v-else-if="item.qx" class="iconfont icon-xuanzhong txt icon-selected" />
								<i v-else-if="item.bx" class="iconfont icon-banxuanzhongshousuo1-shi icons" />
								<i style="color: #b8b8b8;" v-else class="iconfont icon-weixuanzhong txt" />
							</view>
							<!-- 单选 -->
							<view class="checkbox" v-else-if="(props.options.nodes?item.user?true:false:true)"
								@click.stop="handleClick(item,-1)">
								<i v-if="radioSelect(item)" class="txt iconfont icon-selected" />
								<i style="color: #b8b8b8;" v-else class="txt iconfont icon-weixuanzhong1" />
							</view>
						</view>
						<view class="lable-text">{{item[props.options.label]}}</view>
						<view class="right"><i v-if="!item.user&&item.children.length>0"
								class="iconfont icon-z043 iconclass"></i></view>
					</label>
				</view>
			</view>
		</view>
		<view class="btn box_sizing">
			<button class="sureBtn" type="primary" @click="backConfirm">确认</button>
		</view>
	</view>
</template>

<script setup>
	import search from './search/index.vue'
	import {
		ref,
		reactive,
		defineProps,
		computed,
		nextTick,defineEmits
	} from 'vue'
	const props = defineProps({
		treeNone: {
			type: Array,
			default: () => {
				return []
			}
		},
		checkList: {
			type: Array,
			default: () => {
				return []
			}
		},
		keyValue: {
			type: String,
			default: 'id'
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
					label: 'name',
					children: 'children',
					multiple: false,
					checkStrictly: false //不关联
				}
			}
		}
	})
	
	const catchTreeNone = JSON.parse(JSON.stringify(props.treeNone)),
		tree = ref(props.treeNone),
		newCheckList = ref(props.checkList),
		tree_stack = ref([1]),
		nodePathArray = ref([]),
		searchResult = ref([]),
		scrollLeft = ref(999),
		oldNum = ref(0),
		newNum = ref(0),
		isre = ref(false),
		searchRef = ref(null);
	const emit = defineEmits(['sendValue'])
	// 初始化
	const initComponent = () => {
		if (newCheckList.value.length !== 0) {
			if (props.options.multiple) {
				if (props.options.checkStrictly) {
					checkAllChoose();
				}
			} else {
				getNodeRoute(catchTreeNone, newCheckList.value[0][props.keyValue])
				let arr = nodePathArray.value.reverse()
				if (arr.length == 0) return
				tree_stack.value = tree_stack.value.concat(arr);
				tree.value = tree_stack.value[tree_stack.value.length - 1].children;
			}
		}
		console.log(props.options)
	}
	initComponent()
	// (tree为目标树，targetId为目标节点id)
	function getNodeRoute(tree, targetId) {
		for (let index = 0; index < tree.length; index++) {
			if (tree[index].children) {
				let endRecursiveLoop = getNodeRoute(tree[index].children, targetId)
				if (endRecursiveLoop) {
					nodePathArray.value.push(tree[index])
					return true
				}
			}
			if (tree[index][props.keyValue] === targetId) {
				return true
			}
		}
	}

	const radioSelect = computed(() => {
		return (item) => {
			const list = newCheckList.value
			return list.length > 0 && item[props.keyValue] == list[0][props.keyValue]
		}
	})
	const isActive = computed(() => {
		return (index) => {
			return index === tree_stack.value.length - 1
		}
	})
	const isSelect = computed(() => {
		return (item) => {
			const checkList = newCheckList.value
			if (checkList.length == 0) {
				props.options.checkStrictly ? (item.bx = 0, item.qx = 0) : ''
				return false
			}
			const i = checkList.findIndex(e => {
				return item[props.keyValue] == e[props.keyValue]
			}) > -1
			return i && !item.qx
		}
	})
	//到下一级
	function toChildren(item) {
		if (item.user) return
		uni.showLoading({
			title: '加载中'
		})
		let children = props.options.children;
		if (!item.user && item[children].length > 0 && !(tree_stack.value[0][props.keyValue] == item[props.keyValue])) {
			tree.value = item[children];
			tree_stack.value.push(item);
		}
		nextTick(() => {
			uni.hideLoading()
			scrollLeft.value += 200;
		})
		if (props.options.checkStrictly) checkAllChoose();
	}

	function computAllNumber(arr) {
		for (let j = 0; j < arr.length; j++) {
			var e = arr[j];
			checkSum(e[props.keyValue])
			if (e.user) {
				newNum.value++;
			} else {
				computAllNumber(e.children)
			}
		}
	}

	function checkSum(id) {
		for (let i = 0; i < newCheckList.value.length; i++) {
			if (id == newCheckList.value[i][props.keyValue]) {
				oldNum.value++;
				break
			}
		}
	}

	function checkAllChoose() {
		let o = false,
			t = true;
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
					tree.value[i].bx = o
					tree.value[i].qx = o
				}
				newNum.value = 0
				oldNum.value = 0
			}
		})
	}

	//单选
	function checkbox(item, index) {
		const path = getPath()
		newCheckList.value = [{
			...item,
			path
		}]
	}
	// 获取路径
	function getPath() {
		const path = [...tree_stack.value].map(e => {
			const item = Object.assign({}, e)
			delete item[props.options.children]
			return item
		})
		return path.slice(1, path.length) || []
	}
	// 取消下一级的选中
	function getIdBydelete(arr) {
		arr.forEach(e => {
			if (e.user) {
				for (var i = 0; i < newCheckList.value.length; i++) {
					if (e[props.keyValue] == newCheckList.value[i][props.keyValue]) {
						newCheckList.value.splice(i, 1)
						break;
					}
				}
			} else {
				getIdBydelete(e.children)
			}
		})
	}

	function checkboxChange(item, index, bx, qx) {
		const options = props.options
		if (!options.multiple) return;
		let findIdex = newCheckList.value.findIndex(e => item[props.keyValue] == e[props.keyValue]);
		const path = getPath();
		if (findIdex > -1) { //反选
			if (options.checkStrictly) { //关联子级
				if (item.user) { //用户
					newCheckList.value.splice(findIdex, 1)
				} else { //非用户，取消所有下一级
					getIdBydelete(item.children)
				}
			} else {
				newCheckList.value.splice(findIdex, 1)
			}
		} else { //选中
			if (!item.user && options.checkStrictly) { //选中下一级
				if (qx || bx) { //取消下级
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
					} = item
					const newObj = {
						id,
						name,
						user
					}
					const pathList = tree_stack.value.length === 1 ? [newObj, ...path] : [...path, newObj]
					chooseChild(item.children, pathList);
				}
				return
			}
			newCheckList.value.push({
				...item,
				path
			});
		}
	}
	// 关联下一级,选中
	function chooseChild(arr, path) {
		const oldPath = [...path]
		for (var i = 0, len = arr.length; i < len; i++) {
			let item = arr[i];
			if (item.user) {
				newCheckList.value.push({
					...item,
					path: oldPath
				})
			} else {
				const newItem = {
					...item
				}
				delete newItem[props.options.children]
				const newPath = [...oldPath, newItem]
				chooseChild(item.children, newPath)
			}
		}
	}
	//搜索
	function confirmSearch(val) {
		searchResult.value = []
		searchTree(catchTreeNone, val)
		isre.value = true
		tree_stack.value.splice(1, 1000)
		uni.showLoading({
			title: '正在查找'
		})
		setTimeout(() => {
			tree.value = searchResult.value
			uni.hideLoading()
		}, 300)
	}

	function searchTree(data, keyword) {
		let children = props.options.children;
		let label = props.options.label;
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i][label].indexOf(keyword) >= 0) {
				searchResult.value.push(data[i])
			}
			if (!data[i].user && data[i][children].length > 0) {
				searchTree(data[i][children], keyword)
			}
		}
	}


	//返回其它层
	function backTree(item, index) {
		let max = 300;
		if (index === -1) {
			tree.value = catchTreeNone
			tree_stack.value.splice(1, max)
			console.log(tree.value)
			isre.value = false
			// searchRef.value.clears()
		} else if (index === -2) { //搜索
			tree.value = searchResult.value
			tree_stack.value.splice(1, max)
		} else {
			if (tree_stack.value.length - index > 2) {
				tree_stack.value.splice(index + 1, max)
			} else if (index !== tree_stack.value.length - 1) {
				tree_stack.value.splice(tree_stack.value.length - 1, 1)
			}
			tree.value = item[props.options.children]
		}
		if (props.options.checkStrictly) checkAllChoose();
	}

	function backConfirm() {
		emit('sendValue',newCheckList.value,'back')
	}
	const handleClick = (item, index) => {
		let children = item[props.options.children]
		if (index > -1 && children && children.length > 0) {
			toChildren(item)
		} else if (props.options.multiple) {
			checkboxChange(item, index, item.bx, item.qx)
		} else {
			checkbox(item, index)
		}
	}
</script>
<style lang="scss" scoped>
	@import './css/style.scss';
	@import url("./css/icon.css");
</style>