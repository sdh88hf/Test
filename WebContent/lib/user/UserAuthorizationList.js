// 用户的授权管理 搜索项未 用户组 用户姓名 用户id 用户部门
Ext.define("Pcbms.user.UserAuthorizationList", {
	extend : "Ext.grid.Panel",
	alias : "widget.userauthlist",
	text : "用户授权管理",
	tabConfig : {
		title : "用户授权管理",
		tooltip : "管理用户的权限"
	},
	tbar : [{
		xtype : "buttongroup",
		title : "用户组信息管理",
		columns : 1,
		defaults : {
			scale : "small"
		},
		items : [{
			text : "给选中用户授权",
			iconCls : "usekey",
			handler : function(b) {
				var gp = b.up("gridpanel");
				var s = gp.getSelectionModel().getSelection();
				if (s == null || s.length == 0) {
					Ext.MessageBox.alert("操作错误", "请选择需要修改的用户组");
					return;
				}

				var ggrid = Ext.create('Ext.grid.Panel', {
					width : '100%',
					height : '100%',
					columns : [{
								header : "用户组名称",
								dataIndex : "name"
							}, {
								header : "用户组描述",
								flex : 1,
								dataIndex : "description"
							}, {
								header : "创建人名称",
								dataIndex : "employeeName"
							}, {
								header : "创建时间",
								dataIndex : "createtime",
								renderer : Ext.util.Format
										.dateRenderer("Y-m-d")
							}, {
								xtype : 'booleancolumn',
								dataIndex : 'authed',
								text : '是否已被授权',
								falseText : '否',
								trueText : '是'
							}],
					store : Ext.create("Ext.data.Store", {
						storeId : "userGroupStore",
						model : "UserGroup",
						listeners : {
							load : function(s,r){
								var records = [];
								
								Ext.each(r,function(){
									if(this.data["authed"]==true){
										
										records.push(this);
									}
								});
								ggrid.getSelectionModel().select(records);
								
							}
						},
						proxy : Pcbms.ajaxProxy({
							url : "/userAuthorizationManagementAction!searchUserGroups.action",
							extraParams:{
								userid : s[0].data["userid"]
							}, 
							reader:{
								type : 'json',
								root : 'userGroupList',
								totalProperty : 'count'
							}
						}
								)
					}),
					selModel : Ext.create("Ext.selection.CheckboxModel")

				});

				// 弹出win窗口
				Ext.create('Ext.Window', {
					title : '选择用户组',
					width : 600,
					height : 300,
					plain : true,
					layout : 'fit',
					id : 'groupWin',
					modal : true,
					items : [ggrid],
					buttons : [{
						text : '确定',
						handler : function() {
							var a = ggrid.getSelectionModel().getSelection();
							if (a == null || a.length == 0) {
								Ext.MessageBox.alert("操作错误", "请至少选择一个用户组");
								return;
							}

							// 选中的用户组id集合
							var ugids = [];
							for (var i = 0; i < a.length; i += 1) {
								ugids.push(a[i].get("ugid"));
							}

							var userids = [];
							for (var i = 0; i < s.length; i += 1) {
								userids.push(s[i].get("userid"));
							}

							ggrid.el.mask("正在授权请稍等...");
							Ext.Ajax.trequest({

								url : "/userAuthorizationManagementAction!joinUserGroup.action",
								params : {
									"userids" : userids,
									"ugids" : ugids
								},
								success : function(result) {
									ggrid.up("window").close();
									Ext.Msg.alert("提示", result.msg);
								},
								error : function(result) {
									Ext.Msg.alert('出现错误', '原因 <'
													+ result.msg
													+ ">");

								}			
							});

						}
					}, {
						text : '退出',
						handler : function() {
							this.up('window').close();
						}
					}]
				}).show();

				ggrid.store.load();
			}
		}]
	}, '->', {
		xtype : "buttongroup",
		title : "授权用户查询",
		columns : 4,
		defaults : {
			scale : "small"
		},
		items : [{
					fieldLabel : "用户姓名",
					labelAlign : "right",
					labelWidth : 70,
					xtype : "textfield",
					name : "userInfo.name"
				}, {
					fieldLabel : "用户编号",
					labelAlign : "right",
					labelWidth : 70,
					xtype : "textfield",
					name : "userInfo.userid"
				}, {
					xtype : "combobox",
					fieldLabel : "所属用户组",
					name : "userInfo.ugid",
					allowBlank : false,
					labelWidth : 70,
					labelAlign : "right",
					autoSelect : true,
					forceSelection : true,
					displayField : 'name',
					valueField : 'ugid',
					store : Ext.create("Ext.data.Store", {
						model : "UserGroup",
						proxy : {
							type : 'ajax',
							url : "/userAuthorizationManagementAction!searchUserGroups.action",
							reader : {
								type : 'json',
								root : 'userGroupList'
							}
						}
					})
				}, Pcbms.searchbtn("查询", "authStore", "small")]
	}],
	columns : [{
				header : "用户编号",
				width : 120,
				dataIndex : "userid"
			}, {
				header : "用户姓名",
				flex : 1,
				dataIndex : "name"
			}, {
				header : "用户类型",
				width : 120,
				dataIndex : "type"
			}, {
				header : "所属部门",
				width : 120,
				dataIndex : "departname"
			}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			storeId : "authStore",
			model : "Authorization",
			proxy : Pcbms.ajaxProxy("/userAuthorizationManagementAction!searchUsers.action")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "暂无授权用户信息"
				});
		this.selModel = Ext.create("Ext.selection.CheckboxModel");
		this.callParent();

		this.store.load();
	}
});
// 定义编辑窗口
