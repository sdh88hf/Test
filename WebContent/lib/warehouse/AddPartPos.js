Ext.define('Pcbms.warehouse.AddPartPos', {
	extend : 'Ext.form.Panel',
	alias : "widget.ppadd",
	bodyPadding : 10,
	formsubmit : function() {// 表单提交
		var me = this;
		this.getForm().submit({
			url : '/wareHouseManagementAction!addPosition.action',
			success : function(form, action) {
				Ext.Msg.alert("提示", action.result.msg);
				me.getForm().reset();
			},
			failure : Pcbms.formHandler
		});
	},
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			items : [ {
				xtype : 'textfield',
				fieldLabel : '仓位编号',
				name : 'position.cwbh',
				allowBlank : false
			}, {
				xtype : 'numberfield',
				fieldLabel : '仓位容量',
				name : 'position.capacity',
				allowBlank : false
			}, {
				xtype : 'combobox',
				name : 'position.defaultkw',
				store : [ [ 0, '否' ], [ 1, '是' ] ],
				value : 0,
				fieldLabel : '是否为默认仓位'
			}, {
				xtype : 'textareafield',
				name : 'position.desc',
				fieldLabel : '备注'
			}, {
				xtype : 'button',
				text : '提交',
				iconCls : "accept",
				margin : '0 0 0 220',
				handler : function() {
					me.formsubmit();
				}
			} ]
		});
		me.callParent(arguments);
		me.getForm().isValid();
	}

});