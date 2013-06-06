// 合同的审核
Ext.define("Pcbms.business.OrderAuditForm", {
	extend : "Ext.panel.Panel",
	alias : "widget.orderauditform",
	layout : "column",
	defaults : {
		margin : '0 10 0 0',
		columnWidth : 0.33,
		defaults : {
			labelWidth : 80
		}
	},
	padding : 15,
	paramIndex : 0,
	buttons : [{
		text : '标记',
		handler : function(f) {
			var tab = f.up("orderauditform");
			tab.setTitle("<b style='color:red'>" + tab.jsonData.orderId
					+ "*</b>");
		}
	}, {
		text : '剔除订单',
		handler : function(f) {
			Ext.Msg.prompt("操作确认", "确认将本订单设置为无效的订单?请输入原因!",
					function(v, reason) {
						if (v == "ok") {
							var me = f.up("orderauditform");
							me.getEl().mask("正在删除中...");
							var orderid = me.jsonData.orderId;
							Ext.Ajax.trequest({
										url : 'contractAction!refuseOrder.action',
										params : {
											"refusedOrderBean.orderId" : orderid,
											"refusedOrderBean.reason" : reason
										},
										success : function() {
											me.getEl().unmask();
											Ext.Msg.alert("操作成功!", "订单剔除成功!",
													function() {
														// 成功
														window.location
																.reload();
													});
										},
										failure : function(r) {
											me.getEl().unmask();
											Ext.Msg.alert("出现错误", r.msg);
										},
										serverfailure : function() {
											me.getEl().unmask();
											Ext.Msg.alert(
													"\u540e\u53f0\u9519\u8bef",
													"\u540e\u53f0\u54cd\u5e94:"
															+ response.status);
										}
									})
						}
					})
		}
	}],
	initComponent : function() {
		var me = this;
		var data = me.jsonData;
		me.items = [{
					xtype : 'fieldset',
					title : '订单信息',
					items : [{
								xtype : "displayfield",
								fieldLabel : "订单编号",
								name : "orderId",
								value : data.orderId
							}, {
								xtype : "displayfield",
								fieldLabel : "订单类型",
								name : "orderType",
								value : Pcbms.orderTypeRenderer(data.orderType)
							}, {
								xtype : "displayfield",
								fieldLabel : "单价",
								name : "unitPrice",
								value : Ext.util.Format
										.currency(data.unitPrice)
							}, {
								xtype : "displayfield",
								fieldLabel : "小记",
								name : "subtotal",
								value : Ext.util.Format.currency(data.subtotal)
							}, {
								xtype : "displayfield",
								fieldLabel : "需求数量",
								name : "num",
								value : data.num + " pcs"
							}, {
								xtype : "displayfield",
								fieldLabel : "产品优先级",
								name : "jjType",
								value : Pcbms.JJTypeRenderer(data.jjType)
							}, {
								xtype : "displayfield",
								fieldLabel : "返单",
								name : "isfd",
								value : Pcbms.FdRenderer(data.isfd)
							}, {
								xtype : "displayfield",
								fieldLabel : "总面积",
								name : "zmj",
								value : Pcbms.SizeRenderer(data.zmj)
							}, {
								xtype : "displayfield",
								fieldLabel : "测试方式",
								name : "csfs",
								value : data.csfs
							}, {
								xtype : "displayfield",
								fieldLabel : "成型方式",
								name : "cxfs",
								value : data.csfs
							}, {
								xtype : "displayfield",
								fieldLabel : "订单需求",
								name : "ddxq",
								value : data.ddxq
							}]
				}, {
					xtype : 'fieldset',
					title : '产品信息',
					items : [{
								xtype : "displayfield",
								fieldLabel : "产品编号",
								name : "prodId",
								value : data.prodId
							}, {
								xtype : "displayfield",
								fieldLabel : "客户型号",
								name : "khxh",
								value : data.khxh
							}, {
								xtype : "displayfield",
								fieldLabel : "文字阻焊",
								name : "fontzh",
								value : data["zhColor"] + "\u6cb9"
										+ data["fontColor"] + "\u5b57"
							}, {
								xtype : "displayfield",
								fieldLabel : "板材材料",
								name : "bccl",
								value : data.bccl
							}, {
								xtype : "displayfield",
								fieldLabel : "板材供应商",
								name : "bcgys",
								value : data.bcgys
							}, {
								xtype : "displayfield",
								fieldLabel : "板厚",
								name : "bh",
								value : data.bh
							}, {
								xtype : "displayfield",
								fieldLabel : "成品铜厚",
								value : Pcbms.copperRenderer(data)
							}, {
								xtype : "displayfield",
								fieldLabel : "工艺",
								name : "gy",
								value : data.gy
							}, {
								xtype : "displayfield",
								fieldLabel : "成型方式",
								name : "cxfs",
								value : data.cxfs
							}, {
								xtype : "displayfield",
								fieldLabel : "文件编号",
								name : "bcbh",
								value : data.bcbh
							}, {
								xtype : "displayfield",
								fieldLabel : "层数",
								name : "cs",
								value : data.cs
							}, {
								xtype : "displayfield",
								fieldLabel : "客户文件",
								name : "projectName",
								value : data.projectName
							}, {
								xtype : "displayfield",
								fieldLabel : "PCS尺寸信息",
								value : Pcbms.ProjectSizeRenderer(data)
							}, {
								xtype : "displayfield",
								fieldLabel : "SET尺寸信息",
								hidden : data.setPs < 2,
								value : Pcbms.SetSizeRenderer(data)
							}, {
								xtype : "displayfield",
								fieldLabel : "过孔处理",
								name : "gkcl",
								value : data.gkcl
							}, {
								xtype : "hiddenfield",
								name : "productPlanList[" + me.paramIndex
										+ "].orderId",
								value : data.orderId
							}, {
								xtype : "hiddenfield",
								name : "productPlanList[" + me.paramIndex
										+ "].bcbh",
								value : data.bcbh
							}, {
								xtype : "hiddenfield",
								name : "productPlanList[" + me.paramIndex
										+ "].prodId",
								value : data.prodId
							}, {
								xtype : 'numberfield',
								minValue : 0,
								fieldLabel : "最小线宽",
								name : "productPlanList[" + me.paramIndex
										+ "].minlw",
								value : data.minlw
							}, {
								xtype : 'numberfield',
								fieldLabel : "最小线距",
								minValue : 0,
								name : "productPlanList[" + me.paramIndex
										+ "].minld",
								value : data.minld
							}, {
								xtype : 'numberfield',
								fieldLabel : "最小孔径",
								minValue : 0,
								name : "productPlanList[" + me.paramIndex
										+ "].minhole",
								value : data.minhole
							}]
				}, {
					xtype : 'fieldset',
					title : '生产安排',
					items : [{
								xtype : "displayfield",
								fieldLabel : "现有库存数量",
								name : 'stockqty',
								value : data.stockQty
							}, {
								xtype : 'textfield',
								fieldLabel : "加急类型",
								name : "productPlanList[" + me.paramIndex
										+ "].jjType",
								value : data.jjType
							}, {
								xtype : 'textfield',
								fieldLabel : "成型方式",
								name : "productPlanList[" + me.paramIndex
										+ "].cxfs",
								value : data.cxfs
							}, {
								xtype : 'textfield',
								fieldLabel : "测试方式",
								name : "productPlanList[" + me.paramIndex
										+ "].csfs",
								value : data.csfs
							}, {
								xtype : 'numberfield',
								fieldLabel : "本次订单安排",
								name : "productPlanList[" + me.paramIndex
										+ "].tlnum",
								value : data.num - data.stockQty
							}, {
								xtype : 'textarea',
								columnWidth : 1,
								fieldLabel : '生产备注',
								name : "productPlanList[" + me.paramIndex
										+ "].ppNote",
								value : data.ddxq
							}]
				}];
		me.callParent();
	}
});
Ext.define("Pcbms.business.ContractAuditForm", {
	extend : "Ext.form.Panel",
	alias : "widget.contractauditform",
	border : false,
	defaults : {
		style : "margin-left : 15px;",
		labelWidth : 70,
		anchor : "100%",
		labelSeparator : ''
	},
	initComponent : function() {
		var me = this;
		var tabconfig = {
			activeTab : 0,
			items : []
		}
		var contractdata = me.jsonData.result;
		// 添加订单内容
		var orders = contractdata.productOrderList;
		var orderids = [];
		Ext.each(orders, function(order, i) {
					tabconfig.items.push({
								xtype : 'orderauditform',
								jsonData : order,
								id : order.orderId,
								paramIndex : i,
								title : '订单' + order.orderId
							});
					orderids.push(order.orderId);
				});
		me.ordertab = Ext.create('Ext.tab.Panel', tabconfig);
		me.store = Ext.create('Ext.data.Store', {
					model : 'DeliveryPlanBean',
					proxy : {
						type : 'memory',
						reader : {
							type : 'json'
						}
					},
					data : contractdata.deliveryPlanList
				});
		var editing = Ext.create('Ext.grid.plugin.CellEditing');
		var sel = Ext.create("Ext.selection.RowModel", {
					listeners : {
						selectionchange : function(model, selected) {
							if (selected.length == 0) {
								deleteAction.setDisabled(true);
							} else {
								deleteAction.setDisabled(false);
								var orderid = selected[0].get("orderId");
								if (orderid != "") {
									me.ordertab.setActiveTab(orderid);
								}
							}
						}
					}
				});
		var addAction = new Ext.Action({
					text : '添加发货计划',
					disabled : true,
					handler : function() {
						var rec = new DeliveryPlanBean({
									orderId : ''
								});
						editing.cancelEdit();
						me.store.insert(0, rec);
						editing.startEditByPosition({
									row : 0,
									column : 1
								});
					}
				});
		var deleteAction = new Ext.Action({
					text : '删除发货计划',
					disabled : true,
					handler : function() {
						var selection = sel.getSelection()[0];
						if (selection) {
							me.store.remove(selection);
						}
					}
				});
		me.items = [{
					xtype : 'displayfield',
					value : '<h3>合同信息审核</h3>'
				}, {
					xtype : 'container',
					layout : "column",
					defaults : {
						margin : '0 10 0 0',
						xtype : 'fieldset',
						columnWidth : 0.33,
						defaults : {
							labelWidth : 80
						}
					},
					items : [{
						title : '合同客户信息',
						defaults : {
							xtype : 'displayfield'
						},
						items : [{
									fieldLabel : "客户编号",
									value : contractdata.clientBean.userid
								}, {
									fieldLabel : "注册时间",
									value : contractdata.clientBean.createDate
								}, {
									fieldLabel : "公司名称",
									value : contractdata.clientBean.company
								}, {
									fieldLabel : "联系人",
									value : contractdata.clientBean.contact
								}, {
									fieldLabel : "客户级别",
									value : contractdata.clientBean.clientlevel
								}, {
									fieldLabel : "所属区域",
									value : contractdata.clientBean.region
								}, {
									fieldLabel : "联系电话",
									value : contractdata.clientBean.telephone
								}, {
									fieldLabel : "QQ",
									value : contractdata.clientBean.payMethod
								}, {
									fieldLabel : "EMAIL",
									value : contractdata.clientBean.email
								}, {
									fieldLabel : "同步类型",
									value : Pcbms
											.synctypeRenderer(contractdata.clientBean.synctype)
								}]
					}, {
						title : '所属业务员信息',
						defaults : {
							xtype : 'displayfield'
						},
						items : [{
							fieldLabel : "业务员",
							value : "#" + contractdata.employeeBean.userid
									+ "," + contractdata.employeeBean.name
						}, {
							fieldLabel : "手机号码",
							value : contractdata.employeeBean.mobile
						}, {
							fieldLabel : "座机号码",
							value : contractdata.employeeBean.telephone
						}, {
							fieldLabel : "QQ",
							value : contractdata.employeeBean.qq
						}]
					}, {
						title : '合同信息',
						defaults : {
							xtype : 'displayfield'
						},
						items : [{
									xtype : "textfield",
									fieldLabel : "合同编号",
									readOnly : true,
									name : "contract.contractId",
									value : contractdata.contractId
								}, {
									fieldLabel : "创建时间",
									columnWidth : 0.5,
									value : contractdata.createDate
								}, {
									fieldLabel : "创建人",
									value : contractdata.creatorName
								}, {
									xtype : 'numberfield',
									fieldLabel : "合计金额",
									name : "contract.amount",
									readOnly : true,
									value : contractdata.amount
								}, {
									xtype : 'numberfield',
									fieldLabel : "实际价格",
									name : "contract.actualAmount",
									value : contractdata.actualAmount
								}, {
									fieldLabel : "优惠方式",
									xtype : 'textfield',
									name : "contract.concessionsType",
									value : contractdata.concessionsType
								}, {
									fieldLabel : "是否含税",
									columnWidth : 0.5,
									value : contractdata.tax
											? "<span style='color:red'>含税</span>"
											: "<span style='color:green'>不含税</span>"
								}, {
									fieldLabel : "付款方式",
									value : contractdata.payMethod
								}, {
									fieldLabel : "付款详细",
									columnWidth : 0.75,
									value : contractdata.payNote
								}, {
									fieldLabel : "物流公司",
									value : contractdata.logistics
								}, {
									fieldLabel : "收货信息",
									columnWidth : 0.75,
									value : Pcbms.receiveRenderer(contractdata)
								}]
					}]
				}, {
					xtype : 'displayfield',
					value : '<b>合同内容详细:</b>',
					margin : "10 0 5 15"
				}, me.ordertab, {
					xtype : 'displayfield',
					value : '<b>合同发货详情</b>'
				}, {
					xtype : 'grid',
					plugins : [editing],
					tbar : [addAction, deleteAction],
					selModel : sel,
					emptyText : '无发货计划信息',
					columns : [{
								xtype : "rownumberer"
							}, {
								text : '订单编号',
								dataIndex : 'orderId',
								width : 120,
								editor : {
									xtype : 'combobox',
									store : orderids
								}
							}, {
								text : '计划发货时间',
								dataIndex : 'planDate',
								width : 100,
								renderer : function(v) {
									if (v == null) {
										return "";
									}
									if (v.getTime() < new Date().getTime()) {
										return "够数发货";
									}
									return Ext.util.Format
											.dateRenderer("Y-m-d")(v);
								},
								editor : {
									xtype : 'datefield'
								}
							}, {
								text : '发货数量',
								dataIndex : 'qty',
								width : 80,
								editor : {
									xtype : 'numberfield'
								}
							}, {
								text : '发货方式',
								dataIndex : 'logistics',
								editor : {
									xtype : 'textfield'
								}
							}, {
								text : '收货地址',
								dataIndex : 'address',
								flex : 1,
								editor : {
									xtype : 'combobox'

								}
							}],
					store : me.store
				}, {
					xtype : 'displayfield',
					fieldLabel : '合同备注',
					value : contractdata.contractNote
				}, {
					xtype : 'textarea',
					labelAlign : 'top',
					name : 'contract.auditNote',
					fieldLabel : "审核备注"
				}];
		me.buttons = [{
			text : '退回订单',
			scale : "medium",
			handler : function(v) {
				var form = this.up('form').getForm();
				if (form.get("auditNote") == "") {
					Ext.Msg.alert("操作错误", "需退回的订单请填写审核内容!");
					return;
				}
				Ext.Msg.confirm("确认操作", "确认将当前的合同 退回?", function(v) {
					if (v = "yes") {
						var sf = {
							clientValidation : true,
							waitMsg : "正在提交审核,请稍后!",
							url : 'contractAction!rejectContract.action',
							success : function(form, action) {
								if (Ext.isEmpty(action.result.contract)) {
									Ext.Msg.confirm("操作成功",
											action.result.msg, function() {
												// 关闭当前审核的
												window.close();
											})
								} else {
									Ext.Msg.confirm('操作成功!',
											action.result.msg
													+ ",是否处理审核下个数据?", function(
													b) {
												if (b == 'yes') {
													window.location
															.replace("contractAction!auditInput.action?contract.contractId="
																	+ action.result.contract.contractId);
												} else {
													window.close();
												}
											});
								}
							},
							failure : function(form, action) {
								Ext.Msg.alert('出现错误', action.result
												? action.result.msg
												: '系统错误');
							}
						};
						form.submit(sf);
					}
				});
			}
		}, {
			text : '审核通过',
			scale : "medium",
			handler : function(v) {
				var me = v.up('contractauditform');
				var form = me.getForm();
				if (form.isValid()) {
					Ext.Msg.confirm("温馨提示", "确认将本合同审核通过?", function(v) {
						if (v = "yes") {
							var params = {
								"contract.contractId" : contractdata.contractId
							};
							me.store.each(function(r, i) {
										params["deliveryList[" + i + "].dpId"] = r
												.get("dpId");
										params["deliveryList[" + i + "].qty"] = r
												.get("qty");
										params["deliveryList[" + i
												+ "].logistics"] = r
												.get("logistics");
									});
							var sf = {
								clientValidation : true,
								waitMsg : "正在提交审核,请稍后!",
								params : params,
								url : 'contractAction!permitContract.action',
								success : function(form, action) {
									if (Ext.isEmpty(action.result.contract)) {
										Ext.Msg.confirm("操作成功",
												action.result.msg, function() {
													// 关闭当前审核的
													window.close();
												})
									} else {
										Ext.Msg.confirm('操作成功!',
												action.result.msg
														+ ",是否处理审核下个数据?",
												function(b) {
													if (b == 'yes') {
														window.location
																.replace(Ext.String
																		.format(
																				Pcbms.contractauditurl,
																				action.result.contract.contractId));
													} else {
														window.close();
													}
												});
									}
								},
								failure : function(form, action) {
									Ext.Msg.alert('出现错误', action.result
													? action.result.msg
													: '系统错误');
								}
							};

							form.submit(sf);
						}
					});

				}
			}
		}]
		me.callParent();
	}
});