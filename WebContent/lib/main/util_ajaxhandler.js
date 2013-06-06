/**
 * ajax回调封装
 * @param {} config
 * @return {}
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