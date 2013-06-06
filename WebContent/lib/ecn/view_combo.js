Ext.define("Pcbms.ecn.comboBox", {
	extend : "Ext.form.ComboBox",
	alias : "widget.ecncombo",
	displayField : 'ecnid',
	valueField : 'ecnid',
	minChars : 2,
	queryParam : 'ecnid',
	onBlur : function() {
		if (this.getRawValue() == this.getValue()) {
			this.setValue("");
		}
	},
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			model : "Ecn",
			proxy : Pcbms.ajaxProxy({
				url : "/getListActionImpl!searchECNList.action?pageNum=20",
				reader : {
					type : 'json',
					root : 'ecnList'
				}
			})
		});

		this.callParent();
	}

});