/**
 * 待审核合同列表,没有分页
 */
Ext.define("Pcbms.business.AuditList", {
	extend : "Pcbms.CommonGridPanel",
	alias : "widget.bsagrid",
	page : false,
	sbConfig : {
		text : "刷新",
		scale : 'small',
		iconCls : 'searchsmall',
		handler : function(store) {
			store.reload();
		}
	},
	getRowClass : function(record, rowIndex, rowParams, store) {
		if (record.get("auditor") == myself.userid) {
			return "mylocked";
		}
		return "";
	},
	model : "ContractBean",
	url : "business/contractAction!auditList.action",
	// 显示查询条件
	initComponent : function() {
		var me = this;
		var searchs = [{
			xtype : 'empcombo',
			labelWidth : 100,
			fieldLabel : '所属业务员',
			name : 'salesman',
			cn : 'ywy',
			width : 250,
			listeners : {
				change : function(f, sv) {
					var form = f.up("form").getForm();
					var cv = form.findField("clientId").getValue();
					var store = me.store;
					if (Ext.isEmpty(cv) && Ext.isEmpty(sv)) {
						store.clearFilter();
					} else {
						store.filterBy(function(r) {
									if (!Ext.isEmpty(cv)
											&& r.get("clientId") != cv) {
										return false;
									}
									if (!Ext.isEmpty(sv)
											&& r.get("salesman") != sv) {
										return false;
									}
									return true;
								});
					}
				}
			}
		}, {
			xtype : 'clientcombo',
			fieldLabel : '所属客户',
			name : 'clientId',
			width : 300,
			listeners : {
				change : function(f, cv) {
					var form = f.up("form").getForm();
					var sv = form.findField("salesman").getValue();
					var store = me.store;
					if (Ext.isEmpty(cv) && Ext.isEmpty(sv)) {
						store.clearFilter();
					} else {
						store.filterBy(function(r) {
									if (!Ext.isEmpty(cv)
											&& r.get("clientId") != cv) {
										return false;
									}
									if (!Ext.isEmpty(sv)
											&& r.get("salesman") != sv) {
										return false;
									}
									return true;
								});
					}
				}
			}
		}]
		var actions = [Ext.create('Ext.Action', {
			disabled : true,
			text : '审核合同',
			iconCls : 'book_open',
			handler : function() {
				var rs = me.sel.getSelection()[0];
				window.open(Ext.String.format(Pcbms.contractauditurl, rs.get("contractId")),
						'_blank');
				rs.set("auditor", myself.userid);
				rs.set("auditorName", myself.name);
			},
			sf : function(selections) {
				return selections.length != 1;
			}
		})];
		var columns = [{
					header : "合同编号",
					width : 90,
					dataIndex : "contractId"
				}, {
					header : "创建时间",
					width : 90,
					dataIndex : "createDate",
					renderer : Ext.util.Format.dateRenderer("m-d H:i")
				}, {
					header : "所属业务员",
					width : 80,
					dataIndex : "salesmanName"
				}, {
					header : "所属客户",
					width : 150,
					dataIndex : "companyName",
					renderer : function(v, m, r) {
						var r = "#" + r.get("clientId");
						if (!Ext.isEmpty(v)) {
							r += "<span style='color:green'>" + v + "</span>";
						}
						return r;
					}
				}, {
					header : "总价",
					width : 80,
					dataIndex : "amount",
					align : "right",
					renderer : function(v) {
						return Ext.util.Format.currency(v);
					}
				}, {
					header : "实际金额",
					width : 80,
					dataIndex : "actualAmount",
					align : "right",
					renderer : function(v) {
						return Ext.util.Format.currency(v);
					}
				}, {
					header : "折扣或优惠",
					width : 80,
					dataIndex : "concessionsType"
				}, {
					xtype : 'booleancolumn',
					header : "是否含税",
					width : 80,
					dataIndex : "tax",
					trueText : "<span style='color:red'>含税</span>",
					falseText : "<span style='color:green'>不含税</span>"
				}, {
					header : "付款信息",
					flex : 1,
					dataIndex : "payMethod"
				}, {
					header : "锁定人",
					width : 100,
					dataIndex : "auditor",
					renderer : function(v, m, r) {
						if (Ext.isEmpty(v)) {
							return "<span style='color:blue'>未锁定</span>";
						}
						if (v == myself.userid) {
							return r.get("auditorName") + "*";
						}
						if (Ext.isEmpty(r.get("auditorName"))) {
							return v;
						}
						return r.get("auditorName");
					}
				}];

		me.items = me.genItems(columns, searchs, actions);
		me.callParent(arguments);
	}
});