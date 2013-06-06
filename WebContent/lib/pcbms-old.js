/**
 * 已经作废不使用
 */
Pcbms.ajaxHandler = function(config) {
	var onsuccess = function(result) {
	};
	var onerror = function(result) {
		Ext.Msg.alert('出现错误', '原因 <' + result.msg + ">");
	};
	if (config) {
		if (config.success) {
			onsuccess = config.success;
		}
		if (config.error) {
			onerror = config.error;
		}
	}
	return function(response) {
		var result = Ext.decode(response.responseText);
		if (result.success == false) {
			onerror(result);
		} else {
			onsuccess(result);
		}
	};
};

function showWin(swid, id) {
	// 需要传入的两个数据 编号
	if (typeof showWin[swid] != "object") {
		alert("出现错误,无效的参数:" + swid);
		return;
	}
	var sw = showWin[swid];
	// 开始展示窗口
	if (!sw.win || sw.single) {
		var winconfig = sw.winconfig || {};
		if (sw.single) {
			// 使用单实例运行
			winconfig.closeAction = 'close';
		} else {
			winconfig.closeAction = 'hide';
		}
		Ext.applyIf(winconfig, {
					width : 900,
					height : 600,
					layout : "fit",
					modal : true,
					items : [{
								xtype : sw.xtype
							}]
				});
		sw.win = Ext.create("Ext.window.Window", winconfig);
	}
	sw.win.show();
}

/**
 * @param xtype
 * @param config
 * @returns {Pcbms.showWin}
 */
Pcbms.showWin = function(xtype, param) {
	var swid = Ext.id();
	var config = {
		xtype : xtype
	};
	showWin[swid] = Ext.apply(config, param);
	this.renderer = function(v, m, r) {
		return "<a style='color:blue;' onclick='showWin(\"" + swid + "\",\""
				+ v + "\")'>" + v + "</a>";
	};
	this.swid = swid;
};

Pcbms.searchbtn = function(text, storeId, type, method, scope) {
	if (!type) {
		type = 'medium';
	}
	var result = {
		scale : type,
		xtype : "button",
		itemId : 'searchbtnabc',
		text : text,
		handler : function(b) {
			// 默认的查询框 点击后执行查询
			var queryParam = {
				validquery : true
			};
			if (method) {
				queryParam = method.call(scope);
			}
			var store = Ext.data.StoreManager.lookup(storeId);
			b.ownerCt.items.each(function(item) {
						if (item.name) {
							var name = item.name;
							if (!item.isValid()) {
								queryParam.validquery = false;
								return;
							}

							if (item.departid) {
								queryParam[name] = item.departid;
							} else if (item.departid == 0) {
								queryParam[name] = "";
							} else if (item.getValue() || item.getValue() == 0) {
								if (item.getXType() == "datefield") {
									var date = new Date(item.value);
									queryParam[name] = date.getTime();
								} else {
									queryParam[name] = item.getValue();
								}
							}
						}
					});

			if (b.ownerCt.menu) {
				b.ownerCt.menu.items.items[0].items.each(function(item) {
							if (item.name) {
								var name = item.name;
								if (!item.isValid()) {
									queryParam.validquery = false;
									return;
								}
								if (item.departid) {
									queryParam[name] = item.departid;
								} else if (item.departid == 0) {
									queryParam[name] = "";
								} else if (item.getValue()
										|| item.getValue() == 0) {
									if (item.getXType() == "datefield") {
										var date = new Date(item.value);
										queryParam[name] = date.getTime();
									} else {
										queryParam[name] = item.getValue();
									}
								}
							}
						});
			}

			if (queryParam.validquery) {
				store.getProxy().extraParams = queryParam;
				store.loadPage(1);
			} else {
				Ext.Msg.alert('查询错误', '你的查询参数错误,请检查!');
			}
		}
	};
	switch (type) {
		case 'medium' :
			result.rowspan = 2;
			result.iconCls = "searchbig";
			result.iconAlign = 'top';
			break;
		case 'small' :
			result.iconCls = "searchsmall";
			break;
		case 'big' :
			result.rowspan = 3;
			result.iconCls = "searchbig";
			result.iconAlign = 'top';
			break;
	}
	return result;
};

