Ext.require('app.partpos.view_combo');

Ext.define("Pcbms.view.productInPart", {
	extend : "Ext.window.Window",
	alias : "widget.pipwindow",
	width : 300,
	height : 400,
	layout : "anchor",
	modal : true,
	title : '入库详情',
	closeAction : 'hide',
	dataLoad : function(r) {
		var me = this;
		me.down("#bcbh").setValue(r.data["bcbh"]);
		me.down("#projectName").setValue(r.data["projectName"]);
		me.down("#rknum").setValue(r.data["rknum"]);
		me.down("#sjnum").setValue(r.data["sjnum"] || r.data["rknum"]);
		me.down("#note").setValue(r.data["note"]);
		
		me.down("#cwinfo").store.removeAll();

		if (r.data["cwinfo"] && r.data["cwinfo"].length > 0) {
			me.down("#cwinfo").store.insert(0,r.data["cwinfo"]);
		}

		me.record = r;
	},
	bodyPadding : 10,
	initComponent : function() {
		var me = this;
		me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 2
				});
		Ext.applyIf(me, {
			buttons : [{
				text : '确定',
				handler : function() {
					var grid = me.target;
					
					me.record.data["sjnum"] = me.down("#sjnum").getValue();
					me.record.data["note"] = me.down("#note").getValue();
					var cwinfo = [];
					for (var i = 0; i < me.down("#cwinfo").store.data.items.length; i++) {
						var item = me.down("#cwinfo").store.data.items[i];
						cwinfo.push(item.data);
					}
					me.record.data["cwinfo"] = cwinfo;
					me.record.data["inputed"] = true;
					grid.getView().refresh();
					me.close();
				}
			}],
			defaults:{
				xtype : 'textfield',
				anchor : "99%",
				readOnly : true
			},
			items : [{
						itemId : 'bcbh',
						fieldLabel : '工程编号'
					},{
						fieldLabel : "文件名称",
						itemId : 'projectName'
					}, {
						itemId : 'rknum',
						fieldLabel : '入库数量'
					}, {
						xtype : 'numberfield',
						fieldLabel : '实际入库数量',
						emptyText : '默认为入库数量',
						readOnly:false,
						itemId : 'sjnum'
					}, {
						xtype : 'textareafield',
						itemId : 'note',
						readOnly:false,
						fieldLabel : '备注'
					}, {
						xtype : 'gridpanel',
						anchor : "99% -170",
						itemId : 'cwinfo',
						plugins : [me.cellEditing],
						tbar : [{
									text : '仓位安排',
									xtype : 'label'
								}, '->', {
									text : '点击添加',
									handler : function() {
										me.down("#cwinfo").store.insert(0, {
													cwname : '',
													num : '',
													cwid : ''
												});
										me.cellEditing.startEditByPosition({
													row : 0,
													column : 0
												});
									}
								}, {
									text : '点击删除',
									handler : function() {
										var s = me.down("#cwinfo")
												.getSelectionModel()
												.getSelection();
										if (s.length > 0) {
											me.down("#cwinfo").store
													.remove(s[0]);
										}
									}
								}],
						store : Ext.create("Ext.data.ArrayStore", {
									fields : ['cwname', {
												name : 'num',
												type : 'int'
											}, 'cwid']
								}),
						columns : [{
									header : '仓位编号',
									dataIndex : 'cwname',
									editor : {
										xtype : 'partposcombo',
										allowBlank : false
									},
									flex : 1
								}, {
									header : '投放数量',
									dataIndex : 'num',
									editor : {
										xtype : 'numberfield',
										allowBlank : false,
										minValue : 1,
										maxValue : 100000
									}
								}]
					}]
		});

		this.callParent();
	}
});