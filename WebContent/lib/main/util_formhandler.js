/**
 * 表单提交回调函数封装
 * @param {} form
 * @param {} action
 */
Pcbms.formHandler = function(form, action) {
	switch (action.failureType) {
		case Ext.form.action.Action.CLIENT_INVALID :
			Ext.Msg.alert('表单错误', '你提交的表单中含有错误!请校正后提交!');
			break;
		case Ext.form.action.Action.CONNECT_FAILURE :
			Ext.Msg.alert('链接错误', '与服务器间的通信出现问题!请稍后再试!');
			break;
		case Ext.form.action.Action.SERVER_INVALID :
			Ext.Msg.alert('数据错误', action.result.msg);
	}
};