Ext.define("Pcbms.searchButtonGroup", {
			extend : "Ext.container.ButtonGroup",
			alias : "widget.searchbg",
			title : "查询",
			defaults : {
				scale : "larger"
			},
			columns : 3,
			showSrhMenu : function() {
				var me = this;
				if (!me.menu) {
					var itemsarr = [];
					var form = Ext.create("Ext.form.Panel", {
								layout : 'column',
								width : 440,
								frame : true,
								items : me.hitems
							});
					me.menu = Ext.createWidget("menu", {
								items : [form]
							});
				}
				me.menu.showBy(me);
			},
			hideSrhMenu : function() {
				var me = this;
				me.menu.hide();
			},
			listeners : {
				'beforerender' : function(e) {
				},
				'render' : function(e) {
					// e.getEl().on('mouseover', function() {
					//
					// e.showSrhMenu();
					// });
					e.getEl().on('keyup', function(v, h, o) {
						if (v.getKey() == v.ENTER) {
							e.down("#searchbtnabc").handler(e
									.down("#searchbtnabc"));
						}

					});
				}
			},
			initComponent : function() {
				var me = this;
				me.hitems = [];
				me.sitems = [];
				var i = 0;
				Ext.each(me.items, function(item) {
							if (i < 3) {
								me.sitems.push(item);
							} else {
								item["columnWidth"] = 0.5;
								me.hitems.push(item);
							}
							if (!item.hidden) {
								i++;
							}
						});
				me.items = me.sitems;
				me.tools = [{
							type : 'down',
							handler : function() {
								me.showSrhMenu();
							}
						}];
				this.callParent();
			}
		});

