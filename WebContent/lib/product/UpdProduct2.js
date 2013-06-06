Ext.define('Pcbms.product.UpdProduct2', {
			extend : 'Ext.form.Panel',
			alias : "widget.produpd2",
			buttons : [{
				text : "确认处理",
				itemId : "prodSubmitButton",
				handler : function(b) {
					var uploadForm = b.up("form");
					var basicForm = uploadForm.getForm();
					var values = basicForm.getFieldValues();
					delete values.setX;
					basicForm.submit({
								url : "/projectAction!processProdplan.action",
								waitMsg : "提交中....",
								params : {
									prodplan : Ext.encode(values)
								},
								success : function(form, action) {
									Ext.Msg
											.alert("提示信息",
													action.result.msg);
									basicForm.reset();
									uploadForm.up("window").close();
								},
								failure : Pcbms.formHandler
							});
				}
			}],
			border : false,
			bcbh : "",
			/**
			 * 
			 * @param data
			 *            需要载入的数据
			 * @param type
			 *            查看的模式(可选) 1.工程处理
			 */
			loadData : function(data, type) {
				var me = this;
				me.getForm().setValues(data);
				Ext.each(me.getForm().getFields().items, function(i) {
							if (i.getName() == 'setX') {
								var setX = Pcbms.ProjectSizeRenderer(null,
										null, {
											data : data
										});
								i.setValue(setX);
							}
						});
			},

			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							defaults : {
								xtype : 'fieldset',
								layout : "column",
								bodyPadding : 4,
								defaults : {
									labelWidth : 60,
									submitValue : false,
									xtype : 'displayfield',
									columnWidth : 0.45
								}
							},
							items : [{
										title : 'PCB文件基本信息',
										items : [{
													fieldLabel : '文件下载',
													name : 'bcbh'
												}, {
													fieldLabel : '文件尺寸',
													name : 'setX'
												}, {
													xtype : 'hiddenfield',
													name : 'prodId'
												},  {
													xtype : 'hiddenfield',
													name : 'ppId'
												}, {
													fieldLabel : 'SET信息',
													name : 'setPs'
												}, {
													fieldLabel : '铜箔厚度'
												}]
									}, {
										title : '订单需求信息',
										items : [{
													fieldLabel : '订单类型',
													name : 'orderType'
												}, {
													fieldLabel : '客户型号',
													name : 'khxh'
												}, {
													fieldLabel : '需求数量',
													name : 'num'
												}, {
													fieldLabel : '板材材料',
													name : 'bccl'
												}, {
													fieldLabel : '板材级别',
													name : 'bcxh'
												}, {
													fieldLabel : '板材厚度',
													name : 'bh'
												}, {
													fieldLabel : '焊盘喷镀',
													name : 'zhCss'
												}, {
													fieldLabel : '阻焊文字',
													name : 'fontCss'
												}, {
													fieldLabel : '测试方式',
													name : 'csfs'
												}, {
													fieldLabel : '加急类型',
													name : 'jjType'
												}]
									}, {
										title : "工程确认处理",
										defaults : {
											labelWidth : 60,
											submitValue : false,
											xtype : 'numberfield',
											columnWidth : 0.33
										},
										items : [{
													fieldLabel : '最小线宽',
													name : 'minlw'
												}, {
													xtype : 'pubcombo',
													fieldLabel : '外层铜厚',
													name : 'wcth',
													type : 7
												}, {
													xtype : 'pubcombo',
													fieldLabel : '层数',
													xtype : 'pubcombo',
													name : 'cs',
													type : 4
												}, {
													fieldLabel : '最小线距',
													name : 'minld'
												}, {
													xtype : 'pubcombo',
													fieldLabel : '内层铜厚',
													name : 'ncth',
													type : 8
												}, {
													xtype : 'textfield',
													fieldLabel : '过孔处理',
													name : 'gkcl'
												}, {
													xtype : 'filefield',
													fieldLabel : '文件',
													name : 'attachement',
													columnWidth : 0.99
												}, {
													xtype : 'textareafield',
													columnWidth : 0.99,
													fieldLabel : '备注信息',
													name : 'pfNote'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});