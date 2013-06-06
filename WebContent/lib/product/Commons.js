/**
 * gerber 文件查看
 */
Ext.define("Pcbms.product.GerberViewWindow", {
	extend : "Ext.window.Window",
	alias : "widget.gerberview",
	width : 800,
	height : 500,
	hidden : false,
	border : false,
	modal : true,
	maximizable : true,
	layout : 'border',
	title : 'Gerber文件信息',
	buttons : [{
		text : '下载选中的文件',
		handler : function() {
			// 下载
			var form = Ext.getCmp("fileform").getForm();
			var values = form.getValues();
			var layers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (var i = 0; i < 14; i++) {
				for (var j = 0; j < values.layer.length; j++) {
					var c = parseInt(values.layer[j].charAt(i), 16);
					if (c == 0) {
						continue;
					}
					if (layers[i] == 0) {
						layers[i] = c;
					} else if (layers[i] < c + 13) {
						layers[i] = c + 13;
					} else if (c < layers[i]) {
						layers[i] += 13;
					}
				}
			}
			var layerstring = "";
			for (var i = 0; i < 14; i++) {
				layerstring += layers[i].toString(36);
			}
			var format = 0;
			if (Ext.isArray(values.format)) {
				for (var i = 0; i < values.format.length; i++) {
					format |= values.format[i];
				}
			} else if (Ext.isString(values.format)) {
				format = values.format;
			}
			if (format == 0) {
				alert("请选择需要下载内容的类型!");
			}
			document.getElementById("downframe").src = 'psFileAction!download.action?psfileId='
					+ me.psfileId
					+ '&amp;dqBean.layers='
					+ layerstring
					+ '&amp;dqBean.format=' + format;
		}
	}],
	initComponent : function() {
		var me = this;
		// 有效的层信息
		var checkboxes = [];
		me.items = [{
					xtype : 'form',
					id : 'fileform',
					region : 'north',
					resizable : true,
					defaults : {
						labelWidth : 90,
						labelAlign : "top",
						margin : "5 0 5 0"
					},
					height : 200,
					items : [{
								xtype : 'checkboxgroup',
								fieldLabel : '<b>下载内容</b>',
								columns : 3,
								items : [{
											boxLabel : 'Gerber文件',
											name : 'format',
											inputValue : "1",
											checked : true
										}, {
											boxLabel : '图像文件',
											name : 'format',
											inputValue : "2"
										}, {
											boxLabel : '其他文件',
											name : 'format',
											inputValue : "4"
										}]
							}, {
								xtype : 'checkboxgroup',
								fieldLabel : '<b>可选文件类型</b>',
								allowBlank : false,
								msgTarget : 'side',
								autoFitErrors : false,
								defaultType : 'container',
								items : checkboxes
							}]
				}, {
					xtype : 'panel',
					region : 'center',
					id : 'imagepanel'
				}];
		var activelayers = me.parselayers(me.layers);
		var c = {
			hiddentitle : ""
		};
		for (var i = 0; i < activelayers.length; i++) {
			if (c.hiddentitle != activelayers[i].title) {
				c = {
					hiddentitle : activelayers[i].title,
					items : [{
								xtype : 'component',
								html : activelayers[i].title,
								cls : 'x-form-check-group-label'
							}]
				};
				checkboxes.push(c);
			}
			c.items.push({
				xtype : 'checkboxfield',
				boxLabel : activelayers[i].name,
				name : 'layer',
				inputValue : activelayers[i].id,
				listeners : {
					change : function(field, value) {
						Ext
								.getCmp("imagepanel")
								.update('<img src="psFileAction!download.action?psfileId='
										+ me.psfileId
										+ '&amp;dqBean.layers='
										+ field.inputValue
										+ '&amp;dqBean.format=2" style="height:400px;"/>');
					}
				}
			});
		}
		me.callParent(arguments);
	},
	parselayers : function(layers) {
		var names = [];
		var j = 0;
		for (var i = 0; i < 14; i++) {
			var c = parseInt(layers.charAt(i), 36);
			switch (i) {
				case 0 :
					if (c != 0) {
						names[j++] = {
							title : '禁止布线层',
							name : "GKO",
							id : "10000000000000"
						};
					}
					break;
				case 1 :
					if (c > 13) {
						var d = (c - 13);
						while (--d >= 0) {
							names[j++] = {
								title : '钻孔图层',
								name : "GD" + d,
								id : "0" + d.toString(16) + "000000000000"
							};
						}
					} else if (c != 0) {
						names[j++] = {
							title : '钻孔图层',
							name : "GD" + c,
							id : "0" + c.toString(16) + "000000000000"
						};
					}
					break;
				case 2 :
					if (c > 13) {
						var d = (c - 13);
						while (--d >= 0) {
							names[j++] = {
								title : '钻孔引导层',
								name : "GG" + d,
								id : "00" + d.toString(16) + "00000000000"
							};
						}
					} else if (c != 0) {
						names[j++] = {
							title : '钻孔引导层',
							name : "GG" + c,
							id : "00" + c.toString(16) + "00000000000"
						};
					}
					break;
				case 3 :
					if (c != 0) {
						names[j++] = {
							title : '顶层丝网',
							name : "GTO",
							id : "00010000000000"
						};
					}
					break;
				case 4 :
					if (c != 0) {
						names[j++] = {
							title : '顶锡膏层',
							name : "GTP",
							id : "00001000000000"
						};
					}
					break;
				case 5 :
					if (c != 0) {
						names[j++] = {
							title : '顶阻焊层',
							name : "GTS",
							id : "00000100000000"
						};
					}
					break;
				case 6 :
					if (c != 0) {
						names[j++] = {
							title : '顶层线路',
							name : "GTL",
							id : "00000010000000"
						};
					}
					break;
				case 7 :
					if (c > 13) {
						var d = (c - 13);
						while (--d >= 0) {
							names[j++] = {
								title : '机械层',
								name : "GM" + d,
								id : "0000000" + d.toString(16) + "000000"
							};
						}
					} else if (c != 0) {
						names[j++] = {
							title : '机械层',
							name : "GM" + c,
							id : "0000000" + c.toString(16) + "000000"
						};
					}
					break;
				case 8 :
					if (c > 13) {
						var d = (c - 13);
						while (--d >= 0) {
							names[j++] = {
								title : '中间信号层',
								name : "G" + d,
								id : "00000000" + d.toString(16) + "00000"
							};
						}
					} else if (c != 0) {
						names[j++] = {
							title : '中间信号层',
							name : "G" + c,
							id : "00000000" + c.toString(16) + "00000"
						};
					}
					break;
				case 9 :
					if (c > 13) {
						var d = (c - 13);
						while (--d >= 0) {
							names[j++] = {
								title : '内电层',
								name : "GP" + d,
								id : "000000000" + d.toString(16) + "0000"
							};
						}
					} else if (c != 0) {
						names[j++] = {
							title : '内电层',
							name : "GP" + c,
							id : "000000000" + c.toString(16) + "0000"
						};
					}
					break;
				case 10 :
					if (c != 0) {
						names[j++] = {
							title : '底层线路',
							name : "GBL",
							id : "00000000001000"
						};
					}
					break;
				case 11 :
					if (c != 0) {
						names[j++] = {
							title : '底层阻焊层',
							name : "GBS",
							id : "00000000000100"
						};
					}
					break;
				case 12 :
					if (c != 0) {
						names[j++] = {
							title : '底锡膏层',
							name : "GBP",
							id : "00000000000010"
						};
					}
					break;
				case 13 :
					if (c != 0) {
						names[j++] = {
							title : '底丝网层',
							name : "GBO",
							id : "00000000000001"
						};
					}
					break;
			}
		}
		return names;
	}
});
/**
 * 产品信息中常用的组建信息，抽取出来
 */
