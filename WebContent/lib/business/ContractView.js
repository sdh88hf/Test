// 合同的审核
Ext.define("Pcbms.business.OrderView", {
			extend : "Ext.panel.Panel",
			alias : "widget.orderview",
			defaults : {
				style : "margin-left : 15px;",
				labelWidth : 65,
				layout : 'column',
				defaults : {
					labelWidth : 65,
					columnWidth : '0.5'
				}
			},
			getSubmitValue : function() {
				// 返回订单的计划信息
				var me = this;
				var form = me.getForm();
				return {
					"tlnum" : form.findField("tlnum").getValue(),
					"prodId" : me.data.prodId,
					"orderId" : me.data.orderId
				};
			},
			setData : function(formdata) {
				var me = this;
				me.data = formdata;
				var format = Ext.util.Format;
				formdata.projectfile = Pcbms.downfileRenderer(formdata["bcbh"],
						formdata["projectName"]);
				// pcs 尺寸信息
				formdata.pcsinfor = format.number(formdata["pcsX"], '0.0mm')
						+ format.number(formdata["pcsY"], '0.0mm');
				// set尺寸信息
				if (formdata["setPs"] > 1) {
					formdata.setinfor = formdata["setPs"] + "\u62fc "
							+ format.number(formdata["setX"], '0.0mm')
							+ format.number(formdata["setY"], '0.0mm');
				} else {
					formdata.setinfor = "\u5355\u62fc";
				}
				if (formdata["cs"] == "\u5355\u9762\u677f"
						|| formdata["cs"] == "\u53cc\u9762\u677f") {
					formdata.copper = formdata["wcth"];
				} else {
					formdata.copper = "\u5916\u5c42:" + formdata["wcth"]
							+ "\u5185\u5c42:" + formdata["ncth"];
				}
				if (formdata["isfd"]) {
					formdata.orderType = "\u8fd4\u5355 ";
				} else {
					formdata.orderType = "\u65b0\u5355 ";
				}
				formdata.orderType += formdata["bcbhType"];
				formdata.maskfont = formdata["zhColor"] + "\u6cb9"
						+ formdata["fontColor"] + "\u5b57";
			},
			buttons : [{
						text : '剔除订单',
						handler : function(f) {

						}
					}],
			initComponent : function() {
				var me = this;
				me.store = Ext.create('Ext.data.Store', {
							model : 'DeliveryPlanBean',
							proxy : {
								type : 'memory',
								reader : {
									type : 'json'
								}
							}
						});
				me.items = [{
							xtype : 'fieldset',
							title : '订单信息',
							items : [{
										xtype : "displayfield",
										fieldLabel : "订单编号",
										name : "orderId"
									}, {
										xtype : "combobox",
										fieldLabel : "订单类型",
										name : "orderType",
										store : [[2, '量产板'], [1, '样板'],
												[3, '报价板']]
									}, {
										xtype : "displayfield",
										fieldLabel : "单价",
										name : "unitPrice"
									}, {
										xtype : "displayfield",
										fieldLabel : "小记",
										name : "subtotal"
									}, {
										xtype : "displayfield",
										fieldLabel : "产品优先级",
										name : "jjType"
									}, {
										xtype : "displayfield",
										fieldLabel : "返单",
										name : "isfd"
									}, {
										xtype : "displayfield",
										fieldLabel : "总面积",
										name : "zmj"
									}, {
										xtype : "displayfield",
										fieldLabel : "测试方式",
										name : "csfs"
									}, {
										xtype : "displayfield",
										fieldLabel : "成型方式",
										name : "cxfs"
									}, {
										xtype : "displayfield",
										fieldLabel : "订单需求",
										name : "ddxq"
									}]
						}, {
							xtype : 'fieldset',
							title : '产品信息',
							items : [{
										xtype : "displayfield",
										fieldLabel : "产品编号",
										name : "prodId"
									}, {
										xtype : "displayfield",
										fieldLabel : "客户型号",
										name : "khxh"
									}, {
										xtype : "displayfield",
										fieldLabel : "文字阻焊",
										name : "fontzh"
									}, {
										xtype : "displayfield",
										fieldLabel : "板材材料",
										name : "bccl"
									}, {
										xtype : "displayfield",
										fieldLabel : "板材供应商",
										name : "bcgys"
									}, {
										xtype : "displayfield",
										fieldLabel : "板厚",
										name : "bh"
									}, {
										xtype : "displayfield",
										fieldLabel : "成品铜厚",
										name : "th"
									}, {
										xtype : "displayfield",
										fieldLabel : "工艺",
										name : "gy"
									}, {
										xtype : "displayfield",
										fieldLabel : "成型方式",
										name : "cxfs"
									}, {
										xtype : "displayfield",
										fieldLabel : "文件编号",
										name : "bcbh"
									}, {
										xtype : "displayfield",
										fieldLabel : "层数",
										name : "cs"
									}, {
										xtype : "displayfield",
										fieldLabel : "客户文件",
										name : "projectName"
									}, {
										xtype : "displayfield",
										fieldLabel : "PCS尺寸信息",
										name : "pcsinfor"
									}, {
										xtype : "displayfield",
										fieldLabel : "SET尺寸信息",
										name : "setinfor"
									}, {
										xtype : "displayfield",
										fieldLabel : "过孔处理",
										name : "gkcl"
									}, {
										xtype : 'numberfield',
										fieldLabel : "最小线宽",
										name : "minlw"
									}, {
										xtype : 'numberfield',
										fieldLabel : "最小线距",
										name : "minld"
									}, {
										xtype : 'numberfield',
										fieldLabel : "最小孔径",
										name : "minhole"
									}]
						}, {
							xtype : 'displayfield',
							value : '<b>发货详情</b>'
						}, {
							xtype : 'grid',
							columns : [{
								text : '发货时间',
								dataIndex : 'planDate',
								renderer : function(v) {
									if (v.getTime() < new Date().getTime()) {
										return "够数发货";
									}
									return Ext.util.Format
											.dateRenderer("Y-m-d");
								}
							}, {
								text : '发货数量',
								dataIndex : 'qty'
							}, {
								text : '收货地址',
								dataIndex : 'address',
								flex : 1
							}],
							store : me.store
						}, {
							xtype : 'fieldset',
							title : '生产安排',
							items : [{
										xtype : "displayfield",
										fieldLabel : "现有库存数量"
									}, {
										xtype : 'numberfield',
										fieldLabel : "本次订单安排",
										name : 'tlnum'
									}]
						}];
				me.callParent();
			}
		});
