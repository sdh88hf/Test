
Ext.require(['Ext.toolbar.Paging', 'Ext.ux.RowExpander',
		'Ext.tip.QuickTipManager', "Ext.ux.statusbar.StatusBar", 'Ext.ux.form.MultiSelect', 'Ext.ux.form.ItemSelector']);
// 正式的开始创建窗口
Ext.onReady(function() {
	Ext.require(xcommons.concat(xwidgets));
	showElapsed();
	Ext.fly("loading-body").remove();
	Ext.define("Pcbms.MenuTreePanel", {
				extend : "Ext.tree.Panel",
				id : "menulist",
				split : true,
				width : 180,
				region : "west",
				collapsible : true,
				collapseFirst : false,
				margins : "0 0 5 5",
				cmargins : "0 5 5 5",
				rootVisible : false,
				lines : false,
				autoScroll : true,
				useArrows : true,
				bodyPadding : 5,
				initComponent : function() {
					this.store = Ext.create("Ext.data.TreeStore", {
								storeId : "menustore",
								root : {
									expanded : true,
									children : myself.sortMenu()
								}
							});
					this.callParent();
				},
				listeners : {
					"itemclick" : function(model, selected, eOpts) {
						if (selected.raw.stepid > 0) {
							if (selected.raw.text == '开料') {
								Ext.getCmp("mainpanel").loadControl({
											xtype : 'cmtgrid',
											text : '开料',
											stepid : selected.raw.stepid
										});
							} else {
								var et = false;
								if (selected.raw.text == "包装入库") {
									et = "bzrk";
								}
								Ext.getCmp("mainpanel").loadControl({
											xtype : 'slgrid',
											text : selected.raw.text,
											id : "sl_" + selected.raw.stepid,
											et : et,
											stepid : selected.raw.stepid
										});
							}
						} else {
							Ext.getCmp("mainpanel").loadControl(selected.raw);
						}
					}
				}
			});
	Ext.define("Pcbms.MainPanel", {
				id : "mainpanel",
				extend : "Ext.tab.Panel",
				activeTab : 0,
				region : "center",
				margins : "0 5 5 0",
				resizeTabs : true,
				tabWidth : 150,
				enableTabScroll : true,
				loadControl : function(control) {
					if (!control.xtype) {
						return;
					}
					this.el.mask("窗口载入中 请稍后...", Ext.baseCSSPrefix
									+ 'mask-loading');
					var tab;
					if (!control.id) {
						control.id = control.xtype;
					}
					if (!(tab = this.getComponent(control.id))) {
						// 试验下动态的载入 开始
						tab = this.add(Ext.apply({
										closable : true,
										autoScroll : true,
										border : true,
										tabConfig : {
											title : control.text || "",
											tooltip : control.description || ""
										}
									}, control));
						tab.on("close", function(p) {
									var node = Ext.getCmp("menulist")
											.getRootNode().findChild("id",
													p.id, true);
									if (node && node.hasOwnProperty("unselect")) {
										node.unselect();
									}
								});
						var buttons = tab.query('button[funcscope]');
						for (var i = 0; i < buttons.length; i += 1) {
							buttons[i].setDisabled(!myself
									.getRole(buttons[i].funcscope));
						}
					}
					try {
						this.setActiveTab(tab);
					} catch (e) {
						if (console) {
							console.error(new Error(e).stack);
							console.log(tab);
						}
					}
					if (tab.initialization) {
						tab.initialization(control);
					}
					this.el.unmask();
				}
			});
	var mainpanel = Ext.create("Pcbms.MainPanel", {
		plugins : Ext.create('Ext.ux.TabCloseMenu'),
		items : [{
			xtype : 'panel',
			layout : 'column',
			bodyStyle: 'background:white; padding:12px; overflow:hidden !important;',
			tabConfig : {
				title : '信息中心',
				tooltip : '个人信息中心,显示最新的公司动态信息.'
			},
			defaults : {
				columnWidth : 0.33,
				margin : "0 10 0 0",
				border : false
			},
			items : [{
				items : [{
					title : '登录密码修改',
					padding : '0',
					items : {
						border : false,
						labelWidth : 80,
						xtype : "form",
						frame : true,
						border : false,
						frame : true,
						iconCls : "password",
						layout : "anchor",
						bodyPadding : 10,
						defaults : {
							anchor : "95%",
							minLength : 6,
							minLengthText : "\u5bc6\u7801\u6700\u5c11\u4e3a6\u4f4d"
						},
						defaultType : "textfield",
						items : [{
									fieldLabel : "\u539f\u5bc6\u7801",
									name : "password",
									inputType : "password",
									allowBlank : false
								}, {
									fieldLabel : "\u65b0\u5bc6\u7801",
									name : "newPassword",
									inputType : "password",
									id : "newpassword",
									allowBlank : false
								}, {
									fieldLabel : "\u5bc6\u7801\u786e\u8ba4",
									name : "checkPassword",
									inputType : "password",
									initialPassField : "newpassword",
									allowBlank : false
								}],
						buttons : [{
							text : "确认\u4fee\u6539\u5bc6\u7801",
							iconCls : "accept",
							handler : function(b) {
								var form = b.up("form").getForm();
								form.submit({
									clientValidation : true,
									includeEmptyText : false,
									waitMsg : "\u4e2a\u4eba\u4fe1\u606f\u4fee\u6539\u4e2d...",
									url : "/userInfoManagementAction!changePassword.action",
									success : function(form, action) {
										form.reset();
										Ext.Msg.alert("密码修改成功",
												action.result.msg);
									},
									failure : Pcbms.formHandler
								});
							}
						}]
					}
				}, {
					frame : true,
					xtype : 'form',
					title : '下单数据迁移',
					padding : '0',
					bodyPadding : 10,
					layout : 'auto',
					buttons : [{
						text : '提交',
						iconCls : "accept",
						handler : function() {
							this.up("form").getForm().submit({
										waitMsg : '正在同步,请稍等',
										timeout : 10002400,
										url : '/dataMoveAction!doDataMove.action',
										success : function(form, action) {
											Ext.Msg.alert("提示",
													action.result.msg);
										},
										failure : Pcbms.formHandler
									});
						}
					}],
					items : [{
						xtype : 'combobox',
						fieldLabel : '选择数据来源',
						name : 'clientid',
						store : [['hz-jlc', '嘉利创'], ['kjpcb', '快捷电子'],
								['bosmt', '博州电器'], ['kidoll', '金都电子'],
								['giayu', '加于电子'], ['3hepcb', '三和快捷']],
						forceSelection : true,
						allowBlank : false,
						labelWidth : 80,
						width : 300,
						flex : 1
					}]
				}]
			}, {
				items : [{
							padding : '0',
							title : '个人信息',
							items : {
								closable : false,
								border : false,
								titleCollapse : true,
								propertyNames : {
									birthday : "生日",
									departid : "部门编号",
									dimission : "离职日期",
									email : "邮箱地址",
									enroll : "注册日期",
									hidden : "是否隐藏",
									mobile : "手机号码",
									msn : "MSN",
									name : "姓名",
									position : "职位",
									qq : "QQ",
									telephone : "联系电话",
									title : "工程师",
									userid : "用户编号",
									type : "账户类型"
								},
								xtype : "propertygrid",
								source : myself
							}
						}]
			}, {
				items : [{
					padding : '0',
					title : '系统更新记录',
					height : 500,
					html : "2012-8-10<br/> 更新内容: 组工作板界面简洁化(添加右击menu),取消铜厚的分类,工作板查看界面添加订单内容查看,订单内容滚动 , 添加工作板审核时的锁定.<br/>"
							+ "下次更新(计划更新时间:2012-8-30)<br/>"
							+ "工作板内容可以修改(不需要删除后创建), 添加报废流程管理, 数据同步BUG解决(漏单)"
				}]
			}]
		}]
	});
	var memulist = Ext.create("Pcbms.MenuTreePanel", {
				bodyPadding : '0 0 0 0',
				title : "信息管理控制中心"
			});
	var viewport = Ext.create("Ext.container.Viewport", {
				id : "pcbms",
				layout : "border",
				showMsg : function(msg) {
					var el = Ext.get('pcbms-msg'), msgId = Ext.id();
					this.msgId = msgId;
					el.update(msg).show();
					Ext.defer(this.clearMsg, 3000, this, [msgId]);
				},
				clearMsg : function(msgId) {
					if (msgId === this.msgId) {
						Ext.get('pcbms-msg').hide();
					}
				},
				items : [new Ext.container.Container({
									region : "north",
									contentEl : "header",
									height : 39
								}), mainpanel, memulist]
			});
	Ext.get("header").on("click", function() {
				viewport.focus();
			});
	memulist.focus();
});
