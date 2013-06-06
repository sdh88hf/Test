
Ext.require("app.completept.view_productInPartWindow");

Ext.define("Pcbms.view.searchProductBycp", {
	extend : "Ext.window.Window",
	alias : "widget.cptwindow",
	width : 700,
	height : 600,
	modal : true,
	title : '待入库产品列表',
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var storeid = me.storeId || "cptWindowStore";

		me.store = Ext.create("Ext.data.Store", {
			model : "Product",
			storeId : storeid,
			autoLoad : true,
			proxy : Pcbms.ajaxProxy("/wareHouseManagementAction!searchEndProductList.action?epv.whvid="
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
							dataIndex : "rknum"
						}, {
							header : '实际入库数量',
							dataIndex : 'sjnum',
							renderer : function(v, m, r) {
								if (r.data["sjnum"]) {
									return r.data["sjnum"];
								}
								return r.data['rknum'];
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
				handler : function() {
					Ext.Msg.confirm("提示", "确定要入库吗?", function(v) {

						if (v == 'no')
							return;
						var params = {"epv.whvid":me.whvid};
						var items = me.store.data.items;
						for (var i = 0; i < items.length; i++) {
							var item = items[i].data;
							params["epList[" + i + "].bcbh"] = item["bcbh"];
							params["epList[" + i + "].num"] = item["sjnum"];
							params["epList[" + i + "].note"] = item["note"];
							params["epList[" + i + "].pid"] = item["pid"];
							
							var ci = item["cwinfo"];

							if (ci && ci.length > 0) {
								for (var j = 0; j < ci.length; j++) {
									params["epList[" + i + "].whpList[" + j
											+ "].cwbh"] = ci[j]["cwname"];
									params["epList[" + i + "].whpList[" + j
											+ "].sycapacity"] = ci[j]["num"];
								}

							}

						}

						Ext.Ajax.request({
							url : "/wareHouseManagementAction!storeEndProducts.action",
							params : params,
							success : new Pcbms.ajaxHandler({
								success : function(str) {
									Ext.Msg.alert("提示",str.msg,function(){
										
										Ext.data.StoreManager
														.lookup("cptListStore").load();
										
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