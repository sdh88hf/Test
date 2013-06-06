Ext.define("Pcbms.product.WipWorkboardList", {
	extend : "Ext.grid.Panel",
	alias : "widget.wwgrid",
	initComponent : function() {
		var me = this;

		var storeid = me.storeid ? me.storeid : "wWipStore";

		var columns = [];

		var fields = [];

		var data = [];

		var load = true;
		me.tbar = [], Ext.Ajax.request({
			url : "/wipReportAction!searchWIP.action?type=0",
			async : false,
			success : new Pcbms.ajaxHandler({
				success : function(str) {
					
					if(!str.wip||!str.wip.json){
						
						Ext.Msg.alert("提示","当前无任何关于工作板的信息");
					}

					var wipdata = Ext.decode(str.wip.json);

					//添加总数量信息
					me.tbar.push({
								text : wipdata.totalnumnote + ':' + wipdata.totalnum
							});
					//添加总面积信息
					me.tbar.push({
								text : wipdata.totalzmjnote + ':' + wipdata.totalzmj + 'mm'
							});

					for (var i = 0; i < wipdata.wblist.length; i++) {

						for (var k in wipdata.wblist[i]) {

							// 表头
							if (i == 0) {

								if (Ext.typeOf(wipdata.wblist[i][k]) == 'object') {//如果是集合 

									for (var k1 in wipdata.wblist[i][k]) {//遍历添加列头
										columns.push({
													header : wipdata.wblist[i][k][k1],
													width : 70,
													dataIndex : k1
												});

										fields.push(k1);
									}

								} else {
									columns.push({
												header : wipdata.wblist[i][k],
												width : 70,
												dataIndex : k
											});
									fields.push(k);
								}
							} else {// 数据

								if (Ext.typeOf(wipdata.wblist[i][k]) == 'object') {
									for (var k1 in wipdata.wblist[i][k]) {
										if (Ext.typeOf(data[i - 1]) == 'array') {
											data[i - 1]
													.push(wipdata.wblist[i][k][k1]);
										} else {
											data[i - 1] = [wipdata.wblist[i][k][k1]];
										}
									}
								} else {
									if (Ext.typeOf(data[i - 1]) == 'array') {
										data[i - 1].push(wipdata.wblist[i][k]);
									} else {
										data[i - 1] = [wipdata.wblist[i][k]];
									}
								}
							}

						}
					}

					me.store = Ext.create("Ext.data.ArrayStore", {
								fields : fields,
								storeId : storeid,
								data : data
							});

					Ext.applyIf(me, {
								columns : columns
							});

				},
				error : function(r) {
					Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
				}
			})
		});

		me.tbar.push('->');

		me.tbar.push({
					xtype : 'textfield',
					fieldLabel : '工作板编号',
					listeners : {
						change : function() {
							var v = this.getValue();

							me.store.suspendEvents();
							me.store.clearFilter();
							me.store.resumeEvents();
							if (v == "") {

								me.store.filter([{
											fn : function(record) {
												return true;
											}
										}]);
							} else {
								me.store.filter([{
											fn : function(record) {
												return record.get('wbid') == v;
											}
										}]);

							}
						}
					}
				});

		me.callParent();
	}
});