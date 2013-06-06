/**
 * 权限按钮工具条
 */
Ext.define("app.base.auditbar", {
	extend : "Ext.toolbar.Toolbar",
	alias : 'widget.auditbar',
	initComponent : function() {
		var me = this;
		
		var call = function(){
			var sme = me;
			
			// 根据组件类型 获取它所有的按钮
			Ext.Ajax.request({
				url : 'permission!queryBtnListByControlType.action',
				params : {
					'entity.controlType' : me.compont
				},
				success : new app.ajaxHand({
					success : function(result,scope) {
						var btns = result.searchList;
						for ( var i = 0; i < btns.length; i++) {
							if(scope){
								sme = scope;
							}
							sme.insert(i, [ {
								xtype : btns[i].controlType,
								text : btns[i].text
							} ]);
						}
					}
				},sme)

			});
		};
		
		call();
		
		if(me.searchItems){
			me.items = ['->', {
				xtype : "searchItems",
				items : me.searchItems
			} ];
		}

		me.callParent(me);
	}
});