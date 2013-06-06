
Ext.require("app.outsourceing.view_productOutSourceWindow");

Ext.require("app.outsourceing.view_searchProductWindow");

Ext.define("Pcbms.view.searchProductByos", {
	extend : "Ext.window.Window",
	alias : "widget.ostwindow",
	width : 900,
	height : 600,
	modal : true,
	title : '产品列表',
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var storeid = me.storeId || "ostWindowStore";

		me.store = Ext.create("Ext.data.Store", {
			model : "Product",
			storeId : storeid,
			autoLoad : true,
			proxy : Pcbms.ajaxProxy("/wareHouseManagementAction!searchOSProducts.action?osc.whvid="
					+ me.whvid)
		});

		Ext.applyIf(me, {
			items : [{
				xtype : 'gridpanel',
				store : me.store,
				listeners : {
					'itemdblclick' : function(e, r) {

						if (!me.infoWindow) {
							me.infoWindow = Ext.create(
									"Pcbms.view.productInPart", {
										target : this

									});

						}

						me.infoWindow.dataLoad(r);
						me.infoWindow.show();

					}

				},
				columns : [{
							header : "工程编号",
							dataIndex : "bcbh",
							width : 150
						}, {
							header : "入库数量",
							dataIndex : "num"
						}, {
							header : '实际入库数量',
							dataIndex : 'sjnum',
							renderer : function(v, m, r) {
								if (r.data["sjnum"]) {
									return r.data["sjnum"];
								}
								return r.data['num'];
							}
						}, {
							header : '仓位安排',
							flex : 1,
							renderer : function(v, m, r) {
								if (r.data["cwinfo"]
										&& r.data["cwinfo"].length > 0) {
									var str = "";

									for (var i = 0; i < r.data["cwinfo"].length; i++) {
										var item = r.data["cwinfo"][i];

										str += item['cwname'] + "("
												+ item['num'] + ")";

										if (i != r.data["cwinfo"].length - 1) {
											str += ",";
										}
									}

									return str;

								} else {
									return "默认仓位";

								}
							}
						}]
			}],
			buttons : [{
				text : '确定入库',
				iconCls:"accept",
				handler : function() {
					Ext.Msg.confirm("提示", "确定要入库吗?", function(v) {

						if (v == 'no')
							return;
						var params = {};

						var items = me.store.data.items;

						for (var i = 0; i < items.length; i++) {
							var item = items[i].data;
							params["osList[" + i + "].bcbh"] = item["bcbh"];
							params["osList[" + i + "].num"] = item["sjnum"];
							params["osList[" + i + "].note"] = item["note"];
							params["osList[" + i + "].pid"] = item["pid"];

							var ci = item["cwinfo"];

							if (ci && ci.length > 0) {
								for (var j = 0; j < ci.length; j++) {
									params["osList[" + i + "].whpList[" + j
											+ "].cwbh"] = ci[j]["cwname"];
									params["osList[" + i + "].whpList[" + j
											+ "].sycapacity"] = ci[j]["num"];
								}

							}

						}
						
						Ext.Ajax.request({
							url : "/wareHouseManagementAction!storeOSProducts.action",
							params : params,
							success : new Pcbms.ajaxHandler({
								success : function(str) {
									Ext.Msg.alert("提示",str.msg,function(){
										
										Ext.data.StoreManager
														.lookup("ostListStore").load();
										
									});
									me.close();
								},
								error : function(r) {
									Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
								}
							})
						});

					});
				}
			}]
		});

		this.callParent();
	}
});