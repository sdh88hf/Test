
Ext.define("Pcbms.warehouse.FmMaterialTicketFormList", {
	extend : "Ext.form.Panel",
	alias : "widget.fmform",
	padding : 5,
	frame: true,
	waitMsgTarget : true,
	buttons : [ {
		text : '确认领料',
		iconCls : "accept",
		handler : function(b) {
			var fp = b.up("form");
			if (fp.getForm().isValid()) {
				//确认领料
				fp.getForm().submit({
				    clientValidation: true,
				    url: '/materialAction!fetchMaterial.action',
				    success: function(form, action) {
				       Ext.Msg.alert('操作成功!', action.result.msg);
				       fp.up("window").close();
				    },
				    failure: Pcbms.formHandler
				});
			}
		}
	}, {
		text : '取消操作',
		handler : function(b) {
			b.up("window").close();
		}
	} ],
	initComponent : function() {
		// 列出所有的表单内容
		var me = this;
		me.store = Ext.create('Ext.data.Store', {
			storeId : 'fmformStore',
			model : 'TempTicket',
			proxy : {
				type : 'memory',
				reader : {
					type : 'json'
				}
			}
		});
		Ext.applyIf(me, {
			fieldDefaults : {
				labelAlign : 'left',
				labelWidth : 60,
				msgTarget : 'side'
			},
			items : [ {
				xtype : 'fieldcontainer',
				anchor : '100%',
				layout : 'column',
				items : [ {
					xtype : 'fieldcontainer',
					columnWidth : .33,
					layout : 'anchor',
					defaults : {
						labelWidth : 65
					},
					items : [ {
						xtype : 'textfield',
						fieldLabel : '开料单号',
						name : 'materialTicket.mid',
						anchor : '96%'
					}, {
						xtype : 'textfield',
						fieldLabel : '板材',
						name : 'materialTicket.bccl',
						anchor : '96%'
					}, {
						xtype : 'textfield',
						fieldLabel : '投料人',
						submitValue :false,
						name : 'materialTicket.tlperson',
						anchor : '96%'
					}, {
						xtype : 'datefield',
						fieldLabel : '投料时间',
						submitValue :false,
						name : 'materialTicket.tltime',
						anchor : '96%'
					} ]
				}, {
					xtype : 'fieldcontainer',
					columnWidth : .33,
					layout : 'anchor',
					defaults : {
						labelWidth : 65
					},
					items : [ {
						xtype : 'textfield',
						fieldLabel : '板材厚度',
						name : 'materialTicket.bh',
						anchor : '96%'
					}, {
						xtype : 'textfield',
						fieldLabel : '板材型号',
						name : 'materialTicket.bcxh',
						anchor : '96%'
					}, {
						xtype : 'empcombo',
						fieldLabel : '领料人',
						cn : 'fmp',
						allowBlank : false,
						name : 'materialTicket.lyperson',
						anchor : '96%'
					}, {
						xtype : 'datefield',
						fieldLabel : '领料时间',
						submitValue :false,
						name : 'materialTicket.lytime',
						anchor : '96%'
					} ]
				}, {
					xtype : 'fieldcontainer',
					columnWidth : .33,
					layout : 'anchor',
					defaults : {
						labelWidth : 65
					},
					items : [ {
						xtype : 'textfield',
						fieldLabel : '总投料面积',
						name : 'materialTicket.ztlmj',
						anchor : '100%'
					}, {
						xtype : 'textfield',
						fieldLabel : '总余料面积',
						name : 'materialTicket.ylmj',
						anchor : '100%'
					}, {
						xtype : 'textfield',
						fieldLabel : '总原料数量',
						name : 'materialTicket.tlnum',
						anchor : '100%'
					} ]
				} ]
			}, {
				xtype : 'grid',
				columns : [ {
					header : '原料尺寸X',
					dataIndex : 'ylccx',
					flex : 1
				}, {
					header : '原料尺寸Y',
					dataIndex : 'ylccy',
					flex : 1
				}, {
					header : '开料利用率',
					dataIndex : 'kllyl',
					width : 80
				}, {
					header : '交货利用率',
					dataIndex : 'jhlyl',
					width : 80
				}, {
					header : '原料数量',
					dataIndex : 'ylnum',
					width : 65
				} ],
				store : me.store,
				anchor : '100% -210',

			}, {
				xtype : 'textarea',
				labelAlign : 'top',
				name : 'materialTicket.note',
				fieldLabel : '备注信息',
				height : 80,
				margin : 5,
				anchor : '100%'
			} ]
		});
		this.callParent();
		me.getForm().load({
			url : '/materialAction!searchMaterialTicketById.action',
			params : {
				mid : me.mid
			},
			waitMsg : '载入中...',
			failure : function(form, action) {
				if(!action.result.success){
					Ext.Msg.alert("数据载入错误",action.result.msg);
					return;
				}
				var data = action.result.materialTicket;
				var values = {};
				var buttondisabled = false;
				for(var i in data){
					switch(i){
					case 'lytime':
						if(data[i] > 0){
							buttondisabled = true;
							values['materialTicket.' + i] = new Date(data[i]);
						}
						break;
					case 'tltime':
						values['materialTicket.' + i] = data[i] > 0 ? new Date(data[i]): null;
						break;
					default:
						values['materialTicket.' + i] = data[i];
						break;
					}
				}
				form.setValues(values);
				me.store.loadData(data.mttitems);
				me.down("button").setDisabled(buttondisabled);
			}
		});
	}
});
Ext
		.define(
				"Pcbms.product.FmMaterialTicketList",
				{
					extend : "Ext.grid.Panel",
					alias : "widget.fmgrid",
					listeners:{
						itemdblclick : function(view){
							
						}
					},
					initComponent : function() {
						var me = this;
						var storeid = me.storeid ? me.storeid : "fmListStore";
						me.store = Ext
								.create(
										"Ext.data.Store",
										{
											model : "MaterTicket",
											storeId : storeid,
											autoLoad : true,
											proxy : Pcbms.ajaxProxy(
													"/materialAction!searchMaterialList.action?materialTicket.tltime=1")
										});
						Ext
								.applyIf(
										me,
										{
											columns : [
													{
														header : "开料单号",
														flex : 1,
														dataIndex : "mid"
													},
													{
														header : "板材",
														flex : 1,
														dataIndex : "bccl"
													},
													{
														header : "板厚",
														flex : 1,
														dataIndex : "bh"
													},
													{
														header : "板材型号",
														flex : 1,
														dataIndex : "bcxh"
													},
													{
														header : "投料人",
														flex : 1,
														dataIndex : "tlperson"
													},
													{
														header : "投料时间",
														flex : 1,
														dataIndex : "tltime",
														renderer : Ext.util.Format
																.dateRenderer("m-d H:i"),
													},
													{
														header : "总原料数量",
														flex : 1,
														dataIndex : "tlnum"
													},
													{
														header : "总原料面积",
														flex : 1,
														dataIndex : "ztlmj"
													},
													{
														header : "总余料面积",
														flex : 1,
														dataIndex : "ylmj"
													},
													{
														header : "领料人",
														flex : 1,
														dataIndex : "lyperson"
													},
													{
														header : "领料时间",
														flex : 1,
														dataIndex : "lytime",
														renderer : Ext.util.Format
																.dateRenderer("m-d H:i")
													} ],
											tbar : [
													{
														xtype : "buttongroup",
														itemId : 'opbg',
														title : "操作",
														columns : 3,
														defaults : {
															scale : "small"
														},
														items : [ {
															text : '确定领料',
															iconCls : "accept",
															handler : function(
																	b) {
																var s = checkGridSelect(
																		b
																				.up("gridpanel"),
																		1);
																if (s) {
																	Ext
																			.create(
																					'Ext.window.Window',
																					{
																						title : '确认领料',
																						height : 400,
																						modal : true,
																						width : 600,
																						layout : 'fit',
																						items : {
																							xtype : 'fmform',
																							mid : s[0]
																									.get("mid"),
																							border : false
																						}
																					})
																			.show();
																}
															}
														} ]
													},
													'->',
													{
														xtype : "buttongroup",
														title : "查询",
														items : [
																{
																	xtype : "combobox",
																	store : [
																			[
																					0,
																					'待领料' ],
																			[
																					1,
																					'已领料' ] ],
																	fieldLabel : "领料状态",
																	value : 0,
																	labelAlign : "right",
																	labelWidth : 60,
																	name : "materialTicket.lytime"
																},
																{
																	xtype : "textfield",
																	fieldLabel : "开料单号",
																	labelAlign : "right",
																	labelWidth : 60,
																	name : "materialTicket.mid"
																},
																Pcbms
																		.searchbtn(
																				"查询",
																				storeid,
																				'small') ]
													} ],
											bbar : Ext
													.create(
															"Ext.PagingToolbar",
															{
																store : this.store,
																itemId : 'pagebar',
																displayInfo : true,
																beforePageText : "当前页",
																afterPageText : "总 {0} 页",
																displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
																emptyMsg : " 暂无信息"
															}),
											selModel : Ext
													.create(
															"Ext.selection.CheckboxModel",
															{
																mode : "SINGLE"
															})
										});
						this.callParent();
					}
				});