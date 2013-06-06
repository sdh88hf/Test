Ext
		.define(
				"Pcbms.product.PrintPack",
				{
					extend : "Ext.window.Window",
					alias : "widget.ppwindow",
					width : 300,
					height : 200,
					modal : true,
					bodyPadding : 10,
					load : function() {
						var me = this;

						Ext.Ajax
								.trequest({
									url : "/produceProcessManagementAction!searchBCBHInStep.action?lotid="
											+ me.lotid + "&stepid=" + me.stepid,
									async : false,
									success : function(str) {
										for ( var i = 0; i < str.bcbhs.length; i++) {
											me.items[0].store.push([
													str.bcbhs[i].num,
													str.bcbhs[i].bcbh ]);
										}
									}
								});

					},
					initComponent : function() {
						var me = this;

						Ext.applyIf(me, {

							items : [ {
								xtype : 'combobox',
								fieldLabel : '工程编号',
								displayField : 'name',
								valueField : 'value',
								editable : false,
								allowBlank : false,
								itemId : 'bcbh',
								onChange : function(e, n, o) {
									me.down("#num").setValue(e);
								},
								store : []
							}, {
								xtype : 'numberfield',
								fieldLabel : '产品总数量',
								itemId : 'num'
							}, {
								xtype : 'numberfield',
								allowBlank : false,
								itemId : 'bznum',
								fieldLabel : '包装数量'
							}, {
								xtype : 'numberfield',
								allowBlank : false,
								itemId : 'dynum',
								fieldLabel : '打印数量'
							} ],
							buttons : [ {
								text : '确定',
								handler : function() {
									if (me.down("#bcbh").isValid()
											&& me.down("#bznum").isValid()
											&& me.down("#dynum").isValid()) {

										var bznum = me.down("#bznum")
												.getValue();
										var copies = [];

										for ( var i = 0; i < me.down("#dynum")
												.getValue(); i++) {
											copies.push(bznum);
										}

										tpmsprinter.print("certification", {
											bcbh : me.down("#bcbh").rawValue,
											copies : copies
										});

									}

								}
							} ]
						});

						me.title = "管制卡" + me.lotid + "打印包装标签";

						me.load();

						this.callParent();
					}
				});