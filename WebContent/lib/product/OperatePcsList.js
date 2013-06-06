/**
 * 处理工程文件信息列表
 */
Ext.define("Pcbms.product.OperatePcsList", {
	extend : "Pcbms.CommonGridPanel",
	alias : "widget.oppgrid",
	model : "ProductPlanBean",
	page : false,
	sbConfig : {
		text : "刷新列表",
		scale : 'small',
		iconCls : 'searchsmall',
		handler : function(store) {
			store.reload();
		}
	},
	getRowClass : function(record, rowIndex, rowParams, store) {
		if (record.get('isLocked') == 1) {
			if (record.get("lockedPerson") == myself.userid) {
				return "mylocked";
			} else {
				return "otherlocked";
			}
		}
		return "";
	},
	url : "/projectAction!listUnProcessed.action",
	initComponent : function() {
		var me = this;
		var columns = [{
					xtype : 'ppIdcolumn'
				}, {
					header : "客户型号",
					dataIndex : "khxh",
					flex : 1
				}, {
					header : "下单时间",
					dataIndex : "createDate",
					width : 90,
					renderer : Ext.util.Format.dateRenderer("m-d H:i")
				}, {
					header : "层数",
					dataIndex : "cs",
					width : 60
				}, {
					header : "成品板厚",
					dataIndex : "bh",
					width : 60
				}, {
					header : "尺寸",
					width : 140,
					renderer : Pcbms.ProjectSizeRenderer
				}, {
					header : "工艺",
					dataIndex : "gy",
					width : 65
				}, {
					header : "加急类型",
					dataIndex : "jjType",
					width : 65
				}, {
					header : "阻焊颜色",
					dataIndex : "zhColor",
					width : 65
				}, {
					header : "油墨颜色",
					dataIndex : "fontColor",
					width : 65
				}, {
					xtype : "coppercolumn"
				}, {
					header : "需求数量",
					dataIndex : "num",
					width : 65
				}, {
					header : "锁定人",
					dataIndex : "lockedPerson",
					width : 80
				}];
		var downloadAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '原文件下载',
					iconCls : 'projectfile',
					handler : function() {
						var r = me.sel.getSelection()[0];
						Pcbms.downFile("projectfile", r.get("bcbh"));
					},
					sf : function(selections) {
						return selections.length != 1;
					}
				});
		var lockAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '锁定',
					iconCls : "lock",
					handler : function() {
						var r = me.sel.getSelection()[0];
						var ppId = r.get("ppId");
						Ext.Ajax.trequest({
									url : "/projectAction!lockProdplan.action",
									params : {
										"prodplan.ppId" : ppId
									},
									success : function() {
										r.set("isLocked", 1);
										r.set("lockedPerson", myself.userid);
										r.set("lockedPersonname", myself.name);
									}
								});
					},
					sf : function(selections) {
						if (selections.length == 1) {
							var lp = selections[0].get("lockedPerson");
							if (Ext.isEmpty(lp)) {
								return false;
							}
						}
						return true;
					}
				});
		var unlockAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '解锁',
					iconCls : "lockopen",
					handler : function() {
						var r = me.sel.getSelection()[0];
						var ppId = r.get("ppId");
						Ext.Ajax.trequest({
									url : "/projectAction!unlockProdplan.action",
									params : {
										"prodplan.ppId" : ppId
									},
									success : function(str) {
										r.set("isLocked", 0);
										r.set("lockedPerson", "");
										r.set("lockedPersonname", "");
									}
								});
					},
					sf : function(selections) {
						if (selections.length == 1) {
							var lp = selections[0].get("lockedPerson");
							if (!Ext.isEmpty(lp) && lp == myself.userid) {
								return false;
							}
						}
						return true;
					}
				});
		var operateAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '工程处理',
					iconCls : "detailhandle",
					handler : function() {
						var rs = me.sel.getSelection();
						var ppId = rs[0].get("ppId");
						//打开新的页面
						window.open(Ext.String.format("psFileAction!psfileinput.action?&title={0}_工程处理&widget=Pcbms.product.PsFileEdit&ppId={0}",ppId),"_blank");
					},
					sf : function(selections) {
						if (selections.length == 1) {
							var lp = selections[0].get("lockedPerson");
							if (Ext.isEmpty(lp) || lp == myself.userid) {
								return false;
							}
						}
						return true;
					}
				});

		var returnAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '退回',
					iconCls : "backorder",
					handler : function() {
						var rs = me.sel.getSelection();
						var prodId = r.get("prodId");
						Ext.Ajax.trequest({
									url : "/projectAction!returnedProductOrder.action",
									params : {
										product : {
											prodId : prodId
										}
									}
								});
					},
					sf : function(selections) {
						return selections.length != 1;
					}
				});
		var actions = [lockAction, unlockAction, downloadAction, operateAction,
				returnAction];
		var searchs = [{
			xtype : "textfield",
			fieldLabel : "请输入关键字",
			labelWidth : 120,
			width : 300,
			enableKeyEvents : true,
			listeners : {
				keyup : function(b) {
					var value = b.getValue();
					if (value == "") {
						return me.store.clearFilter();
					}
					me.store.filterBy(function(r) {
								return r.get("bcbh").indexOf(value) != -1
										|| r.get("khxh").indexOf(value) != -1
										|| r.get("prodId").indexOf(value) != -1
										|| r.get("orderId").indexOf(value) != -1;
							});
				}
			}
		}, {
			xtype : 'checkboxgroup',
			fieldLabel : '状态',
			columns : 3,
			width : 300,
			labelWidth : 50,
			vertical : true,
			items : [{
						boxLabel : '我锁定的',
						name : 'state',
						inputValue : 0
					}, {
						boxLabel : '未锁定',
						name : 'state',
						inputValue : 1,
						checked : true
					}, {
						boxLabel : '其他人锁定',
						name : 'state',
						inputValue : 2
					}],
			listeners : {
				change : function(f, nv, ov) {
					var checks = [].concat(nv.state);
					var store = me.store;
					if (nv.state === undefined) {
						store.clearFilter();
					} else {
						store.filterBy(function(r) {
							for (var i = 0; i < checks.length; i++) {
								if (checks[i] == 0
										&& r.get("lockedPerson") == myself.userid) {
									return true;
								}
								if (checks[i] == 1 && r.get("isLocked") == 0) {
									return true;
								}
								if (checks[i] == 2
										&& r.get("isLocked") == 1
										&& r.get("lockedPerson") != myself.userid) {
									return true;
								}
							}
							return false;
						});
					}
				}
			}
		}]
		me.items = me.genItems(columns, searchs, actions);
		me.callParent(arguments);
	}
});