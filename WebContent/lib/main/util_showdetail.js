
function showDetial(type) {
	var me = this;

	// 产品型号
	if (!this.pt) {
		this.pt = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.ptWindow) {
				me.ptForm = Ext.create("Pcbms.product.UpdProjectFile", {
					width : "100%",
					detail : true,
					height : "100%"
				});

				me.ptWindow = Ext.create("Ext.window.Window", {
					width : 900,
					height : 600,
					layout : "fit",
					title : '产品型号详情',
					modal : true,
					closeAction : "hide",
					items : me.ptForm
				});
			}

			Ext.Ajax
					.request({
						url : "/projectFileAction!searchProjectFileByBcbh.action?projectFile.bcbh="
								+ i,
						success : new Pcbms.ajaxHandler({
							success : function(str) {
								Ext.getBody().unmask();
								me.ptWindow.show();
								me.ptForm.loadData(str.projectFile);

							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
					});

		};
	}

	// 产品详细
	if (!this.prod) {
		this.prod = function(i, type) {
			Ext.getBody().mask("加载中..");
			if (!me.prodWindow) {
				me.prodForm = Ext.create("Pcbms.product.UpdProduct", {
					width : "100%",
					detail : true,
					height : "100%"
				});

				me.pordWindow = Ext.create("Ext.window.Window", {
					width : 900,
					height : 600,
					layout : "fit",
					title : '产品需求详细',
					modal : true,
					closeAction : "hide",
					items : me.prodForm
				});
			}

			Ext.Ajax
					.request({
						url : "/productAction!searchProductByProdId.action?product.prodId="
								+ i,
						success : new Pcbms.ajaxHandler({
							success : function(str) {
								Ext.getBody().unmask();
								me.pordWindow.show();
								me.prodForm.loadData(str.product, type);
							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
					});

		};
	}

	// 合同
	if (!this.ct) {
		this.ct = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.ctWindow) {
				me.ctForm = Ext.create("Pcbms.business.UpdContract", {
					width : "100%",
					height : "100%",
					detail : true
				});
				me.ctWindow = Ext.create("Ext.window.Window", {
					width : 900,
					height : 600,
					modal : true,
					layout : "fit",
					title : '合同详情',
					closeAction : "hide",
					items : me.ctForm
				});
			}

			Ext.Ajax
					.request({
						url : "/contractManagementAction!searchContractById.action?contract.contractid="
								+ i,
						success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.ctWindow.show();
								me.ctForm.loadData(str.contract);
								Ext.getBody().unmask();
							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
					});

		};
	}

	// 工作板
	if (!this.wb) {
		this.wb = function(i) {
			Ext.getBody().mask("加载中..");
			me.wbForm = Ext.create("Pcbms.product.UpdWorkBoard", {
				width : "100%",
				detail : true,
				height : "100%"
			});
			me.wbWindow = Ext.create("Ext.window.Window", {
				minWidth : 900,
				minHeight : 600,
				maximized : true,
				layout : "fit",
				modal : true,
				title : '工作板详情',
				items : me.wbForm
			});
			Ext.Ajax
					.request({
						url : "/workBoardManagementAction!searchWorkBoardByid.action?wbid="
								+ i,
						success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.wbWindow.show();
								Ext.getBody().unmask();
								me.wbForm.loadData(str.workBoardInfo);

							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
					});
		};
	}

	// 开料模板单
	if (!this.tt) {
		this.tt = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.ttWindow) {
				me.ttForm = Ext.create("Pcbms.view.updTemplateTicket", {
					title : '',
					detail : true
				});
				me.ttWindow = Ext.create("Ext.window.Window", {
					width : 920,
					height : 600,
					layout : "fit",
					modal : true,
					title : '模板单详情',
					closeAction : "hide",
					items : me.ttForm
				});
			}

			// 加载型号数据
			Ext.Ajax.request({
				url : "/mtTicketAction!searchMTTicket.action?mtTicket.mtid="
						+ i,
				success : new Pcbms.ajaxHandler({
					success : function(str) {
						me.ttWindow.show();
						me.ttForm.loadData(str.mtTicket);
					},
					error : function(r) {
						Ext.getBody().unmask();
						Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
					}
				})
			});
		};
	}

	// 开料单
	if (!this.mt) {
		this.mt = function(i) {
			Ext.getBody().mask("加载中..");
			if (!me.mtWindow) {
				me.mtForm = Ext.create("Pcbms.product.UpdMaterialTicket", {
					title : '',
					detail : true
				});
				me.mtWindow = Ext.create("Ext.window.Window", {
					width : 960,
					height : 600,
					layout : "fit",
					modal : true,
					title : '开料单详情',
					closeAction : "hide",
					items : me.mtForm
				});
			}

			Ext.Ajax
					.request({
						url : "/materialTicketAction!searchMaterialTicket.action?flagForUpdate=1&materialTicket.mid="
								+ i,
						success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.mtWindow.show();
								me.mtForm.mid = i;
								me.mtForm.loadData(str.materialTicket);
								Ext.getBody().unmask();
							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
					});
		};
	}

	// 管制卡
	if (!this.lot) {
		this.lot = function(i) {
			Ext.getCmp("mainpanel").loadControl({
				xtype : 'lcfind',
				text : '管制卡查询',
				stepid : i

			});

		};
	}

	// 出货单
	if (!this.op) {
		this.op = function(i) {
			Ext.getBody().mask("加载中..");

			// 加载型号数据
			Ext.Ajax
					.request({
						url : "/wareHouseManagementAction!searchDeliveryTicketDetail.action?chIds="
								+ i,
						success : new Pcbms.ajaxHandler({
							success : function(str) {
								me.opWindow = Ext.create(
										"Pcbms.warehouse.OutPartViewWindow", {

										});
								me.opWindow.show();
								me.opWindow.loadData(str.deliveryTicket);
							},
							error : function(r) {
								Ext.getBody().unmask();
								Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
							}
						})
					});
		};
	}

	if (type) {
		var result = {
			renderer : function(v, m, r) {
				return "<a style='color:blue;' onclick='showDetial(\"" + type
						+ "\")." + type + "(\"" + v + "\")'>" + v + "</a>";
			}
		}
		result[type] = this[type];
		return result;
	}
}