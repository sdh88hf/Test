
Ext.define('Pcbms.product.FindLotCardList', {
	extend : 'Ext.form.Panel',
	alias : "widget.lcfind",
	bodyPadding : 10,
	listeners : {
		'render' : function() {
			if (this.stepid && this.stepid > 0) {

				this.down("#schlotid").setValue(this.stepid);

				this.loadData();
			}
		}
	},
	loadData : function() {
		var me = this;
		deferLoading(me);

		if (me.down("#schlotid").isValid()) {

			Ext.Ajax.request({
				url : "/lotCardManagementAction!searchLOTCardByID.action?lotid="
						+ me.down("#schlotid").getValue(),
				success : new Pcbms.ajaxHandler({
					success : function(str) {

						Ext.each(me.getForm().getFields().items, function() {

									if (this.getName()
											&& str.lotCardDetail[this.getName()]) {

										if (this.getXType() == "datefield") {
											var d = new Date();
											d.setTime(str.lotCardDetail[this
													.getName()]);
											this.setValue(d);
										} else {
											this
													.setValue(str.lotCardDetail[this
															.getName()]);
										}

									}

								});

						if (str.lotCardDetail["status"] == 0) {
							me.down("#status").setText("所属流程:"
									+ str.lotCardDetail["processname"]
									+ ",  状态:无效");
						} else {
							me.down("#status").setText("所属流程:"
									+ str.lotCardDetail["processname"]
									+ ",  状态:有效");
						}

						me.stepStore.removeAll();
						me.productStore.removeAll();
						me.stepStore.insert(0, str.lotCardDetail.stepList);

						me.productStore
								.insert(0, str.lotCardDetail.productList);

					},
					error : function(r) {
						Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
					}
				})
			});
		}

	},
	initComponent : function() {
		var me = this;

		me.stepStore = Ext.create("Ext.data.ArrayStore", {
					model : "Step",
					data : []
				});

		me.productStore = Ext.create("Ext.data.ArrayStore", {
					model : "Product",
					data : []
				});

		Ext.applyIf(me, {
			items : [{
						xtype : 'container',
						width : 900,
						layout : {
							type : 'column'
						},
						items : [{
									xtype : "idcombo",
									type : 8,
									allowBlank : false,
									itemId : 'schlotid',
									fieldLabel : 'LOT卡号'
								}, {
									xtype : 'button',
									handler : function() {
										me.loadData()
									},
									text : '查询',
									iconCls : "search"
								}, {
									xtype : 'label',
									itemId : 'status',
									style : {
										color : 'red'
									},
									text : '',
									name : 'status'
								}]
					}, {
						xtype : 'container',
						width : 900,
						layout : {
							type : 'column'
						},
						items : [{
									xtype : 'container',
									columnWidth : 0.33,
									items : [{
												xtype : 'textfield',
												name : 'cs',
												fieldLabel : '层数'
											}, {
												xtype : 'textfield',
												name : 'wbid',
												fieldLabel : '工作板编号'
											}, {
												xtype : 'textfield',
												name : 'bh',
												fieldLabel : '板厚'
											}, {
												xtype : 'textfield',
												name : 'wcth',
												fieldLabel : '外层铜厚'
											}]
								}, {
									xtype : 'container',
									columnWidth : 0.33,
									items : [{
												xtype : 'textfield',
												name : 'num',
												fieldLabel : '数量'
											}, {
												xtype : 'textfield',
												name : 'gzkyxj',
												fieldLabel : '优先级'
											}, {
												xtype : 'datefield',
												name : 'jhrq',
												fieldLabel : '交期'
											}, {
												xtype : 'textfield',
												name : 'ncth',
												fieldLabel : '内层铜厚'
											}]
								}, {
									xtype : 'container',
									columnWidth : 0.33,
									items : [{
												xtype : 'datefield',
												name : 'createtime',
												fieldLabel : '创建时间'
											}, {
												xtype : 'textfield',
												name : 'bccl',
												fieldLabel : '板材材料'
											}, {
												xtype : 'textfield',
												name : 'bcgys',
												fieldLabel : '板材供应商'
											}, {
												xtype : 'textfield',
												name : 'gy',
												fieldLabel : '工艺'
											}]
								}]
					}, {
						xtype : 'gridpanel',
						columnWidth : 1,
						itemId : 'stepgrid',
						store : me.stepStore,
						height : 300,
						columns : [{
									dataIndex : 'steporder',
									width : 40,
									text : '顺序',
									format : '0'
								}, {
									dataIndex : 'stepname',
									text : '工序流程'
								}, {
									dataIndex : 'stepParams',
									text : '制作参数',
									renderer : function(v, s, r, n) {
										var str = "";
										var flag = false;
										for (var i = 0; i < v.length; i++) {

											if (v[i].paramtype != '0') {
												flag = true;
											}

											// 直接文本输出
											if (v[i].paramtype == '0'
													&& v[i].paramvalue) {
												if (v[i].headdesc) {
													str += v[i].headdesc + ":";
												}

												str += v[i].paramvalue;

												if (v[i].footdesc) {
													str += v[i].footdesc;
												}
												str += "</p>";
											} else if (v[i].paramtype == '1') {
												if (v[i].paramvalue&&v[i].paramvalue=="1") {
													if (v[i].innerstep) {
														if (i == 0
																|| (v[i].innerstep != v[i
																		- 1].innerstep))
															str += v[i].innerstep
																	+ ":";
														else
															str += ",";
													} else {
														str += ",";
													}

													str += v[i].headdesc;

													if (v[i].footdesc) {
														str += v[i].footdesc;
													}

													if (i != v.length - 1
															&& v[i].innerstep != v[i
																	+ 1].innerstep) {
														str += "</p>";
													}
												}
											} else if (v[i].paramtype == '2'
													&& v[i].paramvalue) {

												if (v[i].headdesc) {
													str += v[i].headdesc + ":";
												}

												str += v[i].paramvalue;

												if (v[i].footdesc) {
													str += v[i].footdesc;
												}
												str += "</p>";
											} else if (v[i].paramtype == '3'
													&& v[i].paramvalue) {

												if (v[i].headdesc) {
													str += v[i].headdesc + ":";
												}
												for (var c = 0; c < v[i].comboList.length; c++) {

													if (v[i].paramvalue == v[i].comboList[c].dicvalue) {
														str += v[i].comboList[c].dicname;

													}
												}

												if (v[i].footdesc) {
													str += v[i].footdesc;
												}
												str += "</p>";
											}

										}
										if (flag) {
											// str += "<input type='button'
											// value='点击填写' onClick='wp("
											// + n + ")'/>";
										}
										if (str.charAt(0) == ",") {
											str = str.substring(1);
										}
										return str;
									},
									flex : 1
								}, {
									width : 40,
									renderer : function(v, m, r) {
										return r.data["countingDetail"]["num"];
									},
									text : '数量'
								}, {
									renderer : function(v, m, r) {
										if (r.data["countingDetail"]["expectdate"] == 0) {
											return "";
										}
										var t = r.data["countingDetail"]["expectdate"];
										var date;
										if (t && t != 0) {
											date = new Date(t);
										}

										return Ext.util.Format.date(date,
												'Y-m-d');
									},
									text : '预期完成时间'
								}, {
									renderer : function(v, m, r) {
										return r.data["countingDetail"]["recipient"];
									},
									text : '接收者签名'
								}, {
									renderer : function(v, m, r) {
										var t = r.data["countingDetail"]["accepttime"];
										var date;
										if (t && t != 0) {
											date = new Date(t);
										}

										return Ext.util.Format.date(date,
												'Y-m-d');
									},
									text : '接受时间'
								}, {
									renderer : function(v, m, r) {
										var t = r.data["countingDetail"]["handovertime"];
										var date;
										if (t && t != 0) {
											date = new Date(t);
										}

										return Ext.util.Format.date(date,
												'Y-m-d');
									},
									text : '转出时间'
								}, {
									renderer : function(v, m, r) {
										return r.data["countingDetail"]["ipqc"];
									},
									text : 'IPQC签名'
								}, {
									renderer : function(v, m, r) {
										return r.data["countingDetail"]["scrapnum"];
									},
									width : 60,
									text : '报废数量'
								}, {
									renderer : function(v, m, r) {
										return r.data["countingDetail"]["note"];
									},
									text : '备注',
									flex : 1
								}],
						viewConfig : {

						}
					}, {
						xtype : 'gridpanel',
						minHeight : 300,
						store : me.productStore,
						columns : [{
									header : "工程编号",
									flex : 1,
									dataIndex : "bcbh"
								}, {
									header : "客户编号",
									flex : 1,
									dataIndex : "clientid"
								}, {
									header : "是否返单",
									flex : 1,
									xtype : 'booleancolumn',
									trueText : '是',
									falseText : '否',
									dataIndex : "isfd"
								}, {
									header : "PCS尺寸",
									flex : 1,
									renderer : function(v, m, r) {
										return r.data["pcsx"] + "X"
												+ r.data["pcsy"];
									}
								}, {
									header : "SET尺寸",
									flex : 1,
									renderer : function(v, m, r) {
										return r.data["setx"] + "X"
												+ r.data["sety"];
									}
								}, {
									header : "set拼板数",
									dataIndex : "setps",
									flex : 1
								}, {
									header : "测试方式",
									dataIndex : "csfs",
									flex : 1
								}, {
									header : "交货日期",
									flex : 1,
									renderer : Ext.util.Format
											.dateRenderer("Y-m-d"),
									dataIndex : "jhrq"
								}, {
									header : "文件名称",
									dataIndex : 'projectName'

								}],
						viewConfig : {

						}
					}]
		});

		me.callParent(arguments);
	}

});