Ext.define('Pcbms.product.ProductField', {
			extend : "Ext.form.FieldSet",
			alias : "widget.productfield",
			defaults : {
				xtype : 'displayfield',
				labelWidth : 80,
				readOnly : true
			},
			initComponent : function() {
				var me = this;
				var productData = Ext.apply({}, me.jsonData);
				me.items = [{
							xtype : "displayfield",
							fieldLabel : "产品编号",
							name : "prodId",
							value : productData.prodId
						}, {
							fieldLabel : '创建时间',
							value : productData.createDate
						}, {
							xtype : "displayfield",
							fieldLabel : "客户型号",
							name : "khxh",
							value : productData.khxh
						}, {
							xtype : "displayfield",
							fieldLabel : "文字阻焊",
							name : "fontzh",
							value : productData.fontCss + productData.fontColor
									+ "," + productData.zhCss
									+ productData.zhColor
						}, {
							xtype : "displayfield",
							fieldLabel : "板材材料",
							name : "bccl",
							value : productData.bccl
						}, {
							xtype : "displayfield",
							fieldLabel : "板材型号",
							name : "bcxh",
							value : productData.bcxh
						}, {
							xtype : "displayfield",
							fieldLabel : "板厚",
							name : "bh",
							value : productData.bh
						}, {
							xtype : "displayfield",
							fieldLabel : "成品铜厚",
							name : "th",
							value : Ext.isEmpty(productData.ncth)
									? productData.wcth
									: "外" + productData.wcth + "内"
											+ productData.ncth
						}, {
							xtype : "displayfield",
							fieldLabel : "工艺",
							name : "gy",
							value : productData.gy
						}, {
							xtype : "displayfield",
							fieldLabel : "成型方式",
							name : "cxfs",
							value : productData.cxfs
						}, {
							xtype : "displayfield",
							fieldLabel : "客户文件编号",
							name : "bcbh",
							value : productData.bcbh
						}, {
							xtype : "displayfield",
							fieldLabel : "层数",
							name : "cs",
							value : productData.cs
						}, {
							xtype : "displayfield",
							fieldLabel : "客户文件",
							name : "projectName",
							value : productData.projectName
						}, {
							xtype : "displayfield",
							fieldLabel : "PCS尺寸信息",
							name : "pcsinfor",
							value : productData.pcsX + "X" + productData.pcsY
						}, {
							xtype : "displayfield",
							fieldLabel : "SET尺寸信息",
							name : "setinfor",
							value : (productData.setPs < 2
									? "单片 "
									: productData.setPs + "连片 ")
									+ productData.setX + "X" + productData.setY
						}, {
							xtype : "displayfield",
							fieldLabel : "过孔处理",
							name : "gkcl",
							value : productData.gkcl
						}, {
							xtype : "displayfield",
							fieldLabel : "最小线宽",
							value : productData.minlw
						}, {
							xtype : "displayfield",
							fieldLabel : "最小线距",
							value : productData.minld
						}, {
							xtype : "displayfield",
							fieldLabel : "最小孔径",
							value : productData.minhole
						}]
				me.callParent(arguments);
			}
		});
