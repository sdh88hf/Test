Ext.define('Pcbms.business.AddEcn', {
	extend : 'Ext.form.Panel',
	alias : "widget.ecnadd",
	bodyPadding : 10,
	bcbh : "",
	createBcbh : function() {// 生成工程编号
		var params = {};
		Ext.each(this.getForm().getFields().items, function(item) {
					if (!item.getName()) {
						return;
					}
					if (item.getName().indexOf("ecn.") < 0) {
						return;
					}
					if (item.getXType() == "filefield") {
						return;
					}
					var key = "projectFile" + item.getName().replace("ecn", "");
					if (item.getXType() == "radiofield") {
						if (item.getValue() && item.getName() == "ecn.bcbhtype") {
							params[key] = item.inputValue;
						} else if (item.getValue()) {
							params[key] = item.boxLabel;
						}
					} else if (item.getXType() == "displayfield") {

					} else if (item.getValue() != null && item.getValue() != "") {
						params[key] = item.getValue();
					}
				});

		var me = this;
		Ext.Ajax.request({
					url : "/projectFileAction!generateBcbh.action",
					params : params,
					success : new Pcbms.ajaxHandler({
								success : function(str) {
									me.bcbh = str.bcbh;
									me.getForm().findField("ecn.xbcbh")
											.setValue(me.bcbh);
								},
								error : function(r) {
									Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
								}
							})
				});

	},
	formsubmit : function() {// 表单提交
		var me = this;
		if (this.bcbh != "") {
			var str = me.getForm().findField("version").getValue();
			this.getForm().findField("ecn.xbcbh").setValue(me.bcbh + str);
		}
		this.getForm().submit({
			url : '/ecnAction!addECN.action',
			success : function(form, action) {
				Ext.Msg.alert("提示", action.result.msg);
				me.destroy();
				Ext.getCmp("mainpanel").loadControl(Ext.getCmp("menulist")
						.getSelectionModel().getSelection()[0].raw);
			},
			failure : Pcbms.formHandler

		});
	},
	formLoad : function(data) {
		var me = this;
		me.data = data;
		Ext.each(me.getForm().getFields().items, function(i) {
			if (i.getName() && i.getName() != "ecn.ybcbh"
					&& i.getName() != "ecn.xbcbh") {

				if (i.getXType() == "radiofield") {
					if (i.getName() == "ecn.bcbhtype") {

						if (data[i.getName().replace("ecn.", "")] == i.inputValue) {
							i.setValue(true);
						} else {
							i.setValue(false);
						}

					} else {
						if (data[i.getName().replace("ecn.", "")] == i.boxLabel) {
							i.setValue(true);
						} else {
							i.setValue(false);
						}

					}

				}

				if (i.getName().indexOf("ecn.") >= 0) {
					i.setValue(data[i.getName().replace("ecn.", "")]);
				}

			}

		});

		me.getForm().findField("ecn.xbcbh").setValue("");
		Ext.each(me.getForm().getFields().items, function(i) {
					// 给每个元素添加更变事件
					i.addListener("change", function() {

								me.changeContent();
							});

				});
		me.getForm().findField("ecn.ggnr").setValue("");
	},
	changeContent : function() {
		var me = this;

		var changeContent = {};

		Ext.each(me.getForm().getFields().items, function(item) {
			if (!item.getName()) {
				return;
			}
			if (item.getName().indexOf("ecn.") < 0) {
				return;
			}
			if (item.getXType() == "radiofield") {

				if (item.value && !changeContent[item.ownerCt.fieldLabel]) {

					if (item.ownerCt.getValue()[item.getName()] != me.data[item
							.getName().replace("ecn.", "")]) {
						changeContent[item.ownerCt.fieldLabel] = [
								item.ownerCt.fieldLabel,
								item.ownerCt.getValue()[item.getName()],
								me.data[item.getName().replace("ecn.", "")]];
					}
				}
			} else if ((item.getXType() == "textfield"
					|| item.getXType() == "numberfield" || item.getXType() == "pubcombo")
					&& item.getName() != "ecn.ybcbh"
					&& item.getName() != "ecn.xbcbh"
					&& !changeContent[item.fieldLabel]) {

				if (item.getValue() != me.data[item.getName().replace("ecn.",
						"")]) {

					changeContent[item.fieldLabel] = [item.fieldLabel,
							item.getValue(),
							me.data[item.getName().replace("ecn.", "")]];
				} else {

					changeContent[item.fieldLabel] = [item.fieldLabel, "", ""];
				}

			}

		});
		var str = "";
		for (var i in changeContent) {

			if (changeContent[i][0] && changeContent[i][2]
					&& changeContent[i][1])
				str += changeContent[i][0] + "由" + changeContent[i][2] + "更变成"
						+ changeContent[i][1] + ",";
		}

		if (me.getForm().findField("ecn.customerFile").getValue()
				&& me.getForm().findField("ecn.customerFile").getValue() != "") {
			str += "修改了客户文件";
		} else if (str.length > 0) {
			str = str.substring(0, str.length - 1);
		}

		me.getForm().findField("ecn.ggnr").setValue(str);

	},
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [{
				xtype : 'container',
				defaults : {
					margins : '0 10 0 0'
				},
				layout : {
					type : 'hbox'
				},
				items : [{
					xtype : 'textfield',
					fieldLabel : '原工程编号',
					labelWidth : 75,
					name : 'ecn.ybcbh',
					allowBlank : false,
					editable : false,
					onFocus : function() {
						var t = this;
						if (!me.ptWindow) {
							me.ptWindow = Ext.create("Ext.window.Window", {
								width : 900,
								height : 500,
								title : "原产品型号选择",
								modal : true,
								closeAction : 'hide',
								layout : 'fit',
								items : [{
									xtype : 'ptChoice',
									listeners : {
										"itemclick" : function(b) {
											var s = checkGridSelect(b
															.up("gridpanel"), 1);
											t.setValue(s[0].data["bcbh"]);
											me.formLoad(s[0].data);
											me.ptWindow.close();
										}
									}
								}]
							});
						}

						me.ptWindow.show();
					}
				}, {
					xtype : 'textfield',
					fieldLabel : '客户编号',
					labelWidth : 75,
					allowBlank : false,
					name : 'ecn.clientid',
					readOnly : true,
					listeners : {
						focus : function() {
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

						}
					}
				}]
			}, {
				xtype : 'container',
				defaults : {
					margins : '0 10 0 0'
				},
				layout : {
					type : 'hbox'
				},
				items : [{
							xtype : 'textfield',
							fieldLabel : '工程编号',
							labelWidth : 75,
							name : 'ecn.xbcbh',
							// allowBlank : false,
							//emptyText : '默认原工程编号',
							readOnly : true
						}, {
							xtype : 'textfield',
							value : 'A02',
							minLength:3,
							maxLength : 3,
							name : 'version',
							allowBlank : false,
							width : 200
						}, {
							xtype : 'button',
							text : '生成新工程编号',
							handler : function() {
								me.createBcbh();
							}
						}]
			}, {
				xtype : 'fieldset',
				width : 900,
				title : '文件信息',
				layout : "column",
				items : [{
							xtype : 'fieldcontainer',
							columnWidth : 0.51,
							layout : {
								type : 'column'
							},
							fieldLabel : 'PCS尺寸',
							labelWidth : 60,
							items : [{
										xtype : 'numberfield',
										allowBlank : false,
										fieldLabel : 'PCS尺寸宽',
										hideLabel : true,
										minValue : 0.01,
										name : 'ecn.pcsx',
										columnWidth : 0.5
									}, {
										xtype : 'displayfield',
										style : 'text-align:center;',
										value : 'X'
									}, {
										xtype : 'numberfield',
										allowBlank : false,
										hideLabel : true,
										minValue : 0.01,
										name : 'ecn.pcsy',
										fieldLabel : 'PCS尺寸高',
										columnWidth : 0.5
									}]
						}, {
							xtype : 'filefield',
							fieldLabel : '客户文件',
							name : 'ecn.customerFile',
							labelWidth : 60,
							width : 200,
							margin : '0 0 0 10',
							columnWidth : 0.3,
							// allowBlank : false,
							buttonText : '选择文件'
						}, {
							xtype : 'fieldcontainer',
							layout : {
								type : 'column'
							},
							fieldLabel : 'SET尺寸',
							columnWidth : 0.51,
							labelWidth : 60,
							items : [{
										xtype : 'numberfield',
										allowBlank : false,
										name : 'ecn.setx',
										minValue : 0.01,
										fieldLabel : 'SET尺寸宽',
										hideLabel : true,
										columnWidth : 0.5
									}, {
										xtype : 'displayfield',
										value : 'X'
									}, {
										xtype : 'numberfield',
										allowBlank : false,
										minValue : 0.01,
										hideLabel : true,
										name : 'ecn.sety',
										fieldLabel : 'SET尺寸高',
										columnWidth : 0.5
									}]
						}, {
							xtype : 'numberfield',
							fieldLabel : 'SET拼数',
							name : 'ecn.setps',
							margin : '0 0 0 10',
							minValue : 1,
							allowBlank : false,
							columnWidth : 0.3,
							labelWidth : 60
						}, {
							xtype : 'textfield',
							fieldLabel : '客户型号',
							labelWidth : 60,
							allowBlank : false,
							name : 'ecn.projectName',
							columnWidth : 0.51
						}, {
							xtype : 'pubcombo',
							columnWidth : 0.3,
							margin : '0 0 0 10',
							fieldLabel : '层数',
							allowBlank : false,
							name : 'ecn.cs',
							labelWidth : 60,
							type : 4
						}]
			}, {
				xtype : 'fieldset',
				title : '生产需求',
				width : 900,
				defaults : {
					margin : '0 10 10 0'
				},
				layout : {
					type : 'column'
				},
				items : [{
							xtype : 'pubcombo',
							fieldLabel : '外层铜厚',
							allowBlank : false,
							labelWidth : 60,
							name : 'ecn.wcth',
							type : 7,
							columnWidth : 0.4
						}, {
							xtype : 'pubcombo',
							fieldLabel : '内层铜厚',
							allowBlank : false,
							name : 'ecn.ncth',
							type : 8,
							labelWidth : 60,
							columnWidth : 0.4
						},{
							xtype : 'radiogroup',
							columnWidth : 0.4,
							fieldLabel : '过孔处理',
							labelWidth : 60,
							items : [{
										xtype : 'radiofield',
										checked : true,
										name : 'ecn.gkcl',
										boxLabel : '常规',
										inputValue : '常规'
									}, {
										xtype : 'radiofield',
										name : 'ecn.gkcl',
										boxLabel : '盖孔',
										inputValue : '盖孔'
									}, {
										xtype : 'radiofield',
										name : 'ecn.gkcl',
										boxLabel : '开窗',
										inputValue : '开窗'
									}, {
										xtype : 'radiofield',
										name : 'ecn.gkcl',
										boxLabel : '塞油',
										inputValue : '塞油'
									}]
						}

				]
			}, {
				xtype : 'textareafield',
				fieldLabel : '订单需求',
				name : 'ecn.ddxq',
				maxLength : 500,
				labelWidth : 60,
				width : 900
			}, {
				xtype : 'textareafield',
				fieldLabel : '更改内容',
				name : 'ecn.ggnr',
				labelWidth : 60,
				readOnly : true,
				allowBlank : false,
				blankText : '未做任何修改,不需提交',
				width : 900
			}, {
				xtype : 'textareafield',
				fieldLabel : '备注',
				name : 'ecn.note',
				labelWidth : 60,
				width : 900
			}, {
				xtype : 'container',
				width : 900,
				layout : {
					pack : 'center',
					type : 'hbox'
				},
				items : [{
							xtype : 'button',
							text : '创建产品型号',
							iconCls:"ProductModelAdd",
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