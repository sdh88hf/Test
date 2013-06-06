// 显示订单详细信息
Ext.define("Pcbms.product.ProductPlanView", {
	extend : "Ext.panel.Panel",
	alias : "widget.productplanview",
	requires : ["Pcbms.product.Commons"],
	border : false,
	width : 1000,
	auditSuccess : function(data) {
		if (Ext.isArray(data.result) && data.result.length > 1) {
			Ext.Msg.confirm("温馨提示,文件审核成功!", "还有 " + data.result.length
							+ "的数据未处理,是否处理下一条数据?", function(b) {
						if (b == "ok") {
							window.location
									.replace(Ext.String
											.format(
													"psFileAction!loadAuditProdplan.action?&title={0}_工程文件审核&widget=Pcbms.product.ProductPlanView&ppId={0}",
													data.result[0]));
							return;
						}
					});
		}
		window.location
				.replace(Ext.String
						.format(
								"productPlanAction!view.action?ppId={0}&title={0}_生产安排详细&widget=Pcbms.product.ProductPlanView",
								data.ppId));
	},
	initComponent : function() {
		var me = this;
		// 这里我们分三个
		var planData = me.jsonData.result.productPlan;
		var productData = planData.productBean;
		var productOrderData = planData.productOrderBean;
		me.bbar = [{
					text : '添加备注',
					handler : function() {

					}
				}, {
					text : '工程审核通过',
					disabled : Ext.isEmpty(productData.psfileBean)
							|| productOrderData.status != 3,
					handler : function(b) {
						if (window.confirm("确认审核通过?")) {
							b.setText("数据提交中...");
							b.setDisabled(true);
							Ext.Ajax.trequest({
								url : "/psFileAction!permitProdplan.action",
								params : {
									"ppId" : planData.ppId,
									"psFileBean.psfileId" : productData.psfileBean.psfileId
								},
								success : me.auditSuccess
							});
						}
					}
				}, {
					text : '工程审核拒绝',
					disabled : Ext.isEmpty(productData.psfileBean)
							|| productOrderData.status != 3,
					handler : function(b) {
						Ext.Msg.prompt('请输入理由', '请输入工程文件的问题:', function(btn,
								text) {
							if (btn == 'ok') {
								Ext.Ajax.trequest({
									url : "/psFileAction!permitProdplan.action",
									params : {
										"ppId" : planData.ppId,
										"psFileBean.psfileId" : productData.psfileBean.psfileId,
										'psFileBean.note' : text
									},
									success : me.auditSuccess
								})
							}
						});

					}
				}];
		me.items = [{
			xtype : 'container',
			layout : 'column',
			defaults : {
				margin : '0 10 0 5'
			},
			items : [{
						xtype : 'container',
						columnWidth : 0.34,
						items : [{
									title : '订单需求信息',
									xtype : 'productorderfield',
									jsonData : productOrderData
								}, {
									title : '生产安排信息',
									xtype : 'productplanfield',
									jsonData : planData
								}]
					}, {
						xtype : 'tabpanel',
						columnWidth : 0.66,
						items : [{
							xtype : 'container',
							title : "产品基本信息",
							layout : "column",
							defaults : {
								columnWidth : 0.5,
								margin : '0 10 0 5'
							},
							items : [{
								xtype : 'container',
								items : [{
											title : '客户文件详细',
											xtype : 'projectfilefield',
											jsonData : productData.projectFileBean
										}, {
											title : '单子已处理工程文件信息',
											xtype : 'psfilefield',
											jsonData : productData.psfileBean
										}]
							}, {
								title : '产品详细信息',
								xtype : 'productfield',
								jsonData : productData
							}]
						}, {
							xtype : 'container',
							title : "操作历史记录",
							listeners : {
								activate : function(c) {
									c.down("auditProcessField").loadData();
									c.down("lockProcessField").loadData();
								}
							},
							items : [{
										xtype : 'displayfield',
										margin : '0 0 0 12',
										value : '<b>历史审核记录信息</b>'
									}, {
										xtype : 'auditProcessField',
										uniqKey : planData.uniqKey,
										height : 200
									}, {
										xtype : 'displayfield',
										margin : '0 0 0 12',
										value : '<b>历史锁定记录信息</b>'
									}, {
										xtype : 'lockProcessField',
										uniqKey : planData.uniqKey,
										height : 300
									}]
						}]
					}]
		}];
		me.callParent(arguments);
	}
});