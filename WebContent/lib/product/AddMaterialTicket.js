Ext.define('Pcbms.product.WorkboardSelectCombo',{
	extend:'Ext.form.ComboBox',
	displayField: 'wbid',
	typeAhead: false,
	alias : 'widget.wbscombo', 
	listConfig: {
        loadingText: '查询中...',
        emptyText: '未找到匹配的内容.',
        getInnerTpl: function() {
            return "编号: {wbid} <span style='color:green'>{gzkyxj}</span>  <br/>数量: <span style='color:red'>{wklnum}</span>, {bh}, {bcgys}, {bccl}";
        }
    },
    reset : function(){
    	//重新刷新数据库
    	this.callParent();
    	this.store.removeAll();
    	this.store.load();
    },
	initComponent : function() {
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
			model : "WorkBoard",
			proxy : Pcbms.ajaxProxy("/workBoardManagementAction!searchWorkBoards.action?workBoardInfo.wklnum=1&workBoardInfo.status=6")
		});
		this.callParent();
	},
	listeners:{
		change: function(combo,nv,ov){
			var r = combo.findRecordByValue(nv);
			var fieldset = combo.up("fieldset");
			if(r != false){
				var form = combo.up("form").getForm();
				form.findField("materialTicket.bccl").setValue(r.get("bccl"));
				form.findField("materialTicket.bcgys").setValue(r.get("bcgys"));
				form.findField("materialTicket.bh").setValue(r.get("bh"));
				fieldset.down("#x").setValue(r.get("gzbccx"));
				fieldset.down("#y").setValue(r.get("gzbccy"));
				fieldset.down("#num").setValue(r.get("wklnum"));
			}else{
				fieldset.down("#x").setValue("");
				fieldset.down("#y").setValue("");
				fieldset.down("#num").setValue("");
			}
			//TODO 过滤其他的数据库 暂时性不做处理 
		}
	}
});
Ext.define('Pcbms.product.AddMaterialTicket', {
	extend : 'Ext.form.Panel',
	alias : "widget.mtadd",
	layout : 'border',
	bodyPadding : 5,
	title : '创建开料单',
	loadData : function(r) {
		var me = this;
		Ext.each(me.getForm().getFields().items, function(i) {
					if (i.getName() && i.getName().indexOf("materialTicket") >= 0) {
						var name = i.getName().replace("materialTicket.", "");
						i.setReadOnly(true);
						if (r[name]) {
							i.setValue(r[name]);
						}
					}
				});
	},
	buttons:[{
		text:'确认添加',
		handler:function(b){
			var params = {'materialTicket.mttjson':layoutApplet.getLayoutJSONResult()};
			if(params['materialTicket.mttjson'] == null){
				alert("请先完成开料图，让后提交开料单!");
				return;
			}
			var fp = b.up("form");
			if(window.confirm("确认添加当前的开料图?")){
				fp.getForm().submit({
					url : 'materialTicketAction!addMaterialTicket.action',
					params : params,
					success : function(form, action) {
						alert(action.result.msg);
						form.reset();
					},
					failure : function(form, action) {
						switch (action.failureType) {
						case Ext.form.action.Action.CLIENT_INVALID :
							alert('你提交的表单中含有错误!请校正后提交!');
							break;
						case Ext.form.action.Action.CONNECT_FAILURE :
							alert('与服务器间的通信出现问题!请稍后再试!');
							break;
						case Ext.form.action.Action.SERVER_INVALID :
							alert( action.result.msg);
					}
				}
				});
			}
		}
	}],
	initComponent : function() {
		var me = this;
		var attributes = {
				id : 'layoutApplet',
				codebase : "/applet",
				code : 'com.toiao.utils.layout.applet.TPMSApplet.class',
				archive : 'batik.jar,commons.jar,jasperreports-4.1.3.jar,jna.jar,xml-apis.jar,tpmsprinter.jar',
				width : 700,
				height : 500
		};
		var parameters = {
			fontSize : 16
		};
		var version = '1.6';
		Ext.applyIf(me, {
			items : [{
						xtype : 'container',
						region:'west',
						width: 260,
						layout : 'anchor',
						defaults:{'anchor':'99%'},
						items : [{
									xtype : 'fieldset',
									title : 'A板信息',defaults:{
										labelWidth:70},
									items : [{
												xtype : 'wbscombo',
												fieldLabel : '编号',
												name : 'materialTicket.awbid',
												anchor : '100%'
											}, {
												xtype : 'fieldcontainer',
												layout : {
													type : 'hbox'
												},
												fieldLabel : '尺寸(mm)',
												items : [{
															xtype : 'numberfield',
															fieldLabel : '',
															name : 'materialTicket.agzbccx',
															readOnly : true,
															itemId : 'x',
															flex : 1
														}, {
															xtype : 'displayfield',
															value : 'X',
															fieldLabel : ''
														}, {
															xtype : 'numberfield',
															fieldLabel : '',
															name : 'materialTicket.agzbccy',
															readOnly : true,
															itemId : 'y',
															flex : 1
														}]
											}, {
												xtype : 'numberfield',
												fieldLabel : '投料数量',
												anchor : '100%',
												allowBlank : false,
												itemId : 'num',
												name : 'materialTicket.anum',
												listeners:{
													change:function(f,nv,ov){
														var wbid = f.up("fieldset").down("wbscombo").getValue();
														var wbx = f.up("fieldset").down("#x").getValue();
														var wby = f.up("fieldset").down("#y").getValue();
														if(wbid != null){
															layoutApplet.setAWorkboard(wbid,wbx,wby,nv);
														}else{
															layoutApplet.clearAWorkboard();
														}
													}
												}
											}]
								}, {
									xtype : 'fieldset',
									title : 'B板信息',defaults:{
										labelWidth:70},
									items : [{
												xtype : 'wbscombo',
												fieldLabel : '编号',
												name : 'materialTicket.bwbid',
												anchor : '100%'
											}, {
												xtype : 'fieldcontainer',
												layout : {
													type : 'hbox'
												},
												fieldLabel : '尺寸(mm)',
												items : [{
															xtype : 'numberfield',
															readOnly : true,
															fieldLabel : '',
															itemId : 'x',
															name : 'materialTicket.bgzbccx',
															flex : 1
														}, {
															xtype : 'displayfield',
															value : 'X',
															fieldLabel : ''
														}, {
															xtype : 'numberfield',
															readOnly : true,
															fieldLabel : '',
															name : 'materialTicket.bgzbccy',
															itemId : 'y',
															flex : 1
														}]
											}, {
												xtype : 'numberfield',
												fieldLabel : '投料数量',
												anchor : '100%',
												itemId : 'num',
												name : 'materialTicket.bnum',
												listeners:{
													change:function(f,nv,ov){
														var wbid = f.up("fieldset").down("wbscombo").getValue();
														var wbx = f.up("fieldset").down("#x").getValue();
														var wby = f.up("fieldset").down("#y").getValue();
														if(wbid != null){
															layoutApplet.setBWorkboard(wbid,wbx,wby,nv);
														}else{
															layoutApplet.clearBWorkboard();
														}
													}
												}
											}]
								}, {
									xtype : 'fieldset',
									title : 'C板信息',
									defaults:{
										labelWidth:70},
									items : [{
												xtype : 'wbscombo',
												fieldLabel : '编号',
												name : 'materialTicket.cwbid',
												anchor : '100%'
											}, {
												xtype : 'fieldcontainer',
												layout : {
													type : 'hbox'
												},
												fieldLabel : '尺寸(mm)',
												items : [{
															xtype : 'numberfield',
															readOnly : true,
															fieldLabel : '',
															itemId : 'x',
															name : 'materialTicket.cgzbccx',
															flex : 1
														}, {
															xtype : 'displayfield',
															value : 'X',
															fieldLabel : ''
														}, {
															xtype : 'numberfield',
															readOnly : true,
															fieldLabel : '',
															itemId : 'y',
															name : 'materialTicket.cgzbccy',
															flex : 1
														}]
											}, {
												xtype : 'numberfield',
												fieldLabel : '投料数量',
												anchor : '100%',
												itemId : 'num',
												name : 'materialTicket.cnum',
												listeners:{
													change:function(f,nv,ov){
														var wbid = f.up("fieldset").down("wbscombo").getValue();
														var wbx = f.up("fieldset").down("#x").getValue();
														var wby = f.up("fieldset").down("#y").getValue();
														if(wbid != null){
															layoutApplet.setCWorkboard(wbid,wbx,wby,nv);
														}else{
															layoutApplet.clearCWorkboard();
														}
													}
												}
											}]
								},{
									xtype : 'fieldset',
									anchor:'99% -340',
									defaults : {
										margin : '0 5 5 0',
										allowBlank : false,
										anchor : '100%',
										labelWidth:70
									},
									layout : 'anchor',
									title : '投料信息',
									items : [{
										xtype : 'pubcombo',
										fieldLabel : '板材材料',
										name : 'materialTicket.bccl',
										type : 5
									}, {
										xtype : 'pubcombo',
										fieldLabel : '板厚',
										name : 'materialTicket.bh',
										type : 6
									}, {
										xtype : 'pubcombo',
										fieldLabel : '板材供应商',
										name : 'materialTicket.bcgys',
										type : 3
									}, {
										xtype : 'pubcombo',
										fieldLabel : '板材型号',
										name : 'materialTicket.bcxh',
										type : 14
									}, {
										xtype : 'textareafield',
										allowBlank:true,
										labelAlign:'top',
										fieldLabel : '备注',
										name : 'materialTicket.note',
										anchor:'100% -140'
									}]
								}]
					}, {
						xtype : 'fieldset',
						region: 'center',
						layout : 'fit',
						title : '开料信息',
						html : deployJava.getAppletTagHtml(attributes, parameters, version)
					}]
		});
		me.callParent(arguments);
		me.getForm().isValid();
	}
});