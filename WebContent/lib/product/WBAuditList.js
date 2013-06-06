/**
 * 待审核列表
 */
Ext.define("Pcbms.product.WBAuditList", {
	extend : "Pcbms.CommonGridPanel",
	alias : "widget.wbauditlist",
	page : false,
	sbConfig : {
		text : "刷新列表",
		scale : 'small',
		iconCls : 'searchsmall',
		handler : function(store) {
			store.reload();
		}
	},
	model : "WorkBoard",
	url : "/projectAction!listProcessed.action",
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
		var auditAction = Ext.create('Ext.Action', {
			disabled : true,
			text : '处理审核',
			iconCls : 'projectfile',
			handler : function() {
				var r = me.sel.getSelection()[0];
				window
						.open(Ext.String
								.format(
										"psFileAction!loadAuditProdplan.action?&title={0}_工程处理审核&widget=Pcbms.product.ProductPlanView&ppId={0}",
										r.get("ppId")));
			},
			sf : function(selections) {
				return selections.length != 1;
			}
		});
		var actions = [downloadAction, auditAction];
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
		}]
		me.items = me.genItems(columns, searchs, actions);
		me.callParent(arguments);
	}
});