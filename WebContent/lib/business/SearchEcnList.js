
Ext.define("Pcbms.business.SearchEcnList", {
	extend : "Ext.grid.Panel",
	alias : "widget.ecngrid",
	statusData : [[0, "作废"], [1, "初始化"], [2, "生效"]],
	initComponent : function() {
		var storeid = "ecnListStore";
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
					model : "Ecn",
					storeId : storeid,
					proxy : Pcbms.ajaxProxy("/ecnAction!searchECNList.action")
				});
		Ext.applyIf(me, {
			columns : [{
						header : "Ecn编号",
						width : 70,
						dataIndex : "ecnid"
					}, {
						header : "状态",
						width : 60,
						dataIndex : "status",
						renderer:function(v){
							for(var i in me.statusData){
								if(v==me.statusData[i][0]){
									return me.statusData[i][1];
								}
							}
						}
					}, {
						header : "工程编号",
						width : 80,
						renderer : showDetial('pt').renderer,
						dataIndex : "xbcbh"
					}, {
						header : "原工程编号",
						width : 80,
						dataIndex : "ybcbh"
					}, {
						header : "处理人",
						width : 80,
						dataIndex : "operatorname"
					}, {
						header : "创建时间",
						width : 80,
						renderer : Ext.util.Format.dateRenderer("m-d H:i"),
						dataIndex : "createtime"
					}, {
						header : "更改内容",
						flex : 1,
						dataIndex : "ggnr"
					}, {
						header : "备注",
						flex : 1,
						dataIndex : "note"
					}],

			tbar : [{
				xtype : "buttongroup",
				title : "操作",
				// height : 80,
				columns : 3,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '删除',
					iconCls:"delete",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										url : "/ecnAction!removeECN.action?ecn.ecnid="
												+ s[0].get("ecnid")
												+ "&ecn.xbcbh="
												+ s[0].get("xbcbh"),
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
				}]
			}, "->", {
				xtype : "searchbg",
				items : [{
							xtype : "idcombo",
							fieldLabel : "Ecn编号",
							labelAlign : "right",
							labelWidth : 60,
							type : 0,
							name : "ecn.ecnid"
						}, {
							xtype : "textfield",
							fieldLabel : "工程编号",
							labelAlign : "right",
							labelWidth : 60,
							name : "ecn.bcbh"
						}, Pcbms.searchbtn("查询", storeid, 'small'), {
							xtype : "combobox",
							store : this.statusData,
							fieldLabel : "状态",
							labelAlign : "right",
							labelWidth : 60,
							value : 1,
							name : "ecn.status"
						}]
			}],
			bbar : Ext.create("Ext.PagingToolbar", {
						store : this.store,
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