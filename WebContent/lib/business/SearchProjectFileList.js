Ext.define("Pcbms.business.SearchProjectFileList", {
	extend : "Ext.grid.Panel",
	alias : "widget.ptgrid",
	statusData : [[0, "作废"], [1, "初始化"], [2, "生效"]],
	plugins : [{
		ptype : 'rowexpander',
		rowBodyTpl : [
				'<p><b style="margin:0 0 0 50px">备注信息:</b>{ptnote}</p>']
	}],
	initComponent : function() {
		var storeid = "ptListStore";
		var me = this;

		me.store = Ext.create("Ext.data.Store", {
			model : "ProjectFile",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/projectFileAction!searchProjectFileList.action")
		});

		Ext.applyIf(me, {
			columns : [{
						header : "所属客户",
						width : 90,
						dataIndex : "clientname"
					}, {
						header : "工程编号",
						flex : 1,
						renderer : showDetial('pt').renderer,
						dataIndex : "bcbh"
					}, {
						header : "文件名称",
						flex : 1,
						dataIndex : "projectName"
					}, {
						header : "工程处理",
						width : 80,
						dataIndex : "operatorname",
						renderer:function(v){
							if(v!=null && v != ""){
								return "<a href='javascript:downFile(\"/downloadAction!downloadBCBHDataFile.action?bcbh=" + r.data["bcbh"] + "\");' title='工程文件下载!'>" + v + "</a>";
							}
							return "<span style=\"color:red\">暂未处理</span>"
						}
					}, {
						header : "状态",
						width : 60,
						dataIndex : "status",
						renderer : function(v) {
							for (var i = 0; i < this.statusData.length; i++) {

								if (v == this.statusData[i][0]) {
									return this.statusData[i][1];
								}
							}
							return "异常状态";
						}
					}, {
						header : "录入",
						width : 80,
						dataIndex:"creatorname"
					},{
						header:"层数",
						width : 60,
						dataIndex : 'cs'
					},{
						header : "PCS尺寸(mm)",
						width : 120,
						flex : 1,
						renderer : Pcbms.ProjectSizeRenderer
					},{
						header:"外层铜厚",
						width : 80,
						dataIndex : 'wcth'
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
					text : '修改',
					iconCls:"modify",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							deferLoading(me);

							if (!me.updWindow) {
								me.updForm = Ext.create(
										"Pcbms.product.UpdProjectFile", {
											width : "100%",
											autoScroll : true,
											height : "100%"
										});
								me.updWindow = Ext.create("Ext.window.Window",
										{
											width : 900,
											height : 600,
											modal : true,
											layout : "fit",
											title : '产品型号修改',
											closeAction : "hide",
											items : me.updForm
										});
							}

							// 加载型号数据
							Ext.Ajax.request({
								url : "/projectFileAction!searchProjectFileByBcbh.action?flagForUpdate=1&projectFile.bcbh="
										+ s[0].get("bcbh"),
								success : new Pcbms.ajaxHandler({
											success : function(str) {
												me.updWindow.show();
												me.updForm
														.loadData(str.projectFile);

											},
											error : function(r) {
												Ext.Msg.alert('出现错误', '原因 <'
																+ r.msg + ">");
											}
										})
							});
						}

					}

				},{
					text : '删除',
					iconCls:"delete",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										url : "/projectFileAction!removeProjectFile.action?projectFile.bcbh="
												+ s[0].get("bcbh"),
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
					text : '作废',
					iconCls:"invalid",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要作废选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										url : "/projectFileAction!voidProcuctType.action?projectFile.bcbh="
												+ s[0].get("bcbh"),
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
				title : "查询",
				columns : 3,
				defaults : {
					scale : "larger"
				},
				items : [{
							xtype : "textfield",
							fieldLabel : "工程编号",
							labelAlign : "right",
							labelWidth : 60,
							name : "projectFile.bcbh"
						}, {
							xtype : 'textfield',
							fieldLabel : '客户编号',
							labelWidth : 60,
							labelAlign : "right",
							itemId : 'clientid',
							name : 'projectFile.clientid',
							flex : 1,
							readOnly : true,
							listeners : {
								focus : function() {
									if (!this.clientWindow) {
										this.clientWindow = Ext.create(
												"Ext.window.Window", {
													width : 750,
													closeAction : 'hide',
													height : 300,
													title : '客户选择',
													modal : true,
													layout : 'fit',
													items : [{
																xtype : "clientgrid",
																target : this
															}]
												});

									}

									this.clientWindow.show();

								}
							}
						}, Pcbms.searchbtn("查询", storeid, 'small'), {
							xtype : "textfield",
							fieldLabel : "文件名称",
							labelAlign : "right",
							labelWidth : 60,
							name : "projectFile.projectName"
						}, {
							xtype : "combobox",
							store : this.statusData,
							fieldLabel : "状态",
							itemId : 'status',
							labelAlign : "right",
							labelWidth : 60,
							value : 1,
							name : "projectFile.status"
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