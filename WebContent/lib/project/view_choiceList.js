Ext.require("app.projectfile.view_searchList");
Ext.require("app.projectfile.model");
Ext.define("Pcbms.view.choiceProjectFile", {
	extend : "Ext.grid.Panel",
	alias : "widget.ptChoice",
	statusData : [ [ 1, "初始化" ], [ 2, "生效" ] ],
	initComponent : function() {
		var storeid = "ptChoiceStore";
		var me = this;

		me.store = Ext.create("Ext.data.Store", {
			model : "ProjectFile",
			// autoLoad : true,
			storeId : storeid,
			proxy : Pcbms.ajaxProxy(
					"/projectFileAction!searchProjectFileList.action")
		});

		Ext.applyIf(me, {
			columns : [ {
				header : "客户编号",
				width : 80,
				flex : 1,
				dataIndex : "clientid"
			}, {
				header : "工程编号",
				flex : 1,
				renderer : showDetial('pt').renderer,
				dataIndex : "bcbh"
			}, {
				header : "文件名称",
				width : 80,
				flex : 1,
				dataIndex : "projectName"
			}, {
				header : "处理人",
				width : 80,
				flex : 1,
				dataIndex : "operatorname"
			}, {
				header : "状态",
				width : 100,
				flex : 1,
				dataIndex : "status",
				renderer : function(v) {
					for ( var i = 0; i < this.statusData.length; i++) {

						if (v == this.statusData[i][0]) {
							return this.statusData[i][1];
						}
					}

					return "异常状态";
				}
			}, {
				header : "PCS尺寸(mm)",
				width : 120,
				flex : 1,
				renderer : function(v, m, r) {
					return r.data["pcsx"] + "X" + r.data["pcsy"];
				}
			}, {
				header : "SET尺寸(mm)",
				width : 80,
				flex : 1,
				renderer : function(v, m, r) {
					return r.data["setx"] + "X" + r.data["sety"];
				}
			} ],

			tbar : [ "->", {
				xtype : "searchbg",
				title : "查询",
				columns : 3,
				defaults : {
					scale : "larger"
				},
				items : [ {
					xtype : "textfield",
					fieldLabel : "工程编号",
					labelAlign : "right",
					labelWidth : 60,
					name : "projectFile.bcbh"
				}, {
					xtype : 'textfield',
					fieldLabel : '客户编号',
					labelWidth : 60,
					value : me.clientid,
					labelAlign : "right",
					itemId : 'clientid',
					name : 'projectFile.clientid',
					flex : 1,
					readOnly : true
				}, Pcbms.searchbtn("查询", storeid, 'small'), {
					xtype : "textfield",
					fieldLabel : "文件名称",
					labelAlign : "right",
					labelWidth : 60,
					name : "projectFile.projectName"
				}, {
					xtype : "combobox",
					store : this.statusData,
					fieldLabel : "状态",
					itemId : 'status',
					labelAlign : "right",
					labelWidth : 60,
					value : 1,
					name : "projectFile.status"
				} ]
			} ],
			bbar : Ext.create("Ext.PagingToolbar", {
				store : this.store,
				itemId : 'pagebar',
				displayInfo : true,
				beforePageText : "当前页",
				afterPageText : "总 {0} 页",
				displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
				emptyMsg : " 暂无信息"
			}),
			selModel : Ext.create("Ext.selection.CheckboxModel")

		});

		this.callParent();
	}
});