Ext.define('Pcbms.product.ProjectfileField', {
	extend : "Ext.form.FieldSet",
	alias : "widget.projectfilefield",
	defaults : {
		xtype : 'displayfield',
		labelWidth : 80,
		readOnly : true
	},
	initComponent : function() {
		var me = this;
		var projectfileData = Ext.apply({}, me.jsonData);
		me.items = [{
					xtype : "displayfield",
					fieldLabel : "文件编号",
					name : "bcbh",
					value : projectfileData.bcbh
				}, {
					xtype : "displayfield",
					fieldLabel : "创建时间",
					value : projectfileData.createDate
				}, {
					xtype : "displayfield",
					fieldLabel : "层数",
					name : "cs",
					value : projectfileData.cs
				}, {
					xtype : "displayfield",
					fieldLabel : "文件名称",
					name : "projectName",
					value : "<a href='javascript:Pcbms.downFile(\"projectfile\",\""
							+ projectfileData.bcbh
							+ "\")'>"
							+ projectfileData.projectName + "</a>"
				}, {
					xtype : "displayfield",
					fieldLabel : "文件类型",
					name : "fileType",
					value : projectfileData.fileType
				}, {
					xtype : "displayfield",
					fieldLabel : "PCS尺寸",
					value : projectfileData.pcsX + "X" + projectfileData.pcsY
				}, {
					xtype : "displayfield",
					fieldLabel : "SET尺寸",
					value : (projectfileData.setPs < 2
							? "单片 "
							: projectfileData.setPs + "连片 ")
							+ projectfileData.setX + "X" + projectfileData.setY
				}, {
					xtype : "displayfield",
					fieldLabel : "过孔处理",
					value : projectfileData.gkcl
				}, {
					xtype : "displayfield",
					fieldLabel : "最小线宽",
					value : projectfileData.minlw
				}, {
					xtype : "displayfield",
					fieldLabel : "最小线距",
					value : projectfileData.minld
				}, {
					xtype : "displayfield",
					fieldLabel : "最小孔径",
					value : projectfileData.minhole
				}]
		me.callParent(arguments);
	}
});