Ext.define("Pcbms.business.ContractView", {
	extend : "Ext.form.Panel",
	alias : "widget.contractview",
	storeId : "castore",
	defaults : {
		style : "margin-left : 15px;",
		labelWidth : 70,
		anchor : "100%",
		labelSeparator : ''
	},
	initComponent : function() {
		var me = this;
		me.ordertab = Ext.create('Ext.tab.Panel', {
					items : []
				});
		// 添加订单内容
		for (var i = 0; i < me.contractdata.productOrderList; i++) {
			me.ordertab.add(Ext.create("Pcbms.business.OrderView", {
						data : me.contractdata.productOrderList[i]
					}));
		}
		me.contract = Ext.create('Ext.form.FieldSet', {
					title : '合同信息',
					defaults : {
						xtype : 'displayfield',
						columnWidth : 0.25,
						labelWidth : 70
					},
					layout : 'column',
					items : [{
								xtype : 'hidden',
								name : "contract.contractId",
								value : me.contractdata.contractId
							}, {
								fieldLabel : "合同编号",
								value : me.contractdata.contractId
							}, {
								fieldLabel : "创建时间",
								value : me.contractdata.createDate
							}, {
								fieldLabel : "创建人",
								value : me.contractdata.creatorName
							}, {
								fieldLabel : "合计金额",
								value : Ext.util.Format
										.currency(me.contractdata.amount)
							}, {
								fieldLabel : "实际价格",
								value : Ext.util.Format
										.currency(me.contractdata.actualAmount)
							}, {
								fieldLabel : "优惠方式",
								value : me.contractdata.concessionsType
							}, {
								fieldLabel : "是否含税",
								columnWidth : 0.5,
								value : me.contractdata.tax
										? "<span style='color:red'>含税</span>"
										: "<span style='color:green'>不含税</span>"
							}, {
								fieldLabel : "付款方式",
								value : me.contractdata.payMethod
							}, {
								fieldLabel : "付款详细",
								columnWidth : 0.75,
								value : me.contractdata.payNote
							}, {
								fieldLabel : "物流公司",
								value : me.contractdata.logistics
							}, {
								fieldLabel : "收货信息",
								columnWidth : 0.75,
								value : Pcbms.receiveRenderer(me.contractdata)
							}]
				});
		me.client = Ext.create('Ext.form.FieldSet', {
			title : '客户信息',
			defaults : {
				xtype : 'displayfield',
				columnWidth : 0.25,
				labelWidth : 70
			},
			layout : 'column',
			items : [{
						fieldLabel : "客户编号",
						value : me.contractdata.clientBean.userid
					}, {
						fieldLabel : "注册时间",
						value : me.contractdata.clientBean.createDate
					}, {
						fieldLabel : "公司名称",
						value : me.contractdata.clientBean.company
					}, {
						fieldLabel : "联系人",
						value : me.contractdata.clientBean.contact
					}, {
						fieldLabel : "客户级别",
						value : me.contractdata.clientBean.clientlevel
					}, {
						fieldLabel : "所属区域",
						value : me.contractdata.clientBean.region
					}, {
						fieldLabel : "联系电话",
						value : me.contractdata.clientBean.telephone
					}, {
						fieldLabel : "QQ",
						value : me.contractdata.clientBean.payMethod
					}, {
						fieldLabel : "EMAIL",
						value : me.contractdata.clientBean.email
					}, {
						fieldLabel : "同步类型",
						value : Pcbms
								.synctypeRenderer(me.contractdata.clientBean.synctype)
					}]
		});
		me.salesman = Ext.create('Ext.form.FieldSet', {
					title : '所属业务员信息',
					defaults : {
						xtype : 'displayfield',
						columnWidth : 0.25,
						labelWidth : 70
					},
					layout : 'column',
					items : [{
						fieldLabel : "业务员",
						value : "#" + me.contractdata.employeeBean.userid + ","
								+ me.contractdata.employeeBean.name
					}, {
						fieldLabel : "手机号码",
						value : me.contractdata.employeeBean.mobile
					}, {
						fieldLabel : "座机号码",
						value : me.contractdata.employeeBean.telephone
					}, {
						fieldLabel : "QQ",
						value : me.contractdata.employeeBean.qq
					}]
				});
		me.items = [me.contract, me.client, me.salesman, {
					xtype : 'displayfield',
					value : '<b>合同内容详细:</b>',
					margin : "10 0 5 15"
				}, me.ordertab, {
					xtype : 'displayfield',
					fieldLabel : '合同备注',
					value : me.contractdata.contractNote
				}, {
					xtype : 'displayfield',
					value : me.contractdata.auditNote,
					fieldLabel : "审核备注"
				}];
		me.buttons = [{
			text : '打印合同',
			scale : "medium",
			handler : function(v) {
				
			}
		}]
		me.callParent();
	}
});