function showDetial(type) {
	var me = this;
	// 产品型号
	if (!this.pt) {
		this.pt = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.ptWindow) {
				me.ptForm = Ext.create("Pcbms.product.UpdProjectFile", {
							width : "100%",
							detail : true,
							height : "100%"
						});

				me.ptWindow = Ext.create("Ext.window.Window", {
							width : 900,
							height : 600,
							layout : "fit",
							title : '产品型号详情',
							modal : true,
							closeAction : "hide",
							items : me.ptForm
						});
			}

			Ext.Ajax.request({
				url : "/projectFileAction!searchProjectFileByBcbh.action?projectFile.bcbh="
						+ i,
				success : new Pcbms.ajaxHandler({
							success : function(str) {
								Ext.getBody().unmask();
								me.ptWindow.show();
								me.ptForm.loadData(str.projectFile);

							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
			});

		};
	}

	// 产品详细
	if (!this.prod) {
		this.prod = function(i, type) {
			Ext.getBody().mask("加载中..");
			if (!me.prodWindow) {
				me.prodForm = Ext.create("Pcbms.product.UpdProduct2", {
							width : "100%",
							detail : true,
							height : "100%"
						});

				me.pordWindow = Ext.create("Ext.window.Window", {
							layout : 'fit',
							width : 600,
							title : '工程文件确认处理',
							closeAction : 'hide',
							modal : true,
							autoHeight : true,
							items : me.prodForm
						});
			}

			Ext.Ajax.trequest({
						url : "/projectAction!searchProductOrder.action",
						params : {
							product : Ext.encode({
										prodId : i
									})
						},
						success : function(str) {
							Ext.getBody().unmask();
							me.pordWindow.show();
							me.prodForm.loadData(str.data);
						},
						error : function(r) {
							Ext.getBody().unmask();
							Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
						}
					});
		};
	}

	// 合同
	if (!this.ct) {
		this.ct = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.ctWindow) {
				me.ctForm = Ext.create("Pcbms.business.UpdContract", {
							width : "100%",
							height : "100%",
							detail : true
						});
				me.ctWindow = Ext.create("Ext.window.Window", {
							width : 900,
							height : 600,
							modal : true,
							layout : "fit",
							title : '合同详情',
							closeAction : "hide",
							items : me.ctForm
						});
			}

			Ext.Ajax.request({
				url : "/contractManagementAction!searchContractById.action?contract.contractid="
						+ i,
				success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.ctWindow.show();
								me.ctForm.loadData(str.contract);
								Ext.getBody().unmask();
							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
			});

		};
	}

	// 工作板
	if (!this.wb) {
		this.wb = function(i) {
			Ext.getBody().mask("加载中..");
			me.wbForm = Ext.create("Pcbms.product.UpdWorkBoard", {
						width : "100%",
						detail : true,
						height : "100%"
					});
			me.wbWindow = Ext.create("Ext.window.Window", {
						minWidth : 900,
						minHeight : 600,
						maximized : true,
						layout : "fit",
						modal : true,
						title : '工作板详情',
						items : me.wbForm
					});
			Ext.Ajax.request({
				url : "/workBoardManagementAction!searchWorkBoardByid.action?wbid="
						+ i,
				success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.wbWindow.show();
								Ext.getBody().unmask();
								me.wbForm.loadData(str.workBoardInfo);

							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
			});
		};
	}

	// 开料模板单
	if (!this.tt) {
		this.tt = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.ttWindow) {
				me.ttForm = Ext.create("Pcbms.view.updTemplateTicket", {
							title : '',
							detail : true
						});
				me.ttWindow = Ext.create("Ext.window.Window", {
							width : 920,
							height : 600,
							layout : "fit",
							modal : true,
							title : '模板单详情',
							closeAction : "hide",
							items : me.ttForm
						});
			}

			// 加载型号数据
			Ext.Ajax.request({
						url : "/mtTicketAction!searchMTTicket.action?mtTicket.mtid="
								+ i,
						success : new Pcbms.ajaxHandler({
									success : function(str) {
										me.ttWindow.show();
										me.ttForm.loadData(str.mtTicket);
									},
									error : function(r) {
										Ext.getBody().unmask();
										Ext.Msg.alert('出现错误', '原因 <' + r.msg
														+ ">");
									}
								})
					});
		};
	}

	// 开料单
	if (!this.mt) {
		this.mt = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.mtWindow) {
				me.mtForm = Ext.create("Pcbms.product.UpdMaterialTicket", {
							title : '',
							detail : true
						});
				me.mtWindow = Ext.create("Ext.window.Window", {
							width : 960,
							height : 600,
							layout : "fit",
							modal : true,
							title : '开料单详情',
							closeAction : "hide",
							items : me.mtForm
						});
			}

			Ext.Ajax.request({
				url : "/materialTicketAction!searchMaterialTicket.action?flagForUpdate=1&materialTicket.mid="
						+ i,
				success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.mtWindow.show();
								me.mtForm.mid = i;
								me.mtForm.loadData(str.materialTicket);
								Ext.getBody().unmask();
							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
			});
		};
	}

	// 管制卡
	if (!this.lot) {
		this.lot = function(i) {
			Ext.getCmp("mainpanel").loadControl({
						xtype : 'lcfind',
						text : '管制卡查询',
						stepid : i

					});

		};
	}

	// 出货单
	if (!this.op) {
		this.op = function(i) {
			Ext.getBody().mask("加载中..");

			// 加载型号数据
			Ext.Ajax.request({
				url : "/wareHouseManagementAction!searchDeliveryTicketDetail.action?chIds="
						+ i,
				success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.opWindow = Ext.create(
										"Pcbms.warehouse.OutPartViewWindow", {

										});
								me.opWindow.show();
								me.opWindow.loadData(str.deliveryTicket);
							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
			});
		};
	}

	if (type) {
		var result = {
			renderer : function(v, m, r) {
				return "<a style='color:blue;' onclick='showDetial(\"" + type
						+ "\")." + type + "(\"" + v + "\")'>" + v + "</a>";
			}
		};
		result[type] = this[type];
		return result;
	}
}

