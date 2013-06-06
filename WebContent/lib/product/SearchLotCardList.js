Ext.define("Pcbms.product.SearchLotCardList", {
	extend : "Ext.grid.Panel",
	alias : "widget.lcgrid",
	statusData : [[-1, "全部"], [0, "初始化"], [1, "工序"]],
	initComponent : function() {
		var me = this;

		var storeid = me.storeid ? me.storeid : "wbListStore";

		me.store = Ext.create("Ext.data.Store", {
			model : "LotCard",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/lotCardManagementAction!searchLOTCardList.action")
		});

		Ext.applyIf(me, {
			columns : [{
						header : "工作板编号",
						renderer : showDetial('wb').renderer,
						flex : 1,
						dataIndex : "wbid"
					}, {
						header : "lot卡号",
						renderer : showDetial('lot').renderer,
						flex : 1,
						dataIndex : "lotid"
					}, {
						header : "Panel数量",
						width : 70,
						dataIndex : "num"
					}, {
						header : "优先级",
						width : 60,
						dataIndex : "gzkyxj"
					}, {
						header : "投料时间",
						width : 80,
						renderer : Ext.util.Format.dateRenderer("m-d H:i"),
						dataIndex : "createtime"
					}, {
						header : "所属开料单",
						flex : 1,
						dataIndex : "mid"
					}, {
						header : "交货日期",
						width : 70,
						renderer : Ext.util.Format.dateRenderer("m-d"),
						dataIndex : "jhrq"
					}, {
						header : "当前工序",
						flex : 1,
						dataIndex : "stepname"
					}, {
						header : "管制卡状态",
						flex : 1,
						dataIndex : "status",
						renderer:function(v){
							switch(v){
							case 0:
								return '无效';
							case 1:
								return '有效';
							}
						}
					}],
			tbar : [{
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				// height : 80,
				columns : 3,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '管制卡生产完成',
					iconCls:"ControlCardComplete",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {
							var lotids = [];
							
							for(var i = 0;i<s.length;i++){
								lotids.push(s[i].data["lotid"]);
							}
							
							Ext.Msg.confirm("提示", "确定要该管制卡已完成吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.trequest({
										url : "/lotCardManagementAction!finishLOTCards.action?lotids="
												+ lotids,
												success : function(str) {
													Ext.Msg.alert("提示", str.msg);
													Ext.data.StoreManager
															.lookup(storeid).load();
												},
												failure : function(r) {
													Ext.Msg.alert('出现错误', '原因 <'
																	+ r.msg + ">");
												}
									});

								}
							});

						}
					}
				},{
					text : '打印',
					iconCls: 'print',
					handler:function(b){
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {
							var lotids = [];
							for(var i = 0;i<s.length;i++){
								lotids.push(s[i].data["lotid"]);
							}
							//开始打印数据
							tpmsprinter.print("lotcard",{ids:lotids} );
						}
					}
				}]
			}, "->", {
				xtype : "searchbg",
				items : [{
							xtype : "idcombo",
							type : 8,
							fieldLabel : "Lot卡编号",
							labelAlign : "right",
							labelWidth : 70,
							name : "lotCardDetail.lotid"
						}, {
							xtype : "stepcombo",
							fieldLabel : "所在工序",
							labelAlign : "right",
							labelWidth : 70,
							name : "lotCardDetail.stepid"
						}, Pcbms.searchbtn("查询", storeid, 'small'), {
							xtype : "datefield",
							fieldLabel : "交货日期",
							labelAlign : "right",
							labelWidth : 70,
							name : "lotCardDetail.jhrq"
						}, {
							xtype : 'textfield',
							fieldLabel : '工程编号',
							labelAlign : "right",
							labelWidth : 70,
							flex : 1,
							name : "lotCardDetail.bcbh"
						}, {
							xtype : 'textfield',
							fieldLabel : '工作板编号',
							labelAlign : "right",
							labelWidth : 70,
							flex : 1,
							name : "lotCardDetail.wbid"
						}, {
							xtype : 'pubcombo',
							fieldLabel : '优先级',
							name : 'lotCardDetail.gzkyxj',
							labelWidth : 70,
							labelAlign : 'right',
							type : 11
						}, {
							xtype : 'textfield',
							fieldLabel : '开料单号',
							labelAlign : "right",
							labelWidth : 70,
							flex : 1,
							name : "lotCardDetail.mid"
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