/**
 * 已处理单子文件
 */
Ext.define('Pcbms.product.PSfileField', {
			extend : "Ext.form.FieldSet",
			alias : "widget.psfilefield",
			defaults : {
				xtype : 'displayfield',
				labelWidth : 80,
				readOnly : true
			},
			initComponent : function() {
				var me = this;
				if (Ext.isEmpty(me.jsonData)) {
					me.html = "<b>无已处理文件记录...</b>";
				} else {
					var psfileData = me.jsonData;
					me.items = [{
								xtype : "displayfield",
								fieldLabel : "产品编号",
								name : "psfileId",
								value : psfileData.psfileId
							}, {
								fieldLabel : '创建时间',
								value : psfileData.createDate
							}, {
								xtype : "displayfield",
								fieldLabel : "客户型号",
								value : psfileData.createDate
							}, {
								xtype : 'displayfield',
								fieldLabel : "文件下载"
							}, {
								xtype : "displayfield",
								fieldLabel : "层数",
								name : "cs",
								value : psfileData.cs
							}, {
								xtype : "displayfield",
								fieldLabel : "PCS尺寸",
								value : psfileData.pcsX + "X" + psfileData.pcsY
							}, {
								xtype : "displayfield",
								fieldLabel : "SET尺寸",
								value : (psfileData.setPs < 2
										? "单片 "
										: psfileData.setPs + "连片 ")
										+ psfileData.setX
										+ "X"
										+ psfileData.setY
							}, {
								xtype : "displayfield",
								fieldLabel : "过孔处理",
								name : "gkcl",
								value : psfileData.gkcl
							}, {
								xtype : "displayfield",
								fieldLabel : "成品铜厚",
								name : "th",
								value : psfileData.th
							}, {
								xtype : "displayfield",
								fieldLabel : "本厂编号",
								name : "bcbh",
								value : psfileData.bcbh
							}, {
								xtype : "displayfield",
								fieldLabel : "文件备注",
								name : "note",
								value : psfileData.note
							}]
				}

				me.callParent(arguments);
			}
		});

Ext.define('Pcbms.product.ProductPlanField', {
			extend : "Ext.form.FieldSet",
			alias : "widget.productplanfield",
			defaults : {
				xtype : 'displayfield',
				labelWidth : 80,
				readOnly : true
			},
			initComponent : function() {
				var me = this;
				var orderplanData = Ext.apply({}, me.jsonData);
				var sh = "";
				switch (orderplanData.status) {
					case 0 :
						sh = "<span style='color:red'>已作废</span>";
						break;
					case 1 :
						sh = "生产中";
						break;
					case 2 :
						sh = "<span style='color:red'>有效订单</span>";
						break;
				}
				me.items = [{
							fieldLabel : "生产编号",
							name : "orderId",
							value : orderplanData.ppId
						}, {
							fieldLabel : '订单状态',
							value : sh
						}, {
							fieldLabel : '创建时间',
							value : orderplanData.createDate
						}, {
							xtype : "combobox",
							fieldLabel : "生产类型",
							name : "orderType",
							store : [[1, '正常生产'], [2, '缺数补料生产']],
							value : orderplanData.productType
						}, {
							xtype : "displayfield",
							fieldLabel : "产品优先级",
							name : "jjType",
							value : Pcbms.JJTypeRenderer(orderplanData.jjType)
						}, {
							xtype : "displayfield",
							fieldLabel : "安排数量",
							name : "num",
							value : orderplanData.tlnum + " pcs"
						}, {
							xtype : "displayfield",
							fieldLabel : "未组数量",
							name : "wzgzbnum",
							value : orderplanData.wzgzbnum + " pcs"
						}, {
							xtype : "displayfield",
							fieldLabel : "已组数量",
							name : "yzgzbnum",
							value : orderplanData.yzgzbnum + " pcs"
						}, {
							xtype : "displayfield",
							fieldLabel : "测试方式",
							name : "csfs",
							value : orderplanData.csfs
						}, {
							xtype : "displayfield",
							fieldLabel : "成型方式",
							name : "cxfs",
							value : orderplanData.cxfs
						}, {
							xtype : "displayfield",
							fieldLabel : "生产备注信息",
							name : "ppNote",
							value : orderplanData.ppNote
						}];
				me.callParent(arguments);
			}
		});

/**
 * 订单field
 */
