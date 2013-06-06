Ext.define('Pcbms.product.UpdMaterialTicket', {
	extend : 'Ext.form.Panel',
	alias : "widget.mtupd",
	layout : 'border',
	border:false,
	bodyPadding : 5,
	tbar :[{
		text:'删除',
		handler:function(){
			
		}
	},{
		text:'确认投料',handler:function(){
			
		}
	}],
	loadData : function(r) {
		var me = this;
		Ext.each(me.getForm().getFields().items, function(i) {
					if (i.getName() && i.getName().indexOf("mtTicket") >= 0) {
						var name = i.getName().replace("mtTicket.", "");
						if (r[name]) {
							i.setValue(r[name]);
						}
					}
					if (i.getName()
							&& i.getName().indexOf("materialTicket") >= 0) {
						var name = i.getName().replace("materialTicket.", "");
						if (r[name]) {
							i.setValue(r[name]);
						}
					}
				});
		if(typeof layoutViewApplet == 'undefined' || layoutViewApplet == null || !layoutViewApplet.hasOwnProperty("appendLayoutJSONResult")){
			Ext.Msg.alert("运行错误","请先启用Applet用以查看开料图!");
			return;
		}
		layoutViewApplet.setAWorkboard(r.awbid, r.agzbccx, r.agzbccy ,r.anum);
		layoutViewApplet.setBWorkboard(r.bwbid, r.bgzbccx, r.bgzbccy ,r.bnum);
		layoutViewApplet.setCWorkboard(r.cwbid, r.cgzbccx, r.cgzbccy ,r.cnum);
		for(var i=0;i<r.mttitems.length;i+=1){
			layoutViewApplet.appendLayoutJSONResult(r.mttitems[i].klt, r.mttitems[i].ylccx, r.mttitems[i].ylccy, r.mttitems[i].ylnum);
		}
		layoutViewApplet.setModel(0);
	},
	submitForm : function() {
		var me = this;

		me.getForm().submit({

			url : 'materialTicketAction!updateMaterialTicket.action?materialTicket.mid='
					+ me.mid,
			success : function(form, action) {
				Ext.Msg.alert("提示", action.result.msg);
				me.getForm().reset();
				me.target.updWindow.close();
				me.target.updForm().store.load();
			},
			failure : Pcbms.formHandler

		});
	},
	initComponent : function() {
		var me = this;
		var attributes = {
				id : 'layoutViewApplet',
				codebase : "/applet",
				code : 'com.toiao.utils.layout.applet.TPMSApplet.class',
				archive : 'batik.jar,commons.jar,jasperreports-4.1.3.jar,jna.jar,xml-apis.jar,tpmsprinter.jar',
				width : 640,
				height : 450
		};
		me.appletId = attributes.id;
		var parameters = {
			fontSize : 16
		};
		var version = '1.6';
		Ext.applyIf(me, {
					items : [{
						xtype : 'fieldset',
						width : 270,
						margin : '0 5 0 0',
						region: 'west',
						title : '投料信息',
						anchor :'100% 100%',
						defaults : {
							anchor: '100%',
							allowBlank : false,
							readOnly : true,
							labelWidth : 90
						},
						items : [{
							xtype : 'pubcombo',
							fieldLabel : '板材材料',
							name : 'mtTicket.bccl',
							type : 5
						}, {
							xtype : 'pubcombo',
							fieldLabel : '板厚',
							name : 'mtTicket.bh',
							type : 6
						}, {
							xtype : 'pubcombo',
							fieldLabel : '板材供应商',
							name : 'mtTicket.bcgys',
							type : 3
						}, {
							xtype : 'pubcombo',
							fieldLabel : '板材型号',
							name : 'mtTicket.bcxh',
							type : 14
						}, {
							xtype : 'numberfield',
							fieldLabel : '原料数量',
							name : 'mtTicket.tlnum'
						}, {
							xtype : 'numberfield',
							fieldLabel : '开料利用率(%)',
							name : 'mtTicket.kllyl'
						}, {
							xtype : 'numberfield',
							fieldLabel : '交货利用率(%)',
							name : 'mtTicket.jhlyl'
						}, {
							xtype : 'numberfield',
							fieldLabel : '总投料面积',
							name : 'materialTicket.ztlmj'
						}, {
							xtype : 'numberfield',
							fieldLabel : '余料面积',
							name : 'materialTicket.ylmj'
						},{
							xtype:'textarea',
							fieldLabel : '开料备注',
							labelAlign:'top',
							anchor: '100% -270',
							allowBlank: true,
							name : 'materialTicket.note'
						}]
					}, {
						xtype : 'fieldset',
						region : 'center',
						title : '开料信息',
						html : deployJava.getAppletTagHtml(attributes, parameters, version)
					}]
				});

		me.callParent(arguments);
		
		me.getForm().isValid();
	}

});