/**
 * 验证表格的选中行
 * 
 * @param gp
 *            表格对象
 * @param t
 *            1:只能选一行 2:可以选多行
 */
function checkGridSelect(gp, t) {
	var s = gp.getSelectionModel().getSelection();
	if (t == 1) {
		if (s == null || s.length == 0 || s.length > 1) {
			Ext.MessageBox.alert("操作错误", "请选择一条操作数据");
			return false;
		}
	} else if (t == 2) {
		if (s == null || s.length == 0) {
			Ext.MessageBox.alert("操作错误", "请至少选择一条操作数据");
			return false;
		}
	}
	return s;
}
/**
 * 给组件指定时间的遮罩
 * 
 * @param {}
 *            me 组件
 * @param {}
 *            msg 提示信息
 * @param {}
 *            time 时间
 */
function deferLoading(me, msg, time) {
	if (!me) {
		return;
	}
	if (!msg) {
		msg = "加载中...";
	}
	if (!time) {
		time = 2000;
	}
	me.setLoading('加载中...');
	Ext.defer(function() {
				me.setLoading(false);
			}, 2000);
}
/**
 * Ext.define('Pcbms.DepartSelection', { extend : 'Ext.form.field.Trigger',
 * alias : 'widget.departselection', editable : false, value : "", config : {
 * departid : "0" }, emptyText : "请选择所属部门", getSubmitData : function() { var
 * result = {}; result[this.name] = this.departid; return result; },
 * getModelData : function() { var result = {}; result[this.name] =
 * this.departid; return result; }, getValue : function() { return
 * this.departid; }, setValue : function(value) { // 如果value是id 那么将需要显示 if
 * (typeof value == "object") { if (value.length > 0) {
 * this.callParent([value[0].text]); this.departid = value[0].id; } else {
 * this.callParent([this.emptyText]); this.departid = 0; } return; } if (typeof
 * value == "string") { var node = datastore.getDepartmentNode(value); if (node) {
 * this.callParent([node.text]); this.departid = node.departid; return; } }
 * this.callParent(arguments); }, afterRender : function() { var me = this;
 * me.callParent(arguments); }, onTriggerClick : function() { // 先检查已经打开窗口
 * 有的话显示出来没有的话 var treewin = Ext.getCmp("departmentTree"); if (!treewin) {
 * treewin = Ext.create("Pcbms.DepartmentTree"); } var me = this;
 * treewin.callback = me.setValue; treewin.scope = me; treewin.show(); } });
 */
Ext.define("Pcbms.comboGrid", {
			extend : 'Ext.form.field.Trigger',
			alias : 'widget.combogrid',
			grid : '',// 要显示的表格
			viewField : '',// 需要显示grid中的哪一列作为显示数据(dataIndex)
			onTriggerClick : function(e) {// 点击下拉时触发
				if (!this.menu) {// 如果菜单不存在就生成
					this.menu = Ext.create('Ext.menu.Menu', {
								items : [this.grid]
							});
				}

				this.menu.showBy(this.el, "tl-bl?");
			},
			gridclick : function(v, r) { // 监听表格行点击事件
				// 拼装需要显示的值
				var str = "";

				for (var i = 0; i < v.getSelectionModel().getSelection().length; i++) {
					// 根据定义的dataIndex 获取表格数据
					str += v.getSelectionModel().getSelection()[i]
							.get(this.viewField);

					if (i != v.getSelectionModel().getSelection().length - 1) {
						str += ",";
					}
				}

				// 给下拉框赋值
				this.setValue(str);

				// 隐藏菜单
				this.menu.hide();

			},
			initComponent : function() {

				this.grid.on("itemclick", this.gridclick, this);

				this.callParent();

			}

		});