Ext.define('Pcbms.product.ProductOrderField', {
			extend : "Ext.form.FieldSet",
			alias : "widget.productorderfield",
			defaults : {
				xtype : 'displayfield',
				labelWidth : 80,
				readOnly : true
			},
			initComponent : function() {
				var me = this;
				var orderData = Ext.apply({}, me.jsonData);
				var sh = "";
				switch (orderData.status) {
					case 0 :
						sh = "<span style='color:red'>已作废</span>";
						break;
					case 1 :
						sh = "订单还在初始化状态";
						break;
					case 2 :
						sh = "<span style='color:blue'>有效订单</span>";
						break;
					case 3 :
						sh = "<span style='color:orangle'>无效的订单</span>";
						break;
					case 4 :
						sh = "<span style='color:pink'>工程部退的订单</span>";
						break;
					case 5 :
						sh = "<span style='color:green'>工程部审核的订单</span>";
						break;
				}
				me.items = [{
							fieldLabel : "订单编号",
							name : "orderId",
							value : orderData.orderId
						}, {
							fieldLabel : '订单状态',
							value : sh
						}, {
							fieldLabel : '创建时间',
							value : orderData.createDate
						}, {
							xtype : "combobox",
							fieldLabel : "订单类型",
							name : "orderType",
							store : [[2, '量产板'], [1, '样板'], [3, '报价板']],
							value : orderData.orderType
						}, {
							xtype : "displayfield",
							fieldLabel : "产品优先级",
							name : "jjType",
							value : Pcbms.JJTypeRenderer(orderData.jjType)
						}, {
							xtype : "displayfield",
							fieldLabel : "返单",
							name : "isfd",
							value : Pcbms.FdRenderer(orderData.isfd)
						}, {
							xtype : "displayfield",
							fieldLabel : "需求数量",
							name : "num",
							value : orderData.num + " pcs"
						}, {
							xtype : "displayfield",
							fieldLabel : "总面积",
							name : "zmj",
							value : Pcbms.SizeRenderer(orderData.zmj)
						}, {
							xtype : "displayfield",
							fieldLabel : "测试方式",
							name : "csfs",
							value : orderData.csfs
						}, {
							xtype : "displayfield",
							fieldLabel : "成型方式",
							name : "cxfs",
							value : orderData.cxfs
						}, {
							xtype : "displayfield",
							fieldLabel : "订单需求",
							name : "ddxq",
							value : orderData.ddxq
						}];

				me.callParent(arguments);
			}
		});
// 历史审核记录信息
Ext.define("Pcbms.product.AuditProcessField", {
			extend : "Pcbms.CommonGridPanel",
			alias : "widget.auditProcessField",
			border : false,
			page : false,
			al : false,
			sorters : [{
						property : 'auditDate',
						direction : 'ASC'
					}],
			url : 'processHistoryAction!listAuditHistory.action',
			model : 'AuditProcessBean',
			initComponent : function() {
				var me = this;
				var columns = [{
							xtype : 'rownumberer'
						}, {
							header : "审核时间",
							width : 140,
							dataIndex : "auditDate",
							renderer : Ext.util.Format
									.dateRenderer("Y-m-d H:i:s")
						}, {
							header : "审核结果",
							width : 80,
							dataIndex : "auditResult",
							renderer : function(v) {
								switch (v) {
									case 0 :
										return "<span style='color:red'>审核拒绝</span>";
									case 1 :
										return "<span style='color:green'>审核通过</span>";
								}
							}
						}, {
							header : "审核人",
							width : 120,
							dataIndex : "auditPerson",
							renderer : function(v, m, r) {
								return v + ':' + r.get("auditPersonName")
							}
						}, {
							header : "审核备注",
							flex : 1,
							dataIndex : "auditContent"
						}];
				var detailAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '查看详细',
					iconCls : 'projectfile',
					handler : function() {
						var r = me.sel.getSelection()[0];
						Ext.Msg.alert("审核详细",r.get("auditContent"));
					},
					sf : function(selections) {
						return selections.length != 1;
					}
				});
				me.items = me.genItems(columns, [], [detailAction]);
				me.callParent(arguments);
			},
			loadData : function() {
				this.getStore().load({
							params : {
								referenceId : this.uniqKey
							}
						})
			}
		});
