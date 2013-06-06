Ext.define('Pcbms.warehouse.UpdPartPosForm', {
	extend : 'Ext.form.Panel',
	alias : "widget.ppupd",
	bodyPadding : 10,
	loadData : function(cwbh) {
		var me = this;
		me.setLoading("正在加载");

		Ext.Ajax.request({
			url : "/wareHouseManagementAction!searchPosition.action?position.cwbh="
					+ cwbh,
			success : new Pcbms.ajaxHandler({
						success : function(str) {

							var data = str.position;

							Ext.each(me.getForm().getFields().items,
									function(i) {
										if (i.getName()) {

											i.setValue(data[i.getName()
													.replace("position.", "")]);

										}

									});

							me.setLoading(false);

						},
						error : function(r) {
							Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
						}
					})
		});

	},
	formsubmit : function() {// 表单提交
		var me = this;
		this.getForm().submit({
					url : '/wareHouseManagementAction!modifyPosition.action',
					success : function(form, action) {
						Ext.Msg.alert("提示", action.result.msg);
						me.up("window").close();
					},
					failure : Pcbms.formHandler
				});
	},
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
					items : [{
								xtype : 'textfield',
								fieldLabel : '仓位编号',
								readOnly : true,
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
								store : [[0, '否'], [1, '是']],
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
							}]
				});

		me.callParent(arguments);

		me.getForm().isValid();
	}

});