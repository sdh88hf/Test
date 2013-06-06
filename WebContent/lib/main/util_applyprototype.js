/**
 * 覆盖ext的默认属性配置
 */

// 文本框最大输入长度48
Ext.apply(Ext.form.field.Text.prototype, {
	maxLength : 48
});

// 文本域最大输入长度500
Ext.apply(Ext.form.field.TextArea.prototype, {
	maxLength : 500
});
// 数字框大于0
Ext.apply(Ext.form.field.Number.prototype, {
	validator : function(v) {
		if (v != "") {

			if (v <= 0) {
				return "必须大于0";
			}
		}

		return true;
	}
});

Ext.MessageBox.initComponent();