// 历史锁定记录信息
Ext.define("Pcbms.product.LockProcessField", {
			extend : "Pcbms.CommonGridPanel",
			alias : "widget.lockProcessField",
			border : false,
			page : false,
			al : false,
			model : "LockProcessBean",
			sorters : [{
						property : 'lockedDate',
						direction : 'ASC'
					}],
			url : "processHistoryAction!listLockHistory.action",
			initComponent : function() {
				var me = this;
				var columns = [{
							xtype : 'rownumberer'
						}, {
							header : "时间",
							width : 140,
							dataIndex : "lockDate",
							renderer : Ext.util.Format
									.dateRenderer("Y-m-d H:i:s")
						}, {
							header : "类型",
							width : 80,
							dataIndex : "isLocked",
							renderer : function(v) {
								switch (v) {
									case 1 :
										return "<span style='color:red'>锁住</span>";
									case 0 :
										return "<span style='color:green'>解锁</span>";
								}
							}
						}, {
							header : "操作人编号",
							width : 80,
							dataIndex : "lockPerson",
							renderer : function(v) {
								if (Ext.isEmpty(v)) {
									return "<span style='color:red'>系统处理</span>";
								}
								return v;
							}
						}, {
							header : "操作人姓名",
							width : 120,
							dataIndex : "lockPersonName"
						}];
				me.items = me.genItems(columns, [], []);
				me.callParent(arguments);
			},
			loadData : function() {
				this.getStore().load({
							params : {
								referenceId : this.uniqKey
							}
						})
			}
		});
/**
 * @class Ext.ux.statusbar.ValidationStatus A {@link Ext.StatusBar} plugin that
 *        provides automatic error notification when the associated form
 *        contains validation errors.
 * @extends Ext.Component
 * @constructor Creates a new ValiationStatus plugin
 * @param {Object}
 *            config A config object
 */
