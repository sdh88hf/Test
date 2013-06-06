// 填写制作参数
function uwp(i) {
	Ext.getCmp("updwbid").showParamWindow(i);
}
/**
 * 历史拼板文件信息
 */
Ext.define("Pcbms.product.SearchWorkBoardList", {
			extend : "Pcbms.CommonGridPanel",
			alias : "widget.wbgrid",
			statusData : [[-1, "全部数据"], [0, "存档"], [1, "待审核"], [2, "已审核"],[3, "退回状态"]],
			model : "WorkBoard",
			url : "/workBoardAction!listWorkboard.action",
			initComponent : function() {
				var me = this;
				var columns = [{
							header : "工作板编号",
							width : 80,
							dataIndex : "wbId"
						}, {
							header : "创建时间",
							width : 120,
							renderer : Ext.util.Format.dateRenderer("Y-m-d H:i"),
							dataIndex : "createDate"
						}, {
							header : "工作板尺寸(mm)",
							flex : 1,
							renderer : Pcbms.WorkBoardSizeRenderer
						}, {
							header : "铜厚信息",
							width : 70,
							dataIndex : 'wcth'
						}, {
							header : "层数",
							width : 80,
							dataIndex : 'cs'
						}, {
							header : "处理人",
							width : 70,
							dataIndex : 'creator'
						}, {
							header : "状态",
							width : 100,
							dataIndex : 'status',
							renderer : function(v) {
								for (var i in me.statusData) {
									if (v == me.statusData[i][0]) {
										return me.statusData[i][1];
									}
								}
								return "未知的状态";
							}
						}, {
							header : '备注信息',
							flex : 1,
							dataIndex : "note"
						}];
				var searchs = [{
							xtype : 'textfield',
							fieldLabel : '请输入关键词',
							labelWidth : 95,
							width : 300,
							name : 'wbplan.wbId'
						}, {
							xtype : "combobox",
							store : this.statusData,
							fieldLabel : "状态",
							labelWidth : 60,
							value : -1,
							name : "wbplan.status"
						}, "n", {
							xtype : "daterangefield",
							fieldLabel : "处理日期",
							labelAlign : "right",
							labelWidth : 60,
							width : 370,
							tshow : true,
							startname : 'start',
							endname : 'end'
						}, {
							xtype : 'empcombo',
							fieldLabel : '处理人',
							name : 'wbplan.creator',
							cn : 'lockedperson',
							labelWidth : 60
						}]
				var downloadAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '拼板文件下载',
					iconCls : 'projectfile',
					handler : function() {
						var r = me.sel.getSelection()[0];
						//
					},
					sf : function(selections) {
						return selections.length != 1;
					}
				});
				me.items = me.genItems(columns, searchs, [downloadAction]);
				this.callParent(arguments);
			}
		});