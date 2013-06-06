Ext.define("Pcbms.product.StatementPanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.statementpanel",
	bodyPadding : 10,
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [{
				items : [{
					title : '下单报表',
					layout : 'auto',
					bodyPadding : 10,
					items : [{
								xtype : 'datefield',
								itemId : 's1',
								name : 'start',
								fieldLabel : '开始时间'
							}, {
								xtype : 'datefield',
								name : 'end',
								itemId : 'e1',
								fieldLabel : '结束时间'
							}],
					buttons : [{
						text : '确定导出',
						handler : function() {
							var start = me.down("#s1").getValue();

							var end = me.down("#e1").getValue();

							var s = 0;
							var e = 0;

							if (start) {
								s = start.getTime();
							}

							if (end) {
								e = end.getTime();
							}

							if (s == 0 && e == 0) {

								Ext.Msg.alert("错误提示", "请选择时间");
								return false;
							}

							downFile("/reportService!product.action?start=" + s
									+ "&end=" + e);
						}
					}]
				}, {
					title : '未投料报表',
					layout : 'auto',
					bodyPadding : 10,
					items : [{
								xtype : 'datefield',
								itemId : 's2',
								name : 'start',
								fieldLabel : '开始时间'
							}, {
								xtype : 'datefield',
								name : 'end',
								itemId : 'e2',
								fieldLabel : '结束时间'
							}],
					buttons : [{
						text : '确定导出',
						handler : function() {
							var start = me.down("#s2").getValue();

							var end = me.down("#e2").getValue();

							var s = 0;
							var e = 0;

							if (start) {
								s = start.getTime();
							}

							if (end) {
								e = end.getTime();
							}

							if (s == 0 && e == 0) {

								Ext.Msg.alert("错误提示", "请选择时间");
								return false;
							}

							downFile("/reportService!searchNotReleaseOrders.action?start="
									+ s + "&end=" + e);
						}
					}]
				},{
					title : '需出货料号报表',
					layout : 'auto',
					bodyPadding : 10,
					items : [{
								xtype : 'datefield',
								itemId : 's3',
								name : 'start',
								fieldLabel : '开始时间'
							}, {
								xtype : 'datefield',
								name : 'end',
								itemId : 'e3',
								fieldLabel : '结束时间'
							}],
					buttons : [{
						text : '确定导出',
						handler : function() {
							var start = me.down("#s3").getValue();

							var end = me.down("#e3").getValue();

							var s = 0;
							var e = 0;

							if (start) {
								s = start.getTime();
							}

							if (end) {
								e = end.getTime();
							}

							if (s == 0 && e == 0) {

								Ext.Msg.alert("错误提示", "请选择时间");
								return false;
							}

							downFile("/reportService!searchDeliver.action?start="
									+ s + "&end=" + e);
						}
					}]
				},{
					title : '工作板WIP报表',
					layout : 'auto',
					bodyPadding : 10,
					items : [],
					buttons : [{
						text : '确定导出',
						handler : function() {

							downFile("/reportService!wip.action?type=0");
						}
					}]
				}]
			}, {
				items : [{
					title : '未准时出货报表',
					layout : 'auto',
					bodyPadding : 10,
					items : [{
								xtype : 'datefield',
								itemId : 's5',
								name : 'start',
								fieldLabel : '开始时间'
							}, {
								xtype : 'datefield',
								name : 'end',
								itemId : 'e5',
								fieldLabel : '结束时间'
							}],
					buttons : [{
						text : '确定导出',
						handler : function() {
							var start = me.down("#s5").getValue();

							var end = me.down("#e5").getValue();

							var s = 0;
							var e = 0;

							if (start) {
								s = start.getTime();
							}

							if (end) {
								e = end.getTime();
							}

							if (s == 0 && e == 0) {

								Ext.Msg.alert("错误提示", "请选择时间");
								return false;
							}

							downFile("/reportService!searchNotOnTime.action?start="
									+ s + "&end=" + e);
						}
					}]
				}, {
					title : '交货达成率',
					layout : 'auto',
					bodyPadding : 10,
					items : [{
								xtype : 'datefield',
								itemId : 's6',
								name : 'start',
								fieldLabel : '开始时间'
							}, {
								xtype : 'datefield',
								name : 'end',
								itemId : 'e6',
								fieldLabel : '结束时间'
							},{
								xtype : 'label',
								itemId : 'a6',
								style : {
									color : 'red'
								}
							}],
					buttons : [{
						text : '确定',
						handler : function() {
							var start = me.down("#s6").getValue();

							var end = me.down("#e6").getValue();

							var s = 0;
							var e = 0;

							if (start) {
								s = start.getTime();
							}

							if (end) {
								e = end.getTime();
							}

							if (s == 0 && e == 0) {

								Ext.Msg.alert("错误提示", "请选择时间");
								return false;
							}

							Ext.Ajax.request({
								url : "/reportService!searchYieldRate.action?start="
										+ s + "&end=" + e,
								success : new Pcbms.ajaxHandler({
											success : function(str) {
												var s = "";
												if(str.list){
													s = "总交货数量:"+str.list["all"]+",准时交货数量:"+str.list["ontime"]+",达成率:"+str.list["bl"]+"%";
												}
												
												me.down("#a6").setText(s);
											},
											error : function(r) {
												Ext.Msg.alert('出现错误', '原因 <'
																+ r.msg + ">");
											}
										})
							});
						}
					}]
				},{
					title : '仓库出货表',
					layout : 'auto',
					bodyPadding : 10,
					items : [{
								xtype : 'datefield',
								itemId : 's4',
								name : 'start',
								fieldLabel : '开始时间'
							}, {
								xtype : 'datefield',
								name : 'end',
								itemId : 'e4',
								fieldLabel : '结束时间'
							}],
					buttons : [{
						text : '确定导出',
						handler : function() {
							var start = me.down("#s4").getValue();

							var end = me.down("#e4").getValue();

							var s = 0;
							var e = 0;

							if (start) {
								s = start.getTime();
							}

							if (end) {
								e = end.getTime();
							}

							if (s == 0 && e == 0) {

								Ext.Msg.alert("错误提示", "请选择时间");
								return false;
							}

							downFile("/reportService!searchWareHouseDelivery.action?start="
									+ s + "&end=" + e);
						}
					}]
				},{
					title : '工作板WIP报表',
					layout : 'auto',
					bodyPadding : 10,
					items : [],
					buttons : [{
						text : '确定导出',
						handler : function() {

							downFile("/reportService!wip.action?type=0");
						}
					}]
				}]
			}]
		});

		me.callParent(arguments);
	}

});