Ext.define('ProductFilter', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'bccl',
						type : 'string'
					}, {
						name : 'cs',
						type : 'string'
					}, {
						name : 'bh',
						type : 'string'
					}, {
						name : 'zhColor',
						type : 'string'
					}, {
						name : 'fontColor',
						type : 'string'
					}, {
						name : 'num',
						type : 'int'
					}, {
						name : 'label',
						convert : function(v, record) {
							return record.data.bccl + " " + record.data.cs
									+ " " + record.data.bh + " "
									+ record.data.zhColor + "油"
									+ record.data.fontColor + "字";
						}
					}]
		});
Ext.define('Pcbms.product.FilterGroup', {
			extend : 'Ext.form.CheckboxGroup',
			alias : 'widget.filtergroup',
			layout : {
				type : 'hbox',
				align : 'left'
			},
			labelWidth : 70,
			anchor : '100%',
			defaults : {
				width : 100
			},
			getValue : function() {
				var values = [];
				this.eachBox(function(cb) {
							var inputValue = cb.inputValue;
							if (cb.getValue()) {
								values.push(inputValue);
							}
						});
				return values;
			},
			initBox : function(data) {
				var me = this;
				me.removeAll();
				for (var i = 0; i < data.length; i++) {
					var lb = data[i].name + "(" + data[i].count + ")";
					me.add({
								xtype : "checkbox",
								boxLabel : lb,
								inputValue : data[i].name
							});
				}
			}
		});
