Ext.define("Pcbms.product.SetNumYtl", {
	extend : "Ext.grid.Panel",
	alias : "widget.sygrid",
	columnWidth : 0.5,
	margin:5,
	initComponent : function() {
		var me = this;

		me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2
		});
		me.plugins = [ me.cellEditing ];
		me.store = Ext.create("Ext.data.ArrayStore", {
			fields : [ {
				name : 'maxvalue',
				type : 'double'
			}, {
				name : 'minvalue',
				type : 'double'
			}, {
				name : 'ytl',
				type : 'double'
			}, {
				name : 'typevalue',
				type : 'string'
			} ],
			data : []
		});

		if (me.type == 1) {
			// me.add({
			// xtype : 'toolbar',
			// items : [{
			// text : '增加'
			// }, {
			// text : '删除'
			// }]
			// });
			var tbar = [ '->' ];
			tbar.push({
				text : '增加',
				iconCls : "add",
				handler : function() {
					me.store.insert(0, {
						maxvalue : '',
						minvalue : 0,
						ytl : 0
					});
					me.cellEditing.startEditByPosition({
						row : 0,
						column : 0
					});
				}
			});
			tbar.push({
				text : '删除',
				iconCls : "delete",
				handler : function() {
					var s = me.getSelectionModel().getSelection();
					if (s.length > 0) {
						me.store.remove(s[0]);
					}
				}
			});

			me.tbar = tbar;

			me.columns = [ {
				xtype : 'numbercolumn',
				dataIndex : 'maxvalue',
				text : '最大值',
				renderer : Ext.util.Format.round(this.value, 2),
				editor : {
					xtype : 'numberfield',
					allowBlank : false,
					minValue : 0.01,
					maxValue : 100000
				}
			}, {
				xtype : 'numbercolumn',
				dataIndex : 'minvalue',
				text : '最小值',
				renderer : Ext.util.Format.round(this.value, 2),
				editor : {
					xtype : 'numberfield',
					allowBlank : false,
					minValue : 0.001,
					maxValue : 100000
				}
			}, {
				xtype : 'numbercolumn',
				text : '预投率(%)',
				dataIndex : 'ytl',
				renderer : Ext.util.Format.round(this.value, 2),
				flex : 1,
				editor : {
					xtype : 'numberfield',
					allowBlank : false,
					minValue : 0.001,
					maxValue : 100000
				}
			} ];

		} else {
			me.columns = [ {
				xtype : 'gridcolumn',
				dataIndex : 'string',
				dataIndex : 'typevalue',
				text : '类型'
			}, {
				xtype : 'numbercolumn',
				dataIndex : 'number',
				text : '预投率(%)',
				renderer : Ext.util.Format.round(this.value, 2),
				dataIndex : 'ytl',
				flex : 1,
				editor : {
					xtype : 'numberfield',
					allowBlank : false,
					minValue : 0.001,
					maxValue : 100000
				}
			} ];
		}

		this.callParent();
	}
});
Ext
		.define(
				'Pcbms.product.AddYtl',
				{
					extend : 'Ext.form.Panel',
					alias : "widget.ytladd",
					bodyPadding : 5,
					loadComp : function() {
						var me = this;
						Ext.Ajax
								.trequest({
									url : "/ytlAction!searchYTL.action",
									success : function(str) {
										me.list = str.listYTLBean;
										for ( var i = 0; i < str.listYTLBean.length; i++) {
											var main = str.listYTLBean[i];
											me.down("#all").add({
												xtype : 'sygrid',
												itemId : 'sn_' + main.dictype,
												title : main.title,
												type : main.tbltype
											});
											me.down("#sn_" + main.dictype).store
													.insert(0, main.listYTLBean);
										}
										me
												.add({
													xtype : 'container',
													height : 50,
													width : 890,
													layout : {
														align : 'middle',
														pack : 'center',
														type : 'hbox'
													},
													items : [ {
														xtype : 'button',
														text : '确定',
														iconCls : "accept",
														handler : function() {
															var params = {};

															for ( var i = 0; i < me.list.length; i++) {
																var main = me.list[i];

																var g = me
																		.down("#sn_"
																				+ main.dictype);

																params["listYTLBean["
																		+ i
																		+ "].type"] = main.type;

																var items = g.store.data.items;
																for ( var j = 0; j < items.length; j++) {
																	params["listYTLBean["
																			+ i
																			+ "].listYTLBean["
																			+ j
																			+ "].minvalue"] = items[j].data["minvalue"];
																	params["listYTLBean["
																			+ i
																			+ "].listYTLBean["
																			+ j
																			+ "].maxvalue"] = items[j].data["maxvalue"];
																	params["listYTLBean["
																			+ i
																			+ "].listYTLBean["
																			+ j
																			+ "].typevalue"] = items[j].data["typevalue"];
																	params["listYTLBean["
																			+ i
																			+ "].listYTLBean["
																			+ j
																			+ "].ytl"] = items[j].data["ytl"];
																}

															}

															Ext.Ajax
																	.trequest({
																		url : "/ytlAction!updateYTL.action",
																		params : params,
																		success : function(
																				str) {
																			Ext.Msg
																					.alert(
																							"成功提示",
																							str.msg);
																		},
																		failure : function(
																				r) {
																			Ext.Msg
																					.alert(
																							'出现错误',
																							'原因 <'
																									+ r.msg
																									+ ">");
																		}
																	});

														}
													} ]
												});

									},
									failure : function(r) {
										Ext.Msg.alert('出现错误', '原因 <' + r.msg
												+ ">");
									}
								});
					},
					initComponent : function() {
						var me = this;
						Ext.applyIf(me, {
							items : [ {
								xtype : 'container',
								width : 900,
								itemId : 'all',
								layout : 'column',
								items : []
							} ]
						});
						me.callParent(arguments);
						me.loadComp();
					}
				});