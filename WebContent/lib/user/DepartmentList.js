// 部门信息管理 使用tree grid 来操作数据
Ext
		.define(
				"Pcbms.user.DepartmentList",
				{
					extend : "Ext.tree.Panel",
					alias : "widget.departmentlist",
					text : "部门信息列表",
					tabConfig : {
						title : "部门信息列表",
						tooltip : "部门信息列表"
					},
					useArrows : true,
					rootVisible : false,
					initComponent : function() {
						this.store = datastore.createDepartmentTreeStore();
						this.callParent();
					},
					tbar : [
							{
								text : "编辑部门信息",
								iconCls: "dooredit",
								handler : function(b) {
									var records = b.ownerCt.ownerCt.getView()
											.getChecked();
									if (records.length == 0 || records.length > 1) {
										Ext.MessageBox.alert("操作错误",
												"请先选择一个需要编辑的部门!");
										return;
									}
									Ext
											.getCmp("mainpanel")
											.loadControl(
													{
														xtype : "departmenteditform",
														record : records[0],
														id : "departmenteditform"
																+ records[0].data.departid,
														text : "部门["
																+ records[0].data.name
																+ "]信息修改"
													});
								}
							},
							{
								text : "删除部门信息",
								iconCls: "delete",
								handler : function(b) {
									var records = b.ownerCt.ownerCt.getView()
											.getChecked();
									if (records.length == 0 || records.length > 1) {
										Ext.MessageBox.alert("操作错误",
												"请先选择一个需要删除的部门!");
										return;
									}
									Ext.MessageBox
											.confirm(
													"确认操作",
													"确认将选中的部门删除?",
													function(b) {
														if (b == "yes") {
															var tp = this.ownerCt.ownerCt;
															tp.el
																	.mask(
																			"数据删除中请稍后....",
																			Ext.baseCSSPrefix
																					+ "mask-loading");
															Ext.Ajax
																	.request({
																		url : "/departmentManagementAction!deleteDepartment.action",
																		params : {
																			"departmentInfo.departid" : records[0].data.departid
																		},
																		success : new Pcbms.ajaxHandler(
																				{
																					success : function(
																							result) {
																						tp.el
																								.unmask();
																						datastore
																								.loadDepartmentData();
																					},
																					error : function(
																							result) {
																						tp.el
																								.unmask();
																						Ext.Msg
																								.alert(
																										'出现错误',
																										'原因 <'
																												+ result.msg
																												+ ">");

																					}
																				})

																	});
														}
													}, b);
								}
							} ],
					columns : [
							{
								xtype : 'treecolumn',
								text : '部门名称',
								flex : 1,
								sortable : true,
								dataIndex : 'name'
							},
							{
								text : '部门编号',
								width : 100,
								sortable : true,
								dataIndex : 'departid'
							},
							{
								text : '联系电话',
								width : 200,
								sortable : true,
								dataIndex : 'telephone'
							},
							{
								text : '传真号码',
								width : 200,
								sortable : true,
								dataIndex : 'faxno'
							},
							{
								text : '部门经理',
								width : 100,
								sortable : true,
								dataIndex : 'managername'
							},
							{
								xtype : 'templatecolumn',
								text : '部门级别',
								width : 100,
								sortable : true,
								dataIndex : 'departlevel',
								tpl : Ext.create('Ext.XTemplate',
										'{departlevel:this.formatLevel}', {
											formatLevel : function(v) {
												if (v == 0) {
													return '公司';
												} else {
													return v + ' 级部门';
												}
											}
										})
							}, {

								text : '部门介绍',
								flex : 2,
								sortable : true,
								dataIndex : 'note'
							} ]
				});
