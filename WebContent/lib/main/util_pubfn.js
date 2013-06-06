/**
 * 验证表格的选中行
 * 
 * @param {}
 *            gp 表格对象
 * @param {}
 *            t 1:只能选一行 2:可以选多行
 */
function checkGridSelect(gp, t) {

	var s = gp.getSelectionModel().getSelection();
	if (t == 1) {
		if (s == null || s.length == 0 || s.length > 1) {
			Ext.MessageBox.alert("操作错误", "请选择一条操作数据");
			return false;
		}
	} else if (t == 2) {
		if (s == null || s.length == 0) {
			Ext.MessageBox.alert("操作错误", "请至少选择一条操作数据");
			return false;
		}
	}

	return s;
}

/**
 * 给组件指定时间的遮罩
 * @param {} me 组件
 * @param {} msg 提示信息
 * @param {} time 时间
 */
function deferLoading(me, msg, time) {

	if (!me) {
		return;
	}

	if (!msg) {

		msg = "加载中...";
	}

	if (!time) {

		time = 2000;
	}

	me.setLoading('加载中...');
	Ext.defer(function() {
				me.setLoading(false);
			}, 2000);

}
