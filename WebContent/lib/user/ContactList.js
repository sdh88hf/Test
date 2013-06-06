Ext.define("Pcbms.user.ContactList", {
	extend : "Ext.grid.Panel",
	alias : "widget.contactlist",
	text : "联系人信息查询",
	tabConfig : {
		title : "联系人信息查询",
		tooltip : "联系人信息查询"
	},
	selType : 'rowmodel',
	iconCls : "contactlist",
	layout : "fit",
	tbar : [ '->', {
		xtype : "textfield",
		name : "employeeInfo.name",
		emptyText : "输入需要查询联系人姓名",
		allowBlank : false
	}, Pcbms.searchbtn("查询联系人", "contactStore", "small") ],
	columns : [ {
		header : '联系人姓名',
		dataIndex : 'name'
	}, {
		header : 'Email',
		dataIndex : 'email',
		flex : 1
	}, {
		header : '手机号码',
		dataIndex : 'mobile'
	}, {
		header : '座机号码',
		dataIndex : 'telephone'
	}, {
		header : 'QQ',
		dataIndex : 'qq'
	}, {
		header : '所在部门',
		dataIndex : 'departid',
		renderer : function(value) {
			var node = datastore.getDepartmentNode(value);
			if (node) {
				return node.text;
			}
		}
	}, {
		header : '职称',
		dataIndex : 'title'
	}, {
		header : '职位',
		dataIndex : 'position'
	} ],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			storeId : "contactStore",
			model : "Account",
			proxy : Pcbms.ajaxProxy("/employeeManagementAction!searchContactEmployee.action")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
			store : this.store,
			displayInfo : true,
			beforePageText : "\u5f53\u524d\u9875",
			afterPageText : "\u603b {0} \u9875",
			displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
			emptyMsg : "未查询到符合的联系人信息"
		});
		this.callParent();
	}
});