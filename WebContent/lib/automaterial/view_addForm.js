
Ext.define('Pcbms.view.addAutoMaterial', {
	extend : 'Ext.form.Panel',
	alias : "widget.amadd",
	bodyPadding : 10,
	statusData : [[0, "作废"], [1, "生效"]],
	formSubmit : function() {
		var me = this;
		if(me.picInfoWindow.down("#bcgysaa").isValid()&&me.picInfoWindow.down("#bcxhaa").isValid()){
			
			me.params["mtticket.bcgys"] = me.picInfoWindow.down("#bcgysaa").getValue();
			me.params["mtticket.bcxh"] = me.picInfoWindow.down("#bcxhaa").getValue();
			
			me.getForm().submit({
					params : me.params,
					waitMsg : '正在提交,请稍等...',
					url : '/autoMTAction!addMaterialTicket.action',
					success : function(form, action) {
						Ext.Msg.alert("提示", action.result.msg);
						me.picInfoWindow.close();
					},
					failure : Pcbms.formHandler

				});
			
		}else{
			
			
		}
		
		
	},
	productFilter : function() {
		var me = this;

		var bcgys = me.down("#bcgys").getValue();
		var jhrq = me.down("#jhrq").getValue();

		var bsarr = [];

		var jqarr = [];

		for (var k in bcgys) {
			bsarr.push(bcgys[k]);
		}

		for (var k in jhrq) {
			jqarr.push(jhrq[k]);
		}

		me.pstore.suspendEvents();
		me.pstore.clearFilter();
		me.pstore.resumeEvents();

		me.pstore.filter([{
			fn : function(record) {

				if (jqarr.length > 0
						&& Ext.Array.indexOf(jqarr, record.get('jhrq')
										.getTime()) < 0) {
					return false;
				}

				if (bsarr.length > 0
						&& Ext.Array.indexOf(bsarr, record.get('bcgys')) < 0) {
					return false;
				}

				return true;
			}
		}]);

	},
	createPic : function() {
		var me = this;

		var s = checkGridSelect(me.down("#productgrid"), 2);
		if (s) {
			Ext.Msg.confirm("提示", "即将自动创建开料图,是否确定?", function(v) {
				if (v == 'no')
					return;
				var wbids = [];

				for (var i = 0; i < s.length; i++) {
					wbids.push(s[i].data["wbid"]);
				}

				me.getForm().submit({
					url : 'autoMTAction!buildKLT.action',
					timeout : 1000000,
					params : {
						wbids : wbids
					},
					waitMsg : '正在计算,请稍等...',
					success : function(form, action) {

						me.params = {};

						var yx = me.getForm().findField("mtticket.ylccx")
								.getValue();
						var yy = me.getForm().findField("mtticket.ylccy")
								.getValue();

						var w = 600;

						var bl = 600 / yx;

						var h = bl * yy;

						if (yy > yx) {

							h = 600;

							bl = 600 / yy;

							w = bl * yx;
						}

						var cpTab = Ext.create("Ext.tab.Panel", {
									width : w + 2,// 加上边距
									height : h + 52// 加上title
								});

						// 原料总数量
						var total = 0;

						// 总利用率
						var lyl = 0;

						var i = 0;
						for (; i < action.result.listNestingResult.length; i++) {
							var lnr = action.result.listNestingResult[i];

							var cpPanel = Ext.create("Ext.panel.Panel", {
										title : '原料(X:' + yx + ',Y' + yy + ')',
										layout : 'absolute',
										tbar : [{
											text : '利用率' + lnr["recovery"]
													+ '%' + " 原料数" + lnr["num"]
										}, '->', {
											text : action.result.wbids
										}]

									});
							total += lnr.num;

							lyl += lnr.recovery;

							for (var j = 0; j < lnr.layouts.length; j++) {

								var item = lnr.layouts[j];

								cpPanel.add(Ext.create('Ext.draw.Component',
										createRectangle(item.width,
												item.height, {
													x : item.x,
													y : item.y
												}, bl, item.id)));

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].x"] = item.x;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].y"] = item.y;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].width"] = item.width;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].height"] = item.height;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].id"] = item.id;
								me.params["listNestingParam[" + i + "].num"] = lnr.num;

							}

							cpTab.add(cpPanel);

						}

						me.cpWin = Ext.create("Ext.window.Window", {
									title : '开料图(投料数量:' + total + "块,总利用率:"
											+ (lyl / i) + "%)",
									items : [cpTab],
									modal : true,
									layout : 'fit',
									buttons : [{
												text : '确定',
												handler : function() {
													me.formSubmit();
												}
											}]
								});

						me.cpWin.show();

					},
					failure : Pcbms.formHandler

				});

			});

		}

	},

	createPict : function() {
		var me = this;

		var s = checkGridSelect(me.down("#productgrid"), 2);
		if (s) {
			Ext.Msg.confirm("提示", "即将自动创建开料图,是否确定?", function(v) {
				if (v == 'no')
					return;
				var wbids = [];

				for (var i = 0; i < s.length; i++) {
					wbids.push(s[i].data["wbid"]);
				}

				me.getForm().submit({
					url : 'autoMTAction!buildKLT.action',
					timeout : 1000000,
					params : {
						wbids : wbids
					},
					waitMsg : '正在计算,请稍等...',
					success : function(form, action) {

						var yx = me.getForm().findField("mtticket.ylccx")
								.getValue();
						var yy = me.getForm().findField("mtticket.ylccy")
								.getValue();

						var w = 600;

						var bl = 600 / yx;

						var h = bl * yy;

						if (yy > yx) {

							h = 600;

							bl = 600 / yy;

							w = bl * yx;
						}

						me.params = {};

						me.params["mtticket.bccl"] = me.bccl;
						me.params["mttticket.bh"] = me.bh;

						// 原料总数量
						var total = 0;

						// 总利用率
						var lyl = 0;

						var i = 0;

						me.klstore.removeAll();
						for (; i < action.result.listNestingResult.length; i++) {
							var wbids = [];

							var lnr = action.result.listNestingResult[i];

							me["lnr_" + (i + 1)] = lnr;

							for (var j = 0; j < lnr.layouts.length; j++) {

								var item = lnr.layouts[j];

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].x"] = item.x;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].y"] = item.y;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].width"] = item.width;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].height"] = item.height;

								me.params["listNestingParam[" + i
										+ "].layouts[" + j + "].id"] = item.id;
								me.params["listNestingParam[" + i + "].num"] = lnr.num;

								wbids.push(item.id);

							}

							total += lnr.num;
							lyl += lnr.recovery;

							me.klstore.add({
										xh : i + 1,
										ylnum : lnr.num,
										dclyl : lnr.recovery,
										pbnr : wbids.join(",")
									});
						}

						me.picInfoWindow = Ext.create("Ext.window.Window", {
							title : '开料图确认',
							width : 600,
							height : 300,
							modal : true,
							bodyPadding : 10,
							layout : 'column',

							buttons : [{
										text : '确定',
										handler : function() {
											me.formSubmit();
										}
									}],
							items : [{
										xtype : 'textfield',
										fieldLabel : '总利用率',
										value : (lyl / i) + "%",
										columnWidth : .5
									}, {
										xtype : 'textfield',
										fieldLabel : '总原料数量',
										value : total,
										columnWidth : .5
									}, {
										xtype : 'textfield',
										fieldLabel : '板材材料',
										columnWidth : .5,
										value : me.bccl
									}, {
										xtype : 'textfield',
										fieldLabel : '板厚',
										columnWidth : .5,
										value : me.bh
									}, {
										"xtype" : "pubcombo",
										"fieldLabel" : "板材型号",
										allowBlank : false,
										columnWidth : .5,
										itemId : 'bcxhaa',
										name : 'mtticket.bcxh',
										type : 14
									}, {
										xtype : 'pubcombo',
										fieldLabel : '板材供应商',
										allowBlank : false,
										columnWidth : .5,
										itemId : 'bcgysaa',
										name : 'mtticket.bcgys',
										type : 3
									}, {
										xtype : 'grid',
										columnWidth : 1,
										columns : [{
													header : '开料方式序号',
													dataIndex : 'xh'
												}, {
													header : '原料数',
													dataIndex : 'ylnum'
												}, {
													header : '达成利用率',
													dataIndex : 'dclyl'
												}, {
													header : '排布内容',
													flex : 1,
													dataIndex : 'pbnr'
												}],
										listeners : {
											itemclick : function(e, r) {

												var lnr = me["lnr_"
														+ r.data["xh"]];

												var cpPanel = Ext.create(
														"Ext.panel.Panel", {
															layout : 'absolute',
															width : w + 2,// 加上边距
															height : h + 2// 加上title
														});
												for (var j = 0; j < lnr.layouts.length; j++) {

													var item = lnr.layouts[j];

													cpPanel
															.add(Ext
																	.create(
																			'Ext.draw.Component',
																			createRectangle(
																					item.width,
																					item.height,
																					{
																						x : item.x,
																						y : item.y
																					},
																					bl,
																					item.id)));

												}

												me.cpWin = Ext.create(
														"Ext.window.Window", {
															items : [cpPanel],
															modal : true,
															layout : 'fit'
														});

												me.cpWin.show();

											}
										},
										store : me.klstore
									}]

						});

						me.picInfoWindow.show();

					},
					failure : Pcbms.formHandler
				})
			})
		}

	},

	initComponent : function() {
		var me = this;

		var storeid = me.storeid || "autocpListStore";

		me.klstore = Ext.create("Ext.data.ArrayStore", {

					data : [],
					fields : [{
								name : 'xh',
								type : 'int'
							}, {
								name : 'ylnum',
								type : 'int'
							}, {
								name : 'dclyl',
								type : 'int'
							}, {
								name : 'pbnr',
								type : 'string'
							}]

				});

		me.store = Ext.create("Ext.data.Store", {
					model : "WorkBoard",
					storeId : storeid,
					autoLoad : true,
					proxy : Pcbms.ajaxProxy({url: "/autoMTAction!searchWorkBoardCondition.action",
							reader : {
								type : 'json',
								root : 'conditionList',
								totalProperty : 'count'
							}})
				});

		me.pstore = Ext.create("Ext.data.Store", {
			model : "WorkBoard",
			listeners : {
				load : function(store, records) {
					var jhrq = [];

					var bcgys = [];

					for (var i = 0; i < records.length; i++) {

						jhrq.push(records[i].data["jhrq"]);

						bcgys.push(records[i].data["bcgys"]);

					}

					var jhrqclone = [];

					var jhrqdt = [];

					for (var i = 0; i < jhrq.length; i++) {

						if (Ext.Array.indexOf(jhrqclone, jhrq[i].getTime()) == -1) {

							jhrqclone.push(jhrq[i].getTime());
							jhrqdt.push(jhrq[i]);
						}

					}

					bcgys = Ext.unique(bcgys);

					me.down("#jhrq").show();
					me.down("#jhrq").removeAll();
					for (var i = 0; i < jhrqdt.length; i++) {

						me.down("#jhrq").add({
							xtype : "checkbox",
							onChange : function() {
								me.productFilter();

							},
							boxLabel : Ext.util.Format.date(jhrqdt[i], 'y-m-d'),
							inputValue : jhrqclone[i]
						});
					}

					me.down("#bcgys").show();
					me.down("#bcgys").removeAll();
					for (var i = 0; i < bcgys.length; i++) {

						me.down("#bcgys").add({
									xtype : "checkbox",
									onChange : function() {
										me.productFilter();

									},
									boxLabel : bcgys[i],
									inputValue : bcgys[i]
								});
					}

				}
			},
			proxy : Pcbms.ajaxProxy("/workBoardManagementAction!searchProducts.action")
		});

		Ext.applyIf(me, {
			items : [{
				xtype : 'fieldset',
				title : '搜索条件',
				layout : 'column',
				collapsible : true,
				itemId : 'search',
				items : [{
					xtype : 'grid',
					tbar : ['->', {
								text : '刷新',
								handler : function() {
									me.store.load();
								}
							}],
					store : me.store,
					height : 250,
					width : 600,
					autoScroll : true,
					columns : [{
								header : '板材材料',
								flex : 1,
								dataIndex : 'bccl'
							}, {
								header : '板厚',
								flex : 1,
								dataIndex : 'bh'
							}, {
								header : '数量',
								flex : 1,
								dataIndex : 'num'
							}, {
								header : "操作",
								flex : 1,
								xtype : 'actioncolumn',
								items : [{
									icon : 'icons/application_cascade.png',
									handler : function(grid, rowIndex, colIndex) {
										var rec = grid.getStore()
												.getAt(rowIndex);

										grid.getSelectionModel().select(rec);

										var params = {};

										params["searchCondition.bccl"] = rec
												.get("bccl");

										params["searchCondition.bh"] = rec
												.get("bh");

										me.bccl = rec.get("bccl");
										me.bh = rec.get("bh");

										me.pstore.suspendEvents();
										me.pstore.clearFilter();
										me.pstore.resumeEvents();

										me
												.down("#productgrid")
												.getStore()
												.setProxy(Pcbms.ajaxProxy({
														url : "/autoMTAction!searchWorkBoards.action",
														reader : {
															type : 'json',
															root : 'wblist',
															totalProperty : 'count'
														}}));
										me.down("#productgrid").getStore()
												.load();

									}
								}]

							}

					]

				}, {
					"xtype" : "fieldset",
					title : '开料信息',
					margin : "0 0 10 10",
					itemId : 'infocon',
					width : 280,
					height : 250,
					"defaults" : {
						margin : "0 10 10 10"
					},
					"layout" : {
						"type" : "auto"
					},
					"items" : [{
								"xtype" : "numberfield",
								"fieldLabel" : "原料长",
								"labelWidth" : 75,
								allowBlank : false,
								name : 'mtticket.ylccx',
								value : 1248,
								"columnWidth" : 0.3
							}, {
								"xtype" : "numberfield",
								"fieldLabel" : "原料宽",
								allowBlank : false,
								name : 'mtticket.ylccy',
								value : 1040,
								"labelWidth" : 75,
								"columnWidth" : 0.3
							}, {
								"xtype" : "numberfield",
								"fieldLabel" : "最小出样率",
								name : 'mtticket.minrate',
								value : 96.0,
								"labelWidth" : 75,
								"columnWidth" : 0.3
							}, {
								"xtype" : "button",
								"text" : "创建",
								"iconCls" : "add",
								"columnWidth" : 0.1,
								handler : function(b) {
									me.createPict();

								}
							}]
				}]
			}, {
				xtype : 'checkboxgroup',
				hidden : true,
				fieldLabel : '工艺',
				columns : 6,
				itemId : 'gy'
			}, {
				xtype : 'checkboxgroup',
				hidden : true,
				fieldLabel : '交货日期',
				columns : 6,
				itemId : 'jhrq'

			}, {
				xtype : 'checkboxgroup',
				hidden : true,
				fieldLabel : '板材供应商',
				columns : 6,
				itemId : 'bcgys'
			}, {
				xtype : 'gridpanel',
				itemId : 'productgrid',
				height : 250,
				autoscroll : true,
				store : me.pstore,
				selModel : Ext.create("Ext.selection.CheckboxModel"),
				tbar : [],
				columns : [{
							header : "工作板编号",
							flex : 1,
							renderer : showDetial('wb').renderer,
							dataIndex : "wbid"
						}, {
							header : "创建时间",
							flex : 1,
							renderer : Ext.util.Format.dateRenderer("Y-m-d"),
							dataIndex : "createtime"
						}, {
							header : "工作板尺寸(mm)",
							flex : 1,
							renderer : function(v, m, r) {
								return r.data["gzbccx"] + "X"
										+ r.data["gzbccy"];
							}
						}, {
							header : "数量",
							flex : 1,
							dataIndex : 'num'
						}, {
							header : "未开料数量",
							flex : 1,
							dataIndex : 'wklnum'
						}, {
							header : "锁定人",
							flex : 1,
							dataIndex : 'lockedPersonname'
						}, {
							header : "交货日期",
							renderer : Ext.util.Format.dateRenderer("Y-m-d"),
							flex : 1,
							dataIndex : 'jhrq'
						}, {
							header : "创建人",
							flex : 1,
							dataIndex : 'creatorname'
						}/*
							 * , { header : "板材材料", flex : 1, dataIndex : 'bccl' }, {
							 * header : "外层铜厚", flex : 1, dataIndex : 'wcth' }, {
							 * header : "内层铜厚", flex : 1, dataIndex : 'ncth' }, {
							 * header : "层数", flex : 1, dataIndex : 'cs' }, {
							 * header : "板厚", flex : 1, dataIndex : 'bh' }, {
							 * header : "文字颜色", flex : 1, dataIndex :
							 * 'fontcolor' }, { header : "阻焊颜色", flex : 1,
							 * dataIndex : 'zhcolor' }, { header : "工艺", flex :
							 * 1, dataIndex : 'gy' }
							 */, {
							header : "状态",
							flex : 1,
							dataIndex : 'status',
							renderer : function(v) {
								for (var i in me.statusData) {
									if (v == me.statusData[i][0]) {
										return me.statusData[i][1];
									}
								}
							}
						}],
				viewConfig : {

				}
			}]
		});

		me.callParent(arguments);
	}

});