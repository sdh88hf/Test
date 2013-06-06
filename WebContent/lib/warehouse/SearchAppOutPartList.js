Ext.define("Pcbms.warehouse.SearchAppOutPartList", {
	extend : "Ext.grid.Panel",
	alias : "widget.opartgrid",
	requires : ["Pcbms.warehouse.CreateOutputWindow"],
	statusData : [[0, "初始化"], [1, "完成"]],
	initComponent : function() {
		var storeid = "opListStore";
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
			model : "OutPart",
			groupField: 'apc',
			storeId : storeid,
			autoLoad : true,
			proxy : Pcbms.ajaxProxy("/wareHouseManagementAction!searchDeliveryReq.action")
		});
		me.selectionchange = function(r) {
			var s = r.getSelection();
			if (s.length == 0) {
				return;
			}
			var rid = s[0].get("apc");
			this.removeListener("selectionchange",
					me.selectionchange);
			var ss = [];
			var us = [];
			r.store.each(function(r) {
				if (r.get("apc") == rid) {
					ss.push(r);
				} else {
					us.push(r);
				}
			});
			this.select(ss);
			this.deselect(us);
			this.addListener("selectionchange",
					me.selectionchange);
		};
		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
        	groupHeaderTpl: '地址: {name} ({rows.length} 项)'
    	});
		Ext.applyIf(me, {
			features: [groupingFeature],
			selModel : Ext.create("Ext.selection.CheckboxModel",
					{
				allowDeselect : false,
				listeners : {
					selectionchange : me.selectionchange
				}
			}),
			columns : [{
						header : "申请单编号",
						flex : 1,
						dataIndex : "saleSendId"
					}, {
						header : "工程编号",
						flex : 1,
						dataIndex : "bcbh"
					}, {
						header : "文件名称",
						flex : 1,
						dataIndex : "projectName"
					}, {
						header : "申请出货量",
						flex : 1,
						dataIndex : "qty"
					}, {
						header : "实际库存量",
						flex : 1,
						dataIndex : "num"
					}, {
						header : "合同编号",
						flex : 1,
						dataIndex : "contractid"
					}, {
						header : "申请出货时间",
						flex : 1,
						renderer : Ext.util.Format.dateRenderer("Y-m-d"),
						dataIndex : "deliveryDate"
					}, {
						header : "单价",
						"xtype": "numbercolumn",
						flex : 1,
						dataIndex : "price"
					}, {
						header : "小计",
						"xtype": "numbercolumn",
						flex : 1,
						dataIndex : "je"
					}, {
						header : "出货核审",
						flex : 1,
						dataIndex : "checker"
					}, {
						header : "核审时间",
						flex : 1,
						renderer : Ext.util.Format.dateRenderer("Y-m-d"),
						dataIndex : "checkDate"
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
									text : '创建出库单',
									iconCls:"ShipmentsListAdd",
									handler : function(b) {

										var s = checkGridSelect(b
														.up("gridpanel"), 2);
										if (s) {

											var data = [];

											for (var i = 0; i < s.length; i++) {
												if(data.length>0){
													
													for(var j = 0;j<data.length;j++){
														
														if(s[i].data["address"]!=data[j]["address"]){
															Ext.Msg.alert("提示","请选择同一地址的发货单");
															return;
														}
													}
													
												}
												
												data.push(s[i].data);
											}

											Ext.createWidget("copwindow", {
														data : data

													}).show();

										}

									}
								}]
					}, "->", {
						xtype : "searchbg",
						items : [{
									xtype : 'textfield',
									fieldLabel : '申请单号',
									labelAlign : "right",
									name : 'deliveryReq.saleSendId',
									cn : 'sdy',
									labelWidth : 60,
									flex : 1
								}, {
									xtype : "textfield",
									fieldLabel : "工程编号",
									labelAlign : "right",
									labelWidth : 60,
									name : 'deliveryReq.bcbh'
								}, Pcbms.searchbtn("查询", storeid, 'small'), {
									xtype : "idcombo",
									fieldLabel : "合同编号",
									labelAlign : "right",
									labelWidth : 60,
									type : 2,
									name : 'deliveryReq.contractid'
								}, {
									xtype : 'textfield',
									fieldLabel : '客户编号',
									labelAlign : "right",
									name : 'deliveryReq.customerId',
									labelWidth : 60,
									flex : 1,
									onFocus : function() {
										return false;
										if (!this.clientWindow) {
											this.clientWindow = Ext.create(
													"Ext.window.Window", {
														width : 750,
														closeAction : 'hide',
														height : 300,
														modal : true,
														layout : 'fit',
														title : '客户选择',
														items : [{
															xtype : "clientgrid",
															target : this
														}]
													});

										}

										this.clientWindow.show();

									}
								}, {
									xtype : 'textfield',
									fieldLabel : '地址',
									name : 'deliveryReq.address',
									labelAlign : "right",
									labelWidth : 55
								}]
					}],
			bbar : Ext.create("Ext.PagingToolbar", {
						store : this.store,
						displayInfo : true,
						beforePageText : "当前页",
						afterPageText : "总 {0} 页",
						displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
						emptyMsg : " 暂无信息"
					})
			

		});

		this.callParent();
	}
});