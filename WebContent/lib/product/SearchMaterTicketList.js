Ext.define("Pcbms.product.SearchMaterTicketList", {
	extend : "Ext.grid.Panel",
	alias : "widget.mtgrid",
	statusData : [[0, "作废"], [1, "生效"]],
	initComponent : function() {
		var me = this;
		 var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		        groupHeaderTpl: '按A工作版的分组共 ({rows.length})个开料单'
		});
		var storeid = me.storeid ? me.storeid : "mtListStore";
		me.store = Ext.create("Ext.data.Store", {
			model : "MaterTicket",
			storeId : storeid,
			groupField: 'awbid',
			proxy : Pcbms.ajaxProxy("/materialTicketAction!searchMaterialTicketList.action")
		});

		Ext.applyIf(me, {
			features: [groupingFeature],
			columns : [{
						header : "开料单编号",
						renderer : showDetial('mt').renderer,
						width:70,
						dataIndex : "mid"
					}, {
						header : "创建",
						dataIndex : "creatorname",
						width:80
					},{
						header : "创建时间",
						dataIndex : "createtime",
						width: 80,
						renderer: Ext.util.Format.dateRenderer('m-d H:i')
					},{
						header : "A板信息",
						flex : 1,
						renderer : function(v, m, r) {
							return "<a style='color:blue;' onclick='showDetial(\"wb\").wb(\"" + r.data["awbid"] + "\")'>" + r.data["awbid"] + "</a> #<span style='color:red'>" + r.data["anum"] + "</span>";
						}
					}, {
						header : "B板信息",
						flex : 1,
						renderer : function(v, m, r) {
							if(r.data["bwbid"] != null && r.data["bwbid"]!= ""){
								return "<a style='color:blue;' onclick='showDetial(\"wb\").wb(\"" + r.data["bwbid"] + "\")'>" + r.data["bwbid"] + "</a> #<span style='color:red'>" + r.data["bnum"] + "</span>";
							}
						}
					}, {
						header : "C板信息",
						flex : 1,
						renderer : function(v, m, r) {
							if(r.data["cwbid"] != null && r.data["cwbid"]!= ""){
								return "<a style='color:blue;' onclick='showDetial(\"wb\").wb(\"" + r.data["cwbid"] + "\")'>" + r.data["cwbid"] + "</a> #<span style='color:red'>" + r.data["cnum"] + "</span>";
							}
						}
					}, {
						header : "投料数量",
						width : 60,
						dataIndex : "tlnum"
					}, {
						header : "板材材料",
						width : 70,
						dataIndex : "bccl"
					}, {
						header : "板厚",
						width : 70,
						dataIndex : "bh"
					}, {
						header : "板材型号",
						width : 70,
						dataIndex : "bcxh"
					},{
						header : "投料人",
						width : 70,
						dataIndex : 'tlperson'
					},{
						header : "投料时间",
						width : 80,
						dataIndex : 'tltime',
						renderer: Ext.util.Format.dateRenderer('m-d H:i')
					}],

			tbar : [{
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				// height : 80,
				columns : 4,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '修改',
					iconCls : "modify",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							deferLoading(me);
							if (!me.updWindow) {
								me.updForm = Ext.create(
										"Pcbms.product.UpdMaterialTicket", {
											width : "100%",
											title : '',
											target : me,
											height : "100%"
										});
								me.updWindow = Ext.create("Ext.window.Window",
										{
											width : 900,
											height : 600,
											layout : "fit",
											modal : true,
											title : '修改开料单',
											closeAction : "hide",
											// buttons : [{
											// text : '提交',
											// handler : function(){
											// me.updForm.submitForm(me);
											// }
											// }],
											items : me.updForm
										});
							}
							// 加载型号数据
							Ext.Ajax.request({
								url : "/materialTicketAction!searchMaterialTicket.action?flagForUpdate=1&materialTicket.mid="
										+ s[0].get("mid"),
								success : new Pcbms.ajaxHandler({
									success : function(str) {
										me.updWindow.show();
										me.updForm.mid = s[0].get("mid");
										me.updForm.loadData(str.materialTicket);
									},
									error : function(r) {
										Ext.Msg.alert('出现错误', '原因 <' + r.msg
														+ ">");
									}
								})
							});
						}

					}

				}, {
					text : '删除',
					iconCls : "delete",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										url : "/materialTicketAction!removeMaterialTicket.action?materialTicket.mid="
												+ s[0].get("mid"),
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												Ext.Msg.alert("提示", str.msg);
												Ext.data.StoreManager
														.lookup(storeid).load();
											},
											error : function(r) {
												Ext.Msg.alert('出现错误', '原因 <'
																+ r.msg + ">");
											}
										})
									});

								}
							});

						}
					}
				}, {
					text : '投料',
					iconCls : "castmaterial",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {
							var cdmp = {wbids:[],mtids:[]};
							for(var i=0;i<s.length;i+=1){
								if(s[i].get("tltime") > 0){
									Ext.Msg.alert("选择错误","你选择的开料单已经投过料,请不要重复操作!");
									return;
								}
								cdmp.mtids.push(s[i].get("mid"));
								var wbid = s[i].get("awbid");
								if(wbid == ""){
									continue;
								}
								if(typeof cdmp[wbid] != 'number'){
									if(!Ext.Array.contains(cdmp.wbids,wbid)){
										cdmp.wbids.push(wbid);
									}
									cdmp[wbid] = s[i].get("anum");
								}else{
									cdmp[wbid] += s[i].get("anum");
								}
								wbid = s[i].get("bwbid");
								if(wbid == ""){
									continue;
								}
								if(typeof cdmp[wbid] != 'number'){
									if(!Ext.Array.contains(cdmp.wbids,wbid)){
										cdmp.wbids.push(wbid);
									}
									cdmp[wbid] = s[i].get("bnum");
								}else{
									cdmp[wbid] += s[i].get("bnum");
								}
								wbid = s[i].get("cwbid");
								if(wbid == ""){
									continue;
								}
								if(typeof cdmp[wbid] != 'number'){
									if(!Ext.Array.contains(cdmp.wbids,wbid)){
										cdmp.wbids.push(wbid);
									}
									cdmp[wbid] = s[i].get("cnum");
								}else{
									cdmp[wbid] += s[i].get("cnum");
								}
								
							}
							if(cdmp.wbids.length > 3){
								Ext.Msg.alert("选择错误","你一次处理的开料款数过多!请不要对于3款!");
								return;
							}
							//每次显示的window 都是不一样的
							var witems = [];
							for(var i=0;i<cdmp.wbids.length;i+=1){
								var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
									clicksToEdit : 1
								});
								var tnum = cdmp[cdmp.wbids[i]];
								witems.push({
									xtype : 'fieldset',
									title : "#" + cdmp.wbids[i],
									allowBlank : false,
									margin :2,
									flex: 1,
									defaults:{
										anchor:"90%",
										readOnly : true,
										xtype : "textfield"
									},
									autoScroll : true,
									items:[
{
fieldLabel : '工作板编号',
value:cdmp.wbids[i]
},{
xtype : "textfield",
fieldLabel : '总投料数量',
value:tnum
},{
xtype : "numberfield",
fieldLabel : '管制卡panel数量',
value : tnum,
maxValue :tnum,
minValue : 1,
storeId : "touliao_" + i,
readOnly : false,
listeners : {
	"change" : function(b, newValue){
		//首先检查不能大于一个数量 
		if(typeof newValue == "number"){
			var store = Ext.data.StoreManager.lookup(b.storeId);
			store.removeAll();
			var yu = b.maxValue % newValue;
			store.insert(0, {num : yu + newValue});
			for (var i = 1; i < ( b.maxValue - yu) / newValue; i++) {
				store.insert(0, {num : newValue});
			}
		}
	}
}
},{
xtype:"gridpanel",
anchor:"99% -110",
store: Ext.create("Ext.data.ArrayStore", {
	storeId : "touliao_" + i,
	autoDestroy: true,
	fields : [{name:'num',type:'int'}],
	data:[[tnum]]
}),
cellEditing : cellEditing,
plugins : [cellEditing],
columns : [{
	header : "管制卡名称",
	flex : 1,
	renderer : function(v, m, r, i) {
		return "管制卡" + (i + 1);
	}
}, {
	header : "数量",
	flex : 1,
	dataIndex : "num",
	editor : {
		xtype : 'numberfield',
		allowBlank : false,
		minValue : 1,
		maxValue : tnum
	}
}]
}
									]
								});
							}
							me.getWindow = Ext.create("Ext.window.Window",{
								width : 300 * cdmp.wbids.length,
								height : 500,
								layout: {
							        type: 'hbox',
							        align: 'stretch'
							    },
								modal : true,
								title : '组合投料',
								closeAction : "hide",
								items: witems,
								buttons : [{
									text : '确定',
									handler : function() {
										me.getWindow
												.setLoading("正在提交,请稍等..");
										for(var i=0;i<cdmp.wbids.length;i++){
											var c = 'abcdef'.charAt(i);
											var store = Ext.data.StoreManager.lookup("touliao_" + i);
											var numlist = [];
											store.each(function(r){
												numlist.push(r.get("num"));
											});
											cdmp["tlbean." + c + "wbNumStr"] = numlist;
											cdmp["tlbean." + c + "wbid"] = cdmp.wbids[i];
										}
										Ext.Ajax.request({
											url : "/materialTicketAction!touliaoMaterialTicket.action",
											params : cdmp,
											success : new Pcbms.ajaxHandler(
													{
														success : function(
																str) {
															me.getWindow
																	.setLoading(false);
															//打印管制卡 
															me.getWindow.close();
															Ext.Msg.confirm("提示", '投料成功,是否需要打印开料单', function(v) {
																		if (v == 'yes') {
																			tpmsprinter.print("cutting", {
																							ids : cdmp.mtids
																						});
																		}
																		Ext.Msg.confirm("提示", '投料成功,是否需要打印管制卡', function(v) {
																					if (v == 'yes') {
																						tpmsprinter.print("lotcard", {
																									ids : str.lotids
																								});
																					}
																				});

																	});
														},
														error : function(
																r) {
															
															Ext.Msg
																	.alert(
																			'出现错误',
																			'原因 <'
																					+ r.msg
																					+ ">");
															me.getWindow
															.setLoading(false);
														}
													})
										});
										
										
									}
								}]
							});
							me.getWindow.show();
						}
					}
				}, {
					text : '打印',
					iconCls : "print",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {
							var mids = [];

							for (var i = 0; i < s.length; i++) {
								mids.push(s[i].data["mid"]);
							}
							// 开始打印数据
							tpmsprinter.print("cutting", {
										ids : mids
									});
						}
					}
				}]
			}, "->", {
				xtype : "searchbg",
				title : "查询",
				itemId : 'sbg',
						items : [ {
							xtype : "combobox",
							store : [[-1, '全部'],[0, '待开料'], [1, '已开完']],
							fieldLabel : "状态",
							value : 0,
							labelAlign : "right",
							labelWidth : 60,
							name : "materialTicket.tltime"
						}, {
							xtype : "idcombo",
							type : 3,
							fieldLabel : '工作板编号',
							labelAlign : "right",
							labelWidth : 70,
							name : "materialTicket.wbid"
						}, Pcbms.searchbtn("查询", storeid, 'small'),{
							xtype : "idcombo",
							type : 4,
							fieldLabel : '开料单号',
							labelAlign : "right",
							labelWidth : 60,
							name : "materialTicket.mid"
						}, {
							xtype : 'empcombo',
							fieldLabel : '创建人',
							labelAlign : "right",
							itemId : 'creator',
							name : 'materialTicket.creator',
							cn : 'lockedperson',
							labelWidth : 55,
							flex : 1
						}, {
							xtype : "combobox",
							store : [[-1, '全部'], [1, '是'], [0, '否']],
							fieldLabel : "是否有效",
							value : 0,
							labelAlign : "right",
							labelWidth : 60,
							name : "materialTicket.status"
						}]
			}],
			bbar : Ext.create("Ext.PagingToolbar", {
						store : this.store,
						itemId : 'pagebar',
						displayInfo : true,
						beforePageText : "当前页",
						afterPageText : "总 {0} 页",
						displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
						emptyMsg : " 暂无信息"
					}),
			selModel : Ext.create("Ext.selection.CheckboxModel")

		});

		this.callParent();
	}
});