Ext.define('Pcbms.product.RedoRequestStatus', {
	extend : 'Ext.Component',
	requires : ['Ext.util.MixedCollection'],
	/**
	 * @cfg {String} errorIconCls The {@link #iconCls} value to be applied to
	 *      the status message when there is a validation error. Defaults to
	 *      <tt>'x-status-error'</tt>.
	 */
	errorIconCls : 'x-status-error',
	/**
	 * @cfg {String} errorListCls The css class to be used for the error list
	 *      when there are validation errors. Defaults to
	 *      <tt>'x-status-error-list'</tt>.
	 */
	errorListCls : 'x-status-error-list',
	/**
	 * @cfg {String} validIconCls The {@link #iconCls} value to be applied to
	 *      the status message when the form validates. Defaults to
	 *      <tt>'x-status-valid'</tt>.
	 */
	validIconCls : 'x-status-valid',

	/**
	 * @cfg {String} showText The {@link #text} value to be applied when there
	 *      is a form validation error. Defaults to
	 *      <tt>'The form has errors (click for details...)'</tt>.
	 */
	showText : '你有待处理问题 (点击查看详细...)',
	/**
	 * @cfg {String} showText The {@link #text} value to display when the error
	 *      list is displayed. Defaults to
	 *      <tt>'Click again to hide the error list'</tt>.
	 */
	hideText : '再次点击隐藏问题',

	// private
	init : function(sb) {
		sb.on('render', function() {
			this.statusBar = sb;
			this.monitor = true;
			this.errors = Ext.create('Ext.util.MixedCollection');
			this.listAlign = (sb.statusAlign === 'right' ? 'br-tr?' : 'bl-tl?');

			if (this.grid) {
				// this.grid =
				// Ext.getCmp(this.grid);
				this.grid.requeststore.addListener("load", function(store,
						records) {
					this.errors.clear();
					for (var i = 0; i < records.length; i += 1) {
						this.errors.add(records[i].get("ptrrid"), {
									record : records[i],
									msg : '[#' + records[i].get("prodId")
											+ "]: " + records[i].get("problem")
								});
					}
					this.updateErrorList();
					if (this.errors.getCount() > 0) {
						if (this.statusBar.getText() !== this.showText) {
							this.statusBar.setStatus({
										text : this.showText,
										iconCls : this.errorIconCls
									});
						}
					} else {
						this.statusBar.clearStatus().setIcon(this.validIconCls);
					}
				}, this);
			}
		}, this, {
			single : true
		});
		sb.on({
					scope : this,
					afterlayout : {
						single : true,
						fn : function() {
							// Grab the statusEl after the first layout.
							sb.statusEl.getEl().on('click', this.onStatusClick,
									this, {
										buffer : 200
									});
						}
					},
					beforedestroy : {
						single : true,
						fn : this.onDestroy
					}
				});
	},

	// private
	onDestroy : function() {
		this.stopMonitoring();
		this.statusBar.statusEl.un('click', this.onStatusClick, this);
		this.callParent(arguments);
	},

	// private
	updateErrorList : function() {
		if (this.errors.getCount() > 0) {
			var msg = '<ul>';
			this.errors.each(function(err) {
				// 直接显示处理点击 但是现在没能 直接处理
				msg += ('<li id="x-err-'
						+ err.record.id
						+ '"><a href="#" onclick=\'showDetial(\"prod\").prod(\"'
						+ err.record.get('prodId') + '\",1)\'>' + err.msg + '</a></li>');
			}, this);
			this.getMsgEl().update(msg + '</ul>');
		} else {
			this.getMsgEl().update('');
		}
		// reset msgEl size
		this.getMsgEl().setSize('auto', 'auto');
	},

	// private
	getMsgEl : function() {
		if (!this.msgEl) {
			this.msgEl = Ext.DomHelper.append(Ext.getBody(), {
						cls : this.errorListCls
					}, true);
			this.msgEl.hide();
			this.msgEl.on('click', function(e) {
						var t = e.getTarget('li', 10, true);
						if (t) {
							Ext.getCmp(t.id.split('x-err-')[1]).focus();
							this.hideErrors();
						}
					}, this, {
						stopEvent : true
					}); // prevent anchor click navigation
		}
		return this.msgEl;
	},

	// private
	showErrors : function() {
		this.updateErrorList();
		this.getMsgEl().alignTo(this.statusBar.getEl(), this.listAlign)
				.slideIn('b', {
							duration : 300,
							easing : 'easeOut'
						});
		this.statusBar.setText(this.hideText);
		this.grid.el.on('click', this.hideErrors, this, {
					single : true
				}); // hide if the user clicks directly into the form
	},

	// private
	hideErrors : function() {
		var el = this.getMsgEl();
		if (el.isVisible()) {
			el.slideOut('b', {
						duration : 300,
						easing : 'easeIn'
					});
			this.statusBar.setText(this.showText);
		}
		this.grid.el.un('click', this.hideErrors, this);
	},

	// private
	onStatusClick : function() {
		if (this.getMsgEl().isVisible()) {
			this.hideErrors();
		} else if (this.errors.getCount() > 0) {
			this.showErrors();
		}
	}
});
function getSptstring(item) {
	var sps = "";
	switch (item.paramtype) {
		case 1 :
			if ("1" == item.paramvalue) {
				sps = item.innerstep + item.headdesc;
				if (sps != "" && sps.indexOf(":") == -1) {
					sps += ": ";
				}
				sps += item.footdesc;
				return sps;
			}
			return "";
		case 2 :
			if (item.paramvalue != null && item.paramvalue != "") {
				sps = item.innerstep + item.headdesc;
				if (sps != "" && sps.indexOf(":") == -1) {
					sps += ": ";
				}
				sps += (item.paramvalue + item.footdesc);
				return sps;
			}
			return "";
		case 3 :
			var v = getValueCombo(item.comboList, item.paramvalue);
			if (v != null) {
				sps = item.innerstep + item.headdesc;
				if (sps != "" && sps.indexOf(":") == -1) {
					sps += ": ";
				}
				sps += v.dicname;
				return sps;
			}
			return "";
	}
	return "";
}
function getValueCombo(comboList, value) {
	if (comboList == null) {
		return null;
	}
	for (var c = 0; c < comboList.length; c++) {
		if (value == comboList[c].dicvalue) {
			return comboList[c];
		}
	}
	return null;
}
Ext.define("Pcbms.product.StepComboBox", {
	extend : "Ext.form.ComboBox",
	alias : "widget.stepcombo",
	displayField : 'stepname',
	valueField : 'stepid',
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
					model : "Step",
					proxy : Pcbms.ajaxProxy({
								url : "/stepManagementAction!searchAllStepList.action",
								reader : {
									type : 'json',
									root : 'stepList'
								}
							})
				});
		this.store.addListener("load", function() {
					this.store.insert(0, {
								stepname : '全部',
								stepid : -1
							});
				}, this);
		this.callParent();
	}

});