// 填写制作参数
function wp(i) {
	Ext.getCmp("addwbid").showParamWindow(i);
}
Array.prototype.bindValue = function(v) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].name == v) {
			this[i].count++;
			return;
		}
	}
	this.push({
				name : v,
				count : 1
			});
};
Array.prototype.findStringValue = function(v) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == v) {
			return true;
		}
	}
	return this.length == 0;
};
Array.prototype.findDateValue = function(v) {
	for (var i = 0; i < this.length; i++) {
		if (Ext.util.Format.date(v, 'm-d') == this[i]) {
			return true;
		}
	}
	return this.length == 0;
};
Ext.define('Pcbms.product.ChioceProductList', {
	extend : 'Ext.grid.Panel',
	alias : "widget.cpgrid",
	plugins : [{
				ptype : 'rowexpander',
				rowBodyTpl : ['<p><b style="margin:0 0 0 50px">订单需求:</b>{ddxq}</p>']
			}],
	productFilter : function() {
		var me = Ext.ComponentQuery.query("cpgrid")[0];
		var gy = me.down("#gy").getValue();
		var bcgys = me.down("#bcgys").getValue();
		var jhrq = me.down("#jhrq").getValue();
		var copper = me.down("#wcth").getValue();
		me.store.suspendEvents();
		me.store.clearFilter();
		me.store.resumeEvents();
		me.store.filter([{
			fn : function(record) {
				// 交货日期
				return gy.findStringValue(record.get('gy'))
						&& bcgys.findStringValue(record.get('bcgys'))
						&& jhrq.findDateValue(record.get('jhrq'))
						&& copper.findStringValue(record.get('wcth'));
			}
		}]);
	},
	initComponent : function() {
		var me = this;
		me.cstore = Ext.create("Ext.data.Store", {
					model : "ProductFilter",
					autoLoad : false,
					proxy : Pcbms
							.ajaxProxy2("/projectAction!filterCombination.action")
				});

		me.store = Ext.create("Ext.data.Store", {
					model : "Product",
					listeners : {
						load : function(store, records) {
							// return;
							var jhrq = [];
							var bcgys = [];
							var gy = [];
							var copper = [];
							Ext.each(records, function(r) {
										var jhdate = Ext.util.Format.date(
												r.data["jhrq"], 'm-d');
										jhrq.bindValue(jhdate);
										bcgys.bindValue(r.data["bcgys"]);
										gy.bindValue(r.data["gy"]);
										copper.bindValue(r.data["wcth"]);
									});
							me.down("#gy").initBox(gy);
							me.down("#jhrq").initBox(jhrq);
							me.down("#bcgys").initBox(bcgys);
							me.down("#wcth").initBox(copper);

						}
					},
					proxy : Pcbms
							.ajaxProxy2("/projectAction!listForCombination.action"),
					autoLoad : false
				});
		var downLoadPFAction = Ext.create('Ext.Action', {
					text : '客户文件下载',
					iconCls : 'download',
					disabled : true,
					handler : function(b, event) {
						var s = checkGridSelect(me, 1);
						if (s) {
							Pcbms.downFile("projectfile", s[0].get("bcbh"));
						}
					}
				});
		var downLoadPSFAction = Ext.create('Ext.Action', {
			disabled : true,
			text : '工程文件下载',
			iconCls : 'Clientdownload',
			handler : function(b) {
				var s = checkGridSelect(me, 1);
				if (s) {
					downFile("/downloadAction!downloadClientDataFile.action?bcbh="
							+ s[0].get("bcbh"));
				}
			}
		});
		var lockAction = Ext.create('Ext.Action', {
			disabled : true,
			text : '锁定',
			iconCls : 'lock',
			handler : function(b) {
				var s = checkGridSelect(me, 2);
				var arr = [];
				for (var i = 0; i < s.length; i++) {
					arr.push(s[i].get("prodId"));
				}
				if (s) {
					Ext.Ajax.request({
						url : "/workBoardManagementAction!lockedProducts.action",
						params : {
							"prodIds" : arr
						},
						success : new Pcbms.ajaxHandler({
									success : function(str) {
										Ext.Msg.alert('成功提示', str.msg);
										me.down("#productgrid").load();
									},
									error : function(r) {
										Ext.Msg.alert('出现错误', '原因 <' + r.msg
														+ ">");
									}
								})
					});

				}
			}
		});
		var unlockAction = Ext.create('Ext.Action', {
			disabled : true,
			text : '解锁',
			iconCls : 'lockopen',
			handler : function(b) {
				var s = checkGridSelect(me, 2);
				var arr = [];
				for (var i = 0; i < s.length; i++) {
					arr.push(s[i].get("prodId"));
				}
				if (s) {
					Ext.Ajax.request({
						url : "/workBoardManagementAction!unlockedProducts.action",
						params : {
							"prodIds" : arr
						},
						success : new Pcbms.ajaxHandler({
									success : function(str) {
										Ext.Msg.alert('成功提示', str.msg);
										me.down("#productgrid").load();
									},
									error : function(r) {
										Ext.Msg.alert('出现错误', '原因 <' + r.msg
														+ ">");
									}
								})
					});

				}
			}
		});
		var redoAction = Ext.create('Ext.Action', {
			disabled : true,
			text : '退回',
			iconCls : 'back',
			handler : function(b) {
				var s = checkGridSelect(me, 1);
				if (s) {
					var store = me.store;
					Ext.MessageBox.prompt("确认退回该工程文件?", "请输入退回该工程文件的原因:",
							function(b, txt) {
								if (b == 'ok') {
									// 退回
									Ext.Ajax.request({
										url : "/ptredoRequestAction!addRedoRequest.action",
										params : {
											"redorequest.bcbh" : s[0]
													.get("bcbh"),
											"redorequest.prodId" : s[0]
													.get("prodId"),
											"redorequest.problem" : txt
										},
										success : new Pcbms.ajaxHandler({
													success : function(str) {
														Ext.Msg
																.alert(
																		'退回成功',
																		"工程文件退回成功!已将问题交给工程!",
																		function() {
																			store
																					.load();
																		});
													},
													error : function(r) {
														Ext.Msg.alert('出现错误',
																'原因 <' + r.msg
																		+ ">");
													}
												})
									});
								}
							});
				}
			}
		});
		var contextMenu = Ext.create('Ext.menu.Menu', {
					items : [downLoadPFAction, downLoadPSFAction, lockAction,
							unlockAction, redoAction]
				});
		me.selModel = Ext.create("Ext.selection.CheckboxModel", {
					listeners : {
						selectionchange : function(sm, selections) {
							contextMenu.items.each(function(item) {
										if (selections.length) {
											downLoadPFAction.enable();
											downLoadPSFAction.enable();
											lockAction.enable();
											unlockAction.enable();
											redoAction.enable();
										} else {
											downLoadPFAction.disable();
											downLoadPSFAction.disable();
											lockAction.disable();
											unlockAction.disable();
											redoAction.disable();
										}
									});
						}
					}
				}), Ext.applyIf(me, {
			viewConfig : {
				stripeRows : true,
				listeners : {
					itemcontextmenu : function(view, rec, node, index, e) {
						e.stopEvent();
						contextMenu.showAt(e.getXY());
						return false;
					}
				}
			},
			dockedItems : [{
				xtype : 'toolbar',
				dock : 'top',
				items : ['->', {
							xtype : 'textfield',
							fieldLabel : '工程编号',
							itemId : 'searchbcbh',
							lableWidth : 60,
							labelAlign : 'right'
						}, {
							xtype : 'combo',
							fieldLabel : '请选择条件',
							store : me.cstore,
							flex : 1,
							typeAhead : false,
							listConfig : {
								loadingText : '查询中...',
								emptyText : '未找到匹配的内容.',
								getInnerTpl : function() {
									return "{label} <span style='color:green'>{num}</span>";
								}
							},
							emptyText : '请先选择过滤条件',
							displayField : 'label',
							valueField : 'label',
							lableWidth : 60,
							labelAlign : 'right',
							listeners : {
								'change' : function(f, nv, o) {
									var rec = f.findRecordByValue(nv);
									if (rec != false) {
										// 设置数据
										var params = {};
										params["prodplan.bccl"] = rec
												.get("bccl");
										params["prodplan.cs"] = rec.get("cs");
										params["prodplan.bh"] = rec.get("bh");
										params["prodplan.fontColor"] = rec
												.get("fontColor");
										params["prodplan.zhColor"] = rec
												.get("zhColor");
										me.store.suspendEvents();
										me.store.clearFilter();
										me.store.resumeEvents();
										me.store.getProxy().extraParams = params;
										me.store.load();
									}
								}
							}
						}, '-', {
							text : '点击刷新',
							iconCls : 'searchsmall',
							handler : function(b) {
								me.down("combo").setValue("");
								me.cstore.load({
											params : {
												'prodId' : me
														.down("#searchbcbh")
														.getValue()
											}
										});
							}
						}]
			}, {
				type : 'panel',
				dock : 'top',
				border : false,
				frame : true,
				height : 120,
				layout : 'anchor',
				items : [{
							xtype : 'filtergroup',
							fieldLabel : '工艺',
							itemId : 'gy',
							listeners : {
								change : me.productFilter
							}
						}, {
							xtype : 'filtergroup',
							fieldLabel : '交货日期',
							itemId : 'jhrq',
							listeners : {
								change : me.productFilter
							}
						}, {
							xtype : 'filtergroup',
							fieldLabel : '板材供应商',
							itemId : 'bcgys',
							listeners : {
								change : me.productFilter
							}
						}, {
							xtype : 'filtergroup',
							fieldLabel : '外层铜厚',
							itemId : 'wcth',
							listeners : {
								change : me.productFilter
							}
						}]
			}, {
				xtype : 'toolbar',
				dock : 'bottom',
				items : ['->', downLoadPFAction, downLoadPSFAction, lockAction,
						unlockAction, redoAction, {
							text : '创建工作板',
							iconCls : 'CreatWorkBoard',
							handler : function(b) {
								var s = checkGridSelect(me, 2);
								if (s) {
									if (!me.createWindow) {
										me.createForm = Ext
												.create(
														"Pcbms.product.RemakeWorkBoard",
														{
															id : 'addwbid',
															target : me
														});
										me.createWindow = Ext.create(
												"Ext.window.Window", {
													layout : 'fit',
													width : 900,
													closeAction : 'hide',
													maximized : true,
													modal : true,
													height : 600,
													title : '创建工作板',
													items : me.createForm,
													listeners : {
														"close" : function() {
														}
													},
													buttons : [{
														text : '确定',
														handler : function() {
															me.createForm
																	.submitForm();
														}
													}]
												});
									}
									var arr = [];

									for (var i = 0; i < s.length; i++) {
										arr.push(s[i].data["prodId"]);
									}
									Ext.Ajax.request({
										url : "/workBoardManagementAction!checkProductsCanCreateWorkBoard.action",
										params : {
											"prodIds" : arr
										},
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												me.createWindow.show();
												var combo = me.down("combo");
												var sp = combo
														.findRecordByValue(combo
																.getValue());
												me.createForm.loadNumGrid(s,
														str.wbid, sp.raw);
											},
											error : function(r) {
												Ext.Msg.alert('出现错误', '原因 <'
																+ r.msg + ">");
											}
										})
									});

								}

							}
						}]
			}],
			columns : [{
						dataIndex : 'ppId',
						width : 100,
						text : '生产编号'
					}, {
						dataIndex : 'khxh',
						width : 120,
						text : '客户型号'
					}, {
						header : "处理人",
						width : 80,
						dataIndex : "creator"
					}, {
						xtype : 'numbercolumn',
						dataIndex : 'wzgzbnum',
						format : '0',
						width : 70,
						text : '未组数量'
					}, {
						xtype : 'numbercolumn',
						dataIndex : 'minlw',
						format : '0.00',
						width : 60,
						text : '最小线宽'
					}, {
						xtype : 'numbercolumn',
						dataIndex : 'minld',
						format : '0.00',
						width : 60,
						text : '最小线距'
					}, {
						xtype : 'numbercolumn',
						dataIndex : 'minhole',
						format : '0.00',
						width : 60,
						text : '最小孔径'
					}, {
						xtype : 'gridcolumn',
						width : 70,
						text : 'PCS尺寸',
						renderer : Pcbms.ProjectSizeRenderer

					}, {
						xtype : 'gridcolumn',
						width : 90,
						dataIndex : 'wcth',
						renderer : function(v, m, r) {
							return v;
						},
						text : '铜厚'
					}, {
						dataIndex : 'jjType',
						width : 60,
						text : '加急类型'
					}, {
						dataIndex : 'note',
						flex : 1,
						text : '文件备注'
					}, {
						dataIndex : 'isfd',
						trueText : '<span style="color:red">是</span>',
						falseText : '<span style="color:green">否</span>',
						width : 100,
						text : '操作'
					}]
		});
		me.callParent(arguments);
	}

});