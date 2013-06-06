Ext.define("Pcbms.view.createOutSourceing", {
	extend : "Ext.grid.Panel",
	alias : "widget.costtgrid",
	initComponent : function() {
		var me = this;
		var storeid = me.storeid ? me.storeid : "costtListStore";
		me.store = Ext.create("Ext.data.Store", {
			fields : [ 'bcbh', 'num' ],
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("")
		});
		me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2
		});
		me.plugins = [ me.cellEditing ];
		Ext.applyIf(me, {
			columns : [ {
				header : "工程编号",
				flex : 1,
				dataIndex : "bcbh",
				editor : {
					xtype : "idcombo",
					type : 5,
					allowBlank : false
				}
			}, {
				header : "数量",
				flex : 1,
				editor : {
					xtype : 'numberfield',
					allowBlank : false,
					minValue : 1,
					maxValue : 100000
				},
				dataIndex : 'num'
			} ],

			tbar : [ {
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				// height : 80,
				columns : 10,
				defaults : {
					scale : "small"
				},
				items : [ {
					text : '新增',
					iconCls : "add",
					handler : function() {
						me.store.insert(0, {
							bcbh : '',
							num : ''
						})
						me.cellEditing.startEditByPosition({
							row : 0,
							column : 1
						});
					}
				}, {
					text : '删除',
					iconCls : "delete",
					handler : function() {
						var s = me.getSelectionModel().getSelection();
						if (s.length > 0) {
							me.store.remove(s[0]);
						}
					}
				} ]
			}, '->', {
				xtype : 'textfield',
				labelWidth : 40,
				itemId : 'note',
				width : 220,
				fieldLabel : '备注'
			} ],
			selModel : Ext.create("Ext.selection.CheckboxModel")

		});

		this.callParent();
	}
});