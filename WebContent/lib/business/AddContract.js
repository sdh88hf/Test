Ext.define('Pcbms.business.AddContract', {
	extend : 'Ext.form.Panel',
	alias : "widget.ctadd",
	bodyPadding : 10,
	formsubmit : function() {
		var me = this;
		var params = {};
		var flag = true;
		// 判断必填项是否有填写
		Ext.each(me.down("#info").items.items, function() {
					if (!this.isValid()) {
						flag = false;
					}
					params[this.getName()] = this.getValue();
				});
		if (flag) {
			var items = me.store.data.items;
			// 如果未添加任何产品
			if (items.length == 0) {
				Ext.Msg.alert("提示", "尚未添加任何产品,不能提交");
				return;
			} else {

				for (var i = 0; i < items.length; i++) {

					for (var k in items[i].data) {
						if (k == "jhrq") {
							var date = new Date(items[i].data[k]);
							params["contract.productList[" + i + "]." + k] = date
									.getTime();
						} else {
							params["contract.productList[" + i + "]." + k] = items[i].data[k];
						}

					}
				}

				Ext.Ajax.request({
					url : "/contractManagementAction!addContract.action",
					params : params,
					type : 'post',
					success : new Pcbms.ajaxHandler({
								success : function(str) {
									Ext.Msg.alert("提示", str.msg);
									me.getForm().reset();
									me.store.removeAll();
								},
								error : function(r) {
									Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
								}
							})
				});

			}
		}
	},
	initComponent : function() {
		var me = this;
		var storeid = "ctstore";
		me.store = Ext.create("Ext.data.ArrayStore", {
					model : "Product",
					data : []
				});
		Ext.applyIf(me, {
			items : [{
				xtype : 'container',
				itemId : 'info',
				defaults : {
					margins : '0 10 10 0'
				},
				layout : {
					type : 'hbox'
				},
				items : [{
							xtype : 'textfield',
							fieldLabel : '合同编号',
							allowBlank : false,
							name : "contract.contractid",
							labelWidth : 60,
							flex : 1
						}, {
							xtype : 'textfield',
							fieldLabel : '选择客户',
							name : 'contract.clientid',
							allowBlank : false,
							labelWidth : 60,
							flex : 1,
							onFocus : function() {
								if (!this.clientWindow) {
									this.clientWindow = Ext.create(
											"Ext.window.Window", {
												width : 750,
												closeAction : 'hide',
												height : 300,
												modal : true,
												title : '客户选择',
												layout : 'fit',
												items : [{
															xtype : "clientgrid",
															target : this
														}]
											});

								}

								this.clientWindow.show();

							},
							onChange : function() {
								me.down("#apform").setClient(this.getValue());
							}
						}, {
							xtype : 'numberfield',
							fieldLabel : '金额',
							allowBlank : false,
							name : "contract.amount",
							labelWidth : 30,
							flex : 1
						}, {
							xtype : 'empcombo',
							fieldLabel : '业务员',
							name : 'contract.salesman',
							// hideTrigger
							// : true,
							allowBlank : false,
							cn : 'ywy',
							labelWidth : 45,
							flex : 1
						}, {
							xtype : 'empcombo',
							fieldLabel : '审单员',
							// hideTrigger
							// : true,
							name : 'contract.auditor',
							allowBlank : false,
							cn : 'sdy',
							labelWidth : 45,
							flex : 1
						}]
			}, {
				xtype : 'container',
				layout : {
					type : 'hbox'
				},
				items : [{
					xtype : 'form',
					bodyPadding : 10,
					frame : true,
					itemId : 'apform',
					disabled : true,
					setClient : function(id) {
						this.setDisabled(false);
						this.clientid = id;
					},
					buttons : [{
						text : '添加产品',
						iconCls : "add",
						handler : function() {
							// 判断表单是否验证通过
							if (this.up("form").getForm().isValid()) {
								var items = me.store.data.items;

								var form = this.up("form").getForm()
										.getValues();
								for (var i = 0; i < items.length; i++) {
									if (form["bcbh"] == items[i].data["bcbh"]) {
										Ext.Msg.alert("提示", "该工程编号产品已存在请重新选择");
										return;
									}
								}
								me.store.insert(0, form);
								this.up("form").getForm().reset();
							}
						}
					}],
					title : '产品添加',
					items : [{
						xtype : 'textfield',
						fieldLabel : '工程编号',
						allowBlank : false,
						name : 'bcbh',
						anchor : '100%',
						onFocus : function() {
							var t = this;
							me.ptWindow = Ext.create("Ext.window.Window", {
								width : 900,
								height : 500,
								title : "产品型号选择",
								modal : true,
								closeAction : 'hide',
								layout : 'fit',
								items : [{
									xtype : 'ptChoice',
									clientid : this.up("form").clientid,
									listeners : {
										"itemclick" : function(b) {
											var s = checkGridSelect(b
															.up("gridpanel"), 1);
											t.setValue(s[0].data["bcbh"]);

											me.ptWindow.close();
										}
									}
								}]
							});

							me.ptWindow.show();
						}
					}, {
						xtype : 'datefield',
						fieldLabel : '交期',
						submitFormat : "U000",
						allowBlank : false,
						name : 'jhrq',
						anchor : '100%'
					}, {
						xtype : 'numberfield',
						fieldLabel : '数量',
						minValue : 1,
						allowBlank : false,
						name : 'num',
						onChange : function(e) {
							me.getForm().findField("wzgzbnum").setValue(e);
						},
						anchor : '100%'
					}, {
						xtype : 'numberfield',
						fieldLabel : '未组工作板数量',
						minValue : 1,
						allowBlank : false,
						name : 'wzgzbnum',
						anchor : '100%'
					}, {
						xtype : 'numberfield',
						fieldLabel : '金额',
						minValue : 1,
						allowBlank : false,
						name : 'price',
						anchor : '100%'
					}, {
						xtype : 'pubcombo',
						fieldLabel : '管制卡优先级',
						flex : 1,
						name : 'jjType',
						allowBlank : false,
						type : 11
					}, {
						xtype : 'radiogroup',
						fieldLabel : '是否返单',
						items : [{
									xtype : 'radiofield',
									name : 'isfd',
									inputValue : 1,
									boxLabel : '是'
								}, {
									xtype : 'radiofield',
									name : 'isfd',
									checked : true,
									inputValue : 0,
									boxLabel : '否'
								}]
					}, {
						xtype : 'radiogroup',
						fieldLabel : '是否外包',
						items : [{
									xtype : 'radiofield',
									name : 'isoutsourcing',
									inputValue : 1,
									boxLabel : '是'
								}, {
									xtype : 'radiofield',
									name : 'isoutsourcing',
									inputValue : 0,
									checked : true,
									boxLabel : '否'
								}]
					}]
				}, {
					xtype : 'gridpanel',
					height : "100%",
					store : me.store,
					title : '合同产品列表',
					flex : 1,
					tbar : ["->", {
						text : '删除',
						handler : function() {
							var selection = this.up("grid").getSelectionModel()
									.getSelection()[0];
							if (selection) {
								me.store.remove(selection);
							} else {
								Ext.Msg.alert("提示", "请选择需要删除的数据");
							}

						}
					}],
					columns : [{
								xtype : 'gridcolumn',
								flex : 1,
								dataIndex : "bcbh",
								text : '工程编号'
							}, {
								xtype : 'datecolumn',
								flex : 1,
								dataIndex : "jhrq",
								text : '交期'
							}, {
								xtype : 'numbercolumn',
								flex : 1,
								dataIndex : 'num',
								format : '0',
								text : '数量'
							}, {
								xtype : 'numbercolumn',
								flex : 1,
								dataIndex : 'wzgzbnum',
								format : '0',
								text : '未组工作板数量'
							}, {
								xtype : 'numbercolumn',
								flex : 1,
								dataIndex : 'price',
								text : '金额'
							}, {
								flex : 1,
								dataIndex : 'jjType',
								text : '管制卡优先级'
							}, {
								xtype : 'booleancolumn',
								flex : 1,
								dataIndex : 'isfd',
								falseText : '否',
								trueText : '是',
								text : '是否返单'
							}, {
								xtype : 'booleancolumn',
								flex : 1,
								dataIndex : 'isoutsourcing',
								falseText : '否',
								trueText : '是',
								text : '是否外包'
							}],
					viewConfig : {

					}
				}]
			}, {
				xtype : 'container',
				layout : {
					pack : 'center',
					type : 'hbox'
				},
				items : [{
							xtype : 'button',
							text : '创建合同',
							iconCls : "AgreementAdd",
							flex : 1,
							handler : function() {
								me.formsubmit();
							}
						}]
			}]
		});
		me.callParent(arguments);
		me.getForm().isValid();
	}
});