Ext.define("Pcbms.user.DepartmentAddForm", {
	extend : "Ext.form.Panel",
	alias : "widget.departmentaddform",
	text : "添加新部门信息",
	tabConfig : {
		title : "添加新部门信息",
		tooltip : "部门信息添加"
	},
	layout : "auto",
	bodyPadding : 10,
	defaults : {
		width : 300
	},
	defaultType : "textfield",
	items : [ {
		fieldLabel : "部门名称",
		name : "departmentInfo.name",
		minLength : 2,
		maxLength : 12,
		allowBlank : false
	}, {
		fieldLabel : "部门座机",
		name : "departmentInfo.telephone",
		maxLength : 18
	}, {
		fieldLabel : "部门传真",
		name : "departmentInfo.faxno",
		minLength : 8,
		maxLength : 18
	}, {
		xtype : "departselection",
		fieldLabel : "所属部门",
		name : "departmentInfo.parentid",
		allowBlank : false
	}, {
		xtype : "textarea",
		fieldLabel : "部门介绍",
		name : "departmentInfo.note",
		maxLength : 300
	},{
				xtype : 'container',
				width : 300,
				layout : {
					pack : 'center',
					type : 'hbox'
				},
				items : [{
							xtype : 'button',
							text : "\u91cd\u7f6e",
							iconCls : "tablerefresh",
							margin : '0 10',
							handler : function() {
								this.up("form").getForm().reset();
							}
						}, {
							xtype : 'button',
							text : "确认添加部门",
		iconCls: "accept",
		handler : function() {
			var form = this.up("form").getForm();
			form.submit({
				clientValidation : true,
				includeEmptyText : false,
				url : "/departmentManagementAction!addDepartment.action",
				success : function(form, action) {
					form.reset();
					datastore.loadDepartmentData();
					Ext.Msg.alert("添加成功", action.result.msg);
				},
				failure : Pcbms.formHandler
			});
		}

						}]
			} ]
});
Ext
		.define(
				"Pcbms.user.DepartmentEditForm",
				{
					extend : "Ext.form.Panel",
					alias : "widget.departmenteditform",
					tabConfig : {
						title : "修改部门信息",
						tooltip : "部门信息修改"
					},
					layout : "auto",
					bodyPadding : 10,
					defaults : {
						width : 300
					},
					initComponent : function() {
						this.items = [
								{
									xtype : "textfield",
									fieldLabel : "部门编号",
									name : "departmentInfo.departid",
									value : this.record.data.departid,
									readOnly : true
								},
								{
									xtype : "textfield",
									fieldLabel : "部门名称",
									name : "departmentInfo.name",
									value : this.record.data.name,
									minLength : 2,
									maxLength : 12,
									allowBlank : false
								},
								{
									xtype : "combobox",
									displayField : 'name',
									valueField : 'userid',
									store : Ext
											.create(
													"Ext.data.Store",
													{
														model : "Account",
														proxy : Pcbms.ajaxProxy({
															url : "/employeeManagementAction!searchEmployee.action",
															extraParams:{
																'employeeInfo.departid' : this.record.data.departid,
																'employeeInfo.status' : 1,
																pagesize : 99999
															}})
													}),
									fieldLabel : "部门主管",
									forceSelection : true,
									name : "departmentInfo.managerid",
									value : this.record.data.managerid,
									allowBlank : false
								}, {
									fieldLabel : "部门座机",
									name : "departmentInfo.telephone",
									value : this.record.data.telephone,
									maxLength : 18
								}, {
									fieldLabel : "部门传真",
									name : "departmentInfo.faxno",
									value : this.record.data.faxno,
									minLength : 8,
									maxLength : 18
								}, {
									xtype : "departselection",
									fieldLabel : "所属部门",
									name : "departmentInfo.parentid",
									value : this.record.data.parentid,
									readOnly : true
								}, {
									xtype : "textarea",
									fieldLabel : "部门介绍",
									value : this.record.data.note,
									name : "departmentInfo.note",
									maxLength : 300
								},{
				xtype : 'container',
				width : 300,
				layout : {
					pack : 'center',
					type : 'hbox'
				},
				items : [{
							xtype : 'button',
							text : "\u91cd\u7f6e",
							iconCls : "tablerefresh",
							margin : '0 10',
							handler : function() {
								this.up("form").getForm().reset();
							}
						}, {
							xtype : 'button',
								text : "\u786e\u8ba4\u4fee\u6539",
								iconCls:"accept",
								handler : function() {
									var form = this.up("form").getForm();
									form
											.submit({
												clientValidation : true,
												includeEmptyText : false,
												url : "/departmentManagementAction!updateDepartment.action",
												success : function(form, action) {
													datastore
															.loadDepartmentData();
													Ext.Msg.alert("更新成功",
															"部门信息更新成功!");
												},
												failure : Pcbms.formHandler
											});
								}
							}]
			} ];
						this.callParent();
					},
					defaultType : "textfield"
				});