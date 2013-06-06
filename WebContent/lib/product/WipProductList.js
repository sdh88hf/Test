Ext.define("Pcbms.product.WipProductList", {
	extend : "Ext.grid.Panel",
	alias : "widget.pwgrid",
	initComponent : function() {
		var me = this;

		var storeid = me.storeid ? me.storeid : "pWipStore";

		var columns = [];

		var fields = [];

		var data = [];

		var load = true;
		me.tbar = [], Ext.Ajax.request({
			url : "/wipReportAction!searchWIP.action?type=1",
			async : false,//取消ajax异步,在执行完success后才往下执行
			success : new Pcbms.ajaxHandler({
				success : function(str) {
					
					if(!str.wip||!str.wip.json){
						
						Ext.Msg.alert("提示","当前无任何关于产品的信息");
					}
					
					//将json格式字符串转换成对象
					var wipdata = Ext.decode(str.wip.json);
					
					//添加总数量信息
					me.tbar.push({
								text : wipdata.totalnumnote + ':' + wipdata.totalnum
							});
					//添加总面积信息
					me.tbar.push({
								text : wipdata.totalzmjnote + ':' + wipdata.totalzmj + 'mm'
							});
					
					//迭代报表数据
					for (var i = 0; i < wipdata.prodlist.length; i++) {

						for (var k in wipdata.prodlist[i]) {

							// 表头
							if (i == 0) {

								if (Ext.typeOf(wipdata.prodlist[i][k]) == 'object') {//如果是集合

									for (var k1 in wipdata.prodlist[i][k]) { //遍历添加列头
										columns.push({
													header : wipdata.prodlist[i][k][k1],
													width : 70,
													dataIndex : k1
												});

										fields.push(k1);
									}

								} else {
									columns.push({
												header : wipdata.prodlist[i][k],
												width : 70,
												dataIndex : k
											});
									fields.push(k);
								}
							} else {// 数据

								if (Ext.typeOf(wipdata.prodlist[i][k]) == 'object') {
									for (var k1 in wipdata.prodlist[i][k]) {
										if (Ext.typeOf(data[i - 1]) == 'array') {
											data[i - 1]
													.push(wipdata.prodlist[i][k][k1]);
										} else {
											data[i - 1] = [wipdata.prodlist[i][k][k1]];
										}
									}
								} else {
									if (Ext.typeOf(data[i - 1]) == 'array') {
										data[i - 1].push(wipdata.prodlist[i][k]);
									} else {
										data[i - 1] = [wipdata.prodlist[i][k]];
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
		
		//添加搜索框(本地过滤)
		me.tbar.push({
					xtype : 'textfield',
					fieldLabel : '工程编号',
					listeners : {
						change : function() {//当用户输入文字改变
							var v = this.getValue();

							me.store.suspendEvents();
							me.store.clearFilter();
							me.store.resumeEvents();
							if (v == "") {
								me.store.filter([{
											fn : function(record) {
												return true;//显示全部
											}
										}]);
							} else {
								
								me.store.filter([{
											fn : function(record) {
												//模糊匹配
												return record.get('bcbh').toLowerCase().indexOf(v.toLowerCase( )) >= 0;
											}
										}]);

							}
						}
					}
				});

		me.callParent();
	}
});