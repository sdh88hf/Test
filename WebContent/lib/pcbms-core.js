Ext.Loader.setConfig({
			enabled : true
		});
Ext.Loader.setPath('Ext.ux', '/lib/extjs/ux');
Ext.Loader.setPath('Pcbms', '/lib');

document.onkeydown = check;
function check(e) {
	var code;
	if (!e)
		var e = window.event;
	if (e.keyCode)
		code = e.keyCode;
	else if (e.which)
		code = e.which;
	if (((event.keyCode == 8) && // BackSpace
	((event.srcElement.type != "text" && event.srcElement.type != "textarea" && event.srcElement.type != "password") || event.srcElement.readOnly == true))
			|| ((event.ctrlKey) && ((event.keyCode == 78) || (event.keyCode == 82)))
			|| // CtrlN,CtrlR
			(event.keyCode == 116)) { // F5
		event.keyCode = 0;
		event.returnValue = false;
	}
	return true;
}
/**
 * 几个比较重要的点本地资源信息，所有的button和menu都是由id来决定是否可以显示的
 * 任何的panel组件在onrender的时候会检查用户所具有的权限和panel的 所有的数据库都使用store manager来管理
 * 个人信息显示，首先是通知信息，然后我的个人的基本信息，然后是个人的权限信息然后是对话框
 */
function Clock(config) {
	this.second = 0;
	this.minute = 0;
	this.hour = 0;
	this.day = 0;
	this.elapse = function() {
		this.second += 1;
		if (this.second == 60) {
			this.second = 0;
			this.minutetriggle();
			this.minute += 1;
			if (this.minute == 60) {
				this.minute = 0;
				this.hour += 1;
				if (this.hour == 24) {
					this.day += 1;
				}
			}
		}
	};
	this.toString = function() {
		var s = "";
		if (this.day > 0) {
			s += this.day + "\u5929";
		}
		if (this.hour > 0) {
			s += this.hour + "\u65f6";
		}
		if (this.minute > 0) {
			s += this.minute + "\u5206";
		}
		if (this.second > 0) {
			s += this.second + "\u79d2";
		}
		return s;
	};
	this.minutetriggle = function() {
	};
}
var clock = new Clock();
function showElapsed() {
	clock.elapse();
	Ext.fly("showElapsed").update(Ext.isEmpty(myself.name)
			? myself.userid
			: myself.name + " \u5df2\u767b\u5f55:" + clock.toString());
	setTimeout("showElapsed()", 1000);
}
/**
 * 打印接口使用javascript 方法名 typrint
 * 
 * @param 需传入的打印数据的ID,可以是
 *            Array 可以是单个数据
 * @param 待打印的数据类型,
 *            这个需要事先做好映射 String
 * @param 打印份数
 *            String
 * @param 打印完成后需要调用的方法,接受参数为
 *            bool[true,false]
 */
function TpmsPrinter() {
	// 首先是需要部署applet
	this.print = function() {
		alert("你的登录时没有启用插件!请重新登陆!");
	};
	if (typeof deployJava == "undefined") {
		return;
	}
	this.imageurlpath = "/printimages.action";
	this.printdataurl = "/printServiceAction.action";
	// 打印机的配置信息
	this.dpi = 203;
	this.speed = '3';
	this.codebase = "http://" + window.location.host + "/applet";
	var attributes = {
		id : 'printerApplet',
		codebase : this.codebase,
		code : 'com.toiao.utils.printer.applet.TPMSApplet.class',
		archive : 'batik.jar,commons.jar,jasperreports-4.1.3.jar,jna.jar,xml-apis.jar,tpmsprinter.jar',
		width : 0,
		height : 0
	};
	var parameters = {
		fontSize : 16
	};
	var version = '1.6';
	deployJava.runApplet(attributes, parameters, version);
	// 打印的份数
	this.print = function(type, params, callback) {
		// 确认打印数据
		var queryString = Ext.Object.toQueryString(params);
		var url = this.printdataurl + "?type=" + type + "&" + queryString;
		var r = printerApplet.showPrintDialog(url);
		if (Ext.isFunction(callback)) {
			callback.call(this, r);
		}
	};
}
var tpmsprinter = new TpmsPrinter();

/**
 * 几个比较重要的点本地资源信息，所有的button和menu都是由id来决定是否可以显示的
 * 任何的panel组件在onrender的时候会检查用户所具有的权限和panel的 所有的数据库都使用store manager来管理
 * 个人信息显示，首先是通知信息，然后我的个人的基本信息，然后是个人的权限信息然后是对话框
 */
Ext.apply(Ext.Ajax, {
	trequest : function(options) {
		options = options || {};
		Ext.applyIf(options, {
					failure : function(data) {
						Ext.Msg.alert("\u51fa\u73b0\u9519\u8bef",
								"\u539f\u56e0:" + data.msg);
					},
					serverfailure : function(response) {
						Ext.Msg.alert("\u540e\u53f0\u9519\u8bef",
								"\u540e\u53f0\u54cd\u5e94:" + response.status);
					},
					params : {}
				});
		var params = options.params;
		for (var key in params) {
			if (typeof params[key] == 'object') {
				params[key] = Ext.encode(params[key]);
			}
		}
		var me = this, scope = options.scope || window, username = options.username
				|| me.username, password = options.password || me.password
				|| "", async, requestOptions, request, headers, xhr;
		if (me.fireEvent("beforerequest", me, options) !== false) {
			requestOptions = me.setOptions(options, scope);
			if (me.isFormUpload(options)) {
				me.upload(options.form, requestOptions.url,
						requestOptions.data, options);
				return null;
			}
			// if autoabort is set, cancel the current transactions
			if (options.autoAbort || me.autoAbort) {
				me.abort();
			}
			// create a connection object

			if ((options.cors === true || me.cors === true) && Ext.isIE
					&& Ext.ieVersion >= 8) {
				xhr = new XDomainRequest();
			} else {
				xhr = this.getXhrInstance();
			}

			async = options.async !== false
					? (options.async || me.async)
					: false;

			// open the request
			if (username) {
				xhr.open(requestOptions.method, requestOptions.url, async,
						username, password);
			} else {
				xhr.open(requestOptions.method, requestOptions.url, async);
			}

			if (options.withCredentials === true || me.withCredentials === true) {
				xhr.withCredentials = true;
			}

			headers = me.setupHeaders(xhr, options, requestOptions.data,
					requestOptions.params);

			// create the transaction object
			request = {
				id : ++Ext.data.Connection.requestId,
				xhr : xhr,
				headers : headers,
				options : options,
				async : async,
				timeout : setTimeout(function() {
							request.timedout = true;
							me.abort(request);
						}, options.timeout || me.timeout)
			};
			me.requests[request.id] = request;
			me.latestId = request.id;
			// bind our statechange listener
			if (async) {
				xhr.onreadystatechange = Ext.Function.bind(me.myStateChange,
						me, [request]);
			}
			if ((options.cors === true || me.cors === true) && Ext.isIE
					&& Ext.ieVersion >= 8) {
				xhr.onload = function() {
					me.myComplete(request);
				}
			}
			// start the request!
			xhr.send(requestOptions.data);
			if (!async) {
				return me.myComplete(request);
			}
			return request;
		} else {
			Ext.callback(options.callback, options.scope, [options, undefined,
							undefined]);
			return null;
		}
	},
	myStateChange : function(request) {
		if (request.xhr.readyState == 4) {
			this.clearTimeout(request);
			this.myComplete(request);
			this.cleanup(request);
		}
	},
	myComplete : function(request) {
		var me = this, options = request.options, result, success, response;
		try {
			result = me.parseStatus(request.xhr.status);
		} catch (e) {
			// in some browsers we can't access the status if the readyState is
			// not 4, so the request has failed
			result = {
				success : false,
				isException : false
			};
		}
		// 这里需要添加一些的内容
		success = result.success;
		if (success) {
			response = me.createResponse(request);
			// 开始解析返回的内容
			if (!Ext.isEmpty(response.getResponseHeader("unauth"))
					&& Ext.ComponentQuery.query('loginwin').length == 0) {
				// 如果是session 过期
				Ext.create("Pcbms.LoginWindow", {
							width : 320,
							height : 240,
							modal : true
						}).show();
			} else {
				var obj = Ext.decode(response.responseText);
				if (obj.success) {
					Ext
							.callback(options.success, options.scope, [obj,
											options]);
					if (obj.msg) {
						Ext.Msg.alert("提示", obj.msg);
					}
				} else {
					Ext
							.callback(options.failure, options.scope, [obj,
											options]);
				}
			}
			me.fireEvent("requestcomplete", me, response, options);
		} else {
			if (result.isException || request.aborted || request.timedout) {
				response = me.createException(request);
			} else {
				response = me.createResponse(request);
			}
			me.fireEvent("requestexception", me, response, options);
			Ext.callback(options.serverfailure, options.scope, [response,
							options]);
		}
		Ext.callback(options.callback, options.scope, [options, success,
						response]);
		delete me.requests[request.id];
		return response;
	}
});

Pcbms.formHandler = function(form, action) {
	switch (action.failureType) {
		case Ext.form.action.Action.CLIENT_INVALID :
			Ext.Msg.alert('表单错误', '你提交的表单中含有错误!请校正后提交!');
			break;
		case Ext.form.action.Action.CONNECT_FAILURE :
			Ext.Msg.alert('链接错误', '链接失败!请稍后再试!');
			break;
		case Ext.form.action.Action.SERVER_INVALID :
			Ext.Msg.alert('数据错误', action.result.msg);
	}
};

/**
 * 可以传入string 和 object Pcbms.ajaxProxy = function(url, extraParams, reader)
 */
Pcbms.ajaxProxy = function(config) {
	// 显示的数据数量
	switch (typeof config) {
		case "string" :
			return Ext.apply(Pcbms.ajaxProxy.proxy, {
						url : config
					});
		case "object" :
			return Ext.apply(Ext.clone(Pcbms.ajaxProxy.proxy), config);
	}
	return {};
};
Pcbms.ajaxProxy2 = function(config) {
	if (typeof config == 'string') {
		config = {
			url : config
		};
	}
	Ext.apply(config, {
				reader : {
					type : "json",
					root : "result",
					totalProperty : "count"
				}
			});
	// 显示的数据数量
	switch (typeof config) {
		case "string" :
			return Ext.apply(Pcbms.ajaxProxy.proxy, {
						url : config
					});
		case "object" :
			return Ext.apply(Ext.clone(Pcbms.ajaxProxy.proxy), config);
	}
	return {};
};
Pcbms.ajaxProxy.proxy = {
	type : "ajax",
	url : "",
	limitParam : "pagesize",
	startParam : "offset",
	extraParams : {},
	reader : {
		type : "json",
		root : "paginationlist",
		totalProperty : "count"
	},
	listeners : {
		exception : function(proxy, response) {
			// 首先将诶西
			if (response.status == 500) {
				Ext.Msg
						.alert(
								"\u540e\u53f0\u9519\u8bef",
								"\u975e\u5e38\u62b1\u6b49!\u540e\u53f0\u8fd0\u884c\u9519\u8bef!\u8bf7\u8054\u7cfb\u5ba2\u670d!\u8c22\u8c22!");
				return;
			}
			if (!Ext.isEmpty(response.getResponseHeader("unauth"))
					&& Ext.ComponentQuery.query('loginwin').length == 0) {
				Ext.create("Pcbms.LoginWindow", {
							width : 320,
							height : 240,
							modal : true
						}).show();
				return;
			}
			var result = Ext.decode(response.responseText);
			Ext.Msg.alert("\u51fa\u73b0\u9519\u8bef",
					"\u6570\u636e\u8f7d\u5165\u51fa\u9519! \u539f\u56e0:"
							+ result.msg);
		}
	}
};

Pcbms.clientRenderer = function(v, m, r) {
	var rs = "";
	if (typeof r == "object" && r.isModel) {
		if (!Ext.isEmpty(r.get("company"))) {
			rs += r.get("company");
		} else if (!Ext.isEmpty(r.get("contact"))) {
			rs += r.get("contact");
		}
		rs += "[#" + r.get("userid") + "]";
		return rs;
	}
	if (typeof v == "object") {
		if (!Ext.isEmpty(v["company"])) {
			rs += v["company"];
		} else if (!Ext.isEmpty(v["contact"])) {
			rs += v["contact"];
		}
		rs += "[#" + v["userid"] + "]";
		return rs;
	}
	if (typeof v == "string") {
		return v;
	}
}
Pcbms.synctypeRenderer = function(v, m, r) {
	if (v == 0) {
		return "不同步";
	}
	var st = "";
	if (v & 1 == 1) {
		st += " <span style='color:red'>订单</span>";
	}
	if (v & 2 == 2) {
		st += " <span style='color:blue'>生产</span>";
	}
	if (v & 4 == 4) {
		st += " <span style='color:green'>发货</span>";
	}
	return st;
}
// 收货信息
Pcbms.receiveRenderer = function(v, m, r) {
	var rs = "";
	if (typeof r == "object" && r.isModel) {
		if (!Ext.isEmpty(r.get("companyName"))) {
			rs += r.get("companyName") + ",";
		}
		if (!Ext.isEmpty(r.get("region"))) {
			rs += r.get("region");
		}
		if (!Ext.isEmpty(r.get("address"))) {
			rs += r.get("address");
		}
		if (!Ext.isEmpty(r.get("phone"))) {
			rs += "," + r.get("phone");
		}
		if (!Ext.isEmpty(r.get("receiver"))) {
			rs += "," + r.get("receiver");
		}
		return rs;
	}
	if (typeof v == "object") {
		if (!Ext.isEmpty(v["companyName"])) {
			rs += v["companyName"];
		}
		if (!Ext.isEmpty(v["region"])) {
			rs += v["region"];
		}
		if (!Ext.isEmpty(v["address"])) {
			rs += v["address"];
		}
		if (!Ext.isEmpty(v["phone"])) {
			rs += v["phone"];
		}
		if (!Ext.isEmpty(v["receiver"])) {
			rs += v["receiver"];
		}
		return rs;
	}
	return v;
}

Pcbms.formbtn = function(text, storeId, type, method, scope) {
	if (!type) {
		type = "medium";
	}
	var result = {
		scale : type,
		xtype : "button",
		text : text,
		handler : function(b) {
			// 默认的查询框 点击后执行查询
			var queryParam = b.up("form").getForm().getValues();
			queryParam.validquery = true;
			if (method) {
				queryParam = method.call(scope);
			}
			var store = Ext.data.StoreManager.lookup(storeId);
			if (queryParam.validquery) {
				store.getProxy().extraParams = queryParam;
				store.loadPage(1);
			} else {
				Ext.Msg
						.alert("\u67e5\u8be2\u9519\u8bef",
								"\u4f60\u7684\u67e5\u8be2\u53c2\u6570\u9519\u8bef,\u8bf7\u68c0\u67e5!");
			}
		}
	};
	switch (type) {
		case "medium" :
			result.rowspan = 2;
			result.iconCls = "searchbig";
			break;
		case "small" :
			result.iconCls = "searchsmall";
			break;
		case "big" :
			result.rowspan = 3;
			result.iconCls = "searchbig";
			break;
	}
	return result;
};
/**
 * 
 * @param {需要下载的文件类型}
 *            type, 常用的文件类型 peojectfile psfile workboardfile
 * @param {下载的文件的对象的编号 }
 *            id
 */
Pcbms.downFile = function(type, id, format) {
	var downlink = null;
	switch (type) {
		case "projectfile" :
			downlink = Ext.String.format(
					"projectFileAction!download.action?bcbh={0}&randomnum={1}",
					id, Math.random());
			break;
		case "psfile" :
			downlink = "psFileAction!download.action?bcbh={0}";
			break;
	}
	document.getElementById("downframe").src = downlink;
}

/**
 * 系统通用的组件
 */

var nvstorelistener = function(name, value) {
	if (!name) {
		name = "全部数据";
	}
	if (!value) {
		value = "";
	}
	return {
		load : function(store) {
			var a = Ext.create("NameValue");
			a.data.name = name;
			a.data.value = value;
			store.insert(0, a);
		}
	};
};
Ext.define('DictionaryInfo', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'dicname',
						type : 'string'
					}, {
						name : 'dicvalue',
						type : 'string'
					}]
		});
Ext.define('DictionaryStore', {
			extend : 'Ext.data.Store',
			model : "DictionaryInfo",
			constructor : function() {
				this.proxy = {
					type : 'ajax',
					url : "/dictionaryManagementAction!searchDictionary.action?type="
							+ arguments[0].type,
					reader : {
						type : 'json',
						root : 'dicInfoList'
					},
					listeners : {
						exception : function(proxy, response) {
							var result = Ext.decode(response.responseText);
							Ext.Msg.alert('出现错误', '数据载入出错! 原因:' + result.msg);
						}
					}
				};
				this.callParent();
			}
		});

Ext.apply(Ext.form.field.VTypes, {
			daterange : function(val, field) {
				var date = field.parseDate(val);

				if (!date) {
					return false;
				}
				if (field.startDateField
						&& (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
								.getTime()))) {
					var start = field.up('form').down('#'
							+ field.startDateField);
					start.setMaxValue(date);
					start.validate();
					this.dateRangeMax = date;
				} else if (field.endDateField
						&& (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
								.getTime()))) {
					var end = field.up('form').down('#' + field.endDateField);
					end.setMinValue(date);
					end.validate();
					this.dateRangeMin = date;
				}
				/*
				 * Always return true since we're only using this vtype to set
				 * the min/max allowed values (these are tested for after the
				 * vtype test)
				 */
				return true;
			},

			daterangeText : '起始日期必须必截止日期小',

			password : function(val, field) {
				if (field.initialPassField) {
					var pwd = field.up('form').down('#'
							+ field.initialPassField);
					return (val == pwd.getValue());
				}
				return true;
			},
			passwordText : '两次输入的密码不符合!',

			zip : function(val, field) {
				return /.zip$/i.test(val);
			},
			zipText : '上传的文件类型必须是zip类型'
		});
// 创建登陆的window
Ext.define("Pcbms.LoginWindow", {
	extend : "Ext.window.Window",
	alias : 'loginwin',
	closable : false,
	title : "\u8bf7\u8f93\u5165\u7528\u6237\u540d\u548c\u5bc6\u7801\u7ee7\u7eed\u4e0b\u4e00\u6b65\u64cd\u4f5c!",
	layout : "fit",
	initComponent : function() {
		var me = this;
		me.form = Ext.create("Ext.form.Panel", {
			border : false,
			defaults : {
				style : "margin-left:15px",
				labelWidth : 79,
				allowBlank : false,
				anchor : "95%"
			},
			defaultType : "textfield",
			items : [{
				margin : "10 0 5 15",
				xtype : "displayfield",
				hideLabel : 300,
				value : "<b style='color:red'>\u4f60\u957f\u65f6\u95f4\u6ca1\u6709\u64cd\u4f5c,\u672c\u6b21\u4f1a\u8bdd\u4ee5\u8fc7\u671f \u9700\u8981\u91cd\u65b0\u767b\u9646\uff01\u8bf7\u8f93\u5165\u4f60\u7684\u7528\u6237\u540d\u548c\u5bc6\u7801!</b>"
			}, {
				fieldLabel : "\u767b\u9646\u7528\u6237\u540d ",
				name : "tpbs_username"
			}, {
				fieldLabel : "\u767b\u9646\u5bc6\u7801",
				inputType : "password",
				name : "tpbs_password"
			}, {
				fieldLabel : "启用Java",
				xtype : "checkbox",
				inputValue : 'true',
				name : "enableJava",
				checked : Ext.util.Cookies.get("tpbs_enableJava") == "true",
				listeners : {
					change : function(f, nv) {
						if (nv == "true" || nv) {
							Ext.util.Cookies.set("tpbs_enableJava", "true");
						} else {
							Ext.util.Cookies.clear("tpbs_enableJava");
						}
					}
				}
			}]
		});
		Ext.applyIf(me, {
			items : [me.form],
			buttons : [{
				text : "\u767b\u9646",
				iconCls : "accept",
				handler : function(b) {
					var form = me.form.getForm();
					form.submit({
						url : "./j_spring_security_check",
						clientValidation : true,
						includeEmptyText : false,
						waitMsgTarget : true,
						waitMsg : "\u7528\u6237\u540d\u5bc6\u7801\u9a8c\u8bc1\u4e2d...",
						success : function(form, action) {
							me.setTitle("\u767b\u9646\u6210\u529f!");
							me.form
									.getEl()
									.update("<div style='text-align:center;'>"
											+ "<img src='css/success.png' ><br/>"
											+ "<span style='font-size:14px;color:#fda71e;'>"
											+ "\u606d\u559c \u9a8c\u8bc1\u6210\u529f,\u4f60\u5df2\u91cd\u65b0\u767b\u9646\u7cfb\u7edf!"
											+ "</span>" + "</div>");
							var task = new Ext.util.DelayedTask(function() {
										me.fireEvent("authed",
												action.result.uri);
										me.close();
									});
							task.delay(1800);
						},
						failure : function(form, action) {
							switch (action.failureType) {
								case Ext.form.action.Action.CLIENT_INVALID :
									Ext.Msg
											.alert(
													"用户认证错误!",
													"\u4f60\u63d0\u4ea4\u7684\u8868\u5355\u4e2d\u542b\u6709\u9519\u8bef!\u8bf7\u6821\u6b63\u540e\u63d0\u4ea4!");
									break;
								case Ext.form.action.Action.CONNECT_FAILURE :
									Ext.Msg
											.alert("用户认证错误!",
													"\u540e\u53f0\u8fd0\u884c\u9519\u8bef,\u8bf7\u8054\u7cfb\u5ba2\u670d!");
									break;
								case Ext.form.action.Action.SERVER_INVALID :
									Ext.Msg.alert("用户认证错误!", action.result.msg);
							}
							form.findField("captcha").focus();
						}
					});
				}
			}]
		});
		me.callParent();
		me.addEvents({
					"authed" : true
				});
	}
});
/**
 * 员工的下拉框
 */
Ext.define("Pcbms.EmployeeCombo", {
	extend : "Ext.form.ComboBox",
	alias : "widget.empcombo",
	displayField : 'name',
	valueField : 'userid',
	minChars : 2,
	params : {},
	queryParam : 'employeeInfo.name',
	onBlur : function() {
		if (this.getRawValue() == this.getValue()) {
			this.setValue("");
		}
	},
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			model : "Account",
			proxy : Pcbms.ajaxProxy({
				url : "searchAccountAction!searchEmployeeList.action?employeeInfo.categoryname="
						+ this.cn,
				reader : {
					type : 'json',
					root : 'employeeList'
				}
			})
		});
		this.callParent();
	}
});
/**
 * 客户下拉框
 */
Ext.define("Pcbms.ClientCombo", {
	extend : "Ext.form.ComboBox",
	alias : "widget.clientcombo",
	displayField : 'company',
	valueField : 'userid',
	minChars : 2,
	status : 1,
	queryParam : 'clientInfo.company',
	tpl : Ext.create('Ext.XTemplate', '<tpl for=".">',
			'<div class="x-boundlist-item">{userid} - {company}</div>',
			'</tpl>'),
	// template for the content inside text field
	displayTpl : Ext.create('Ext.XTemplate', '<tpl for=".">',
			'{userid} - {company}', '</tpl>'),
	onBlur : function() {
		if (this.getRawValue() == this.getValue()) {
			this.setValue("");
		}
	},
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			model : "Account",
			proxy : Pcbms.ajaxProxy({
				url : "/searchAccountAction!searchClientList.action?clientInfo.status="
						+ this.status,
				reader : {
					type : 'json',
					root : 'clientList'
				}
			})
		});
		this.callParent();
	}
});

Ext.define("Pcbms.DepartmentTree", {
			id : "departmentTree",
			extend : "Ext.window.Window",
			title : "部门选择",
			closeAction : "hidden",
			width : 240,
			height : 400,
			layout : "fit",
			singleSelection : false,
			initComponent : function() {
				this.items = Ext.create('Ext.tree.Panel', {
							columns : [{
										xtype : 'treecolumn',
										text : '部门名称',
										sortable : true,
										dataIndex : 'name'
									}],
							forceFit : true,
							useArrows : true,
							store : datastore.createDepartmentTreeStore(),
							rootVisible : false,
							listeners : {
								checkchange : function(node, checked) {
									if (checked) {
										var checkedNodes = this.getChecked();
										for (var i = 0; i < checkedNodes.length; i++) {
											if (node != checkedNodes[i]) {
												checkedNodes[i].set("checked",
														false);
											}
										}
									}
								}
							}
						});
				this.callParent();
			},

			buttonAlign : "right",
			buttons : [{
						text : "确认选择",
						handler : function(b) {
							Ext.getCmp("departmentTree").close();
						}
					}],
			listeners : {
				beforehide : function(w) {
					var tree = w.items.first();
					var records = tree.getView().getChecked(), names = [];
					Ext.Array.each(records, function(rec) {
								names.push({
											id : rec.data.departid,
											text : rec.data.name
										});
							});
					if (w.callback) {
						w.callback.call(w.scope, names);
					}
				}
			}
		});
Ext.define('Pcbms.DepartSelection', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.departselection',
	emptyText : "请选择所属部门",
	valueField : 'departid',
	displayField : 'name',
	initComponent : function() {
		Ext.apply(this, {
					editable : false,
					queryMode : 'local',
					select : Ext.emptyFn
				});
		this.displayField = this.displayField || 'text', this.treeid = Ext.String
				.format('tree-combobox-{0}', Ext.id());
		this.tpl = Ext.String.format('<div id="{0}"></div>', this.treeid);
		var me = this;
		me.store = datastore.createDepartmentStore();
		me.tree = Ext.create('Ext.tree.Panel', {
					rootVisible : false,
					border : false,
					autoScroll : true,
					height : 250,
					store : datastore.createDepartmentTreeStore()
				});
		me.tree.on('itemclick', function(view, record) {
					me.setValue(record);
					me.collapse();
				});
		me.on('expand', function() {
					if (!this.tree.rendered) {
						this.tree.render(this.treeid);
					}
				});
		me.callParent(arguments);
	}
});

Ext.define("Pcbms.IdComboBox", {
	extend : "Ext.form.ComboBox",
	alias : "widget.idcombo",
	displayField : 'name',
	valueField : 'value',
	hideTrigger : true,
	queryParam : 'id',
	minChars : 1,
	typeArr : ['ecn', 'projectfile', 'contract', 'workboard', 'materalticket',
			'projectfilePC', 'materialtemplateticket', 'producestep', 'lotcard'],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			model : 'NameValue',
			proxy : {
				type : 'ajax',
				url : "/comboListActionImpl!searchComboList.action?pageNum=20&type="
						+ this.typeArr[this.type],
				reader : {
					type : 'json',
					root : 'list'
				}
			}
		});

		if (this.addFirst) {
			this.store.addListener("load", function() {
						this.store.insert(0, this.addFirst);
					}, this);
		}

		this.callParent();
	}

});
Ext.define("Pcbms.ModuleCombo", {
			extend : "Ext.form.ComboBox",
			alias : "widget.modulecombo",
			displayField : 'name',
			valueField : 'moduleid',
			// minChars : 2,
			queryMode : 'local',
			initComponent : function() {
				this.store = datastore.createModuleStore();
				this.callParent();
			}
		});

Ext.define("Pcbms.PubComboBox", {
	extend : "Ext.form.ComboBox",
	alias : "widget.pubcombo",
	displayField : 'dicname',
	valueField : 'dicname',
	editable : false,
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
					fields : [{
								name : 'dicname',
								type : 'string'
							}, {
								name : 'dicvalue',
								type : 'string'
							}],
					proxy : {
						type : 'ajax',
						url : "/produceSystemDictionaryAction!searchDic.action?type="
								+ this.type,
						reader : {
							type : 'json',
							root : 'dicInfoList'
						}
					}
				});
		if (this.addFirst) {
			this.store.addListener("load", function() {
						this.store.insert(0, this.addFirst);
					}, this);
		}
		this.callParent();
	},
	filterValue : function(v) {
		this.store.filterBy(function(r) {
					if (r.get("dicvalue") == v) {
						return true;
					}
					return false;
				});
	}
});
/**
 * 开始定义字典
 * 
 * @param {}
 *            data
 */
function defineDictCombo(dictdata) {
	dictdata.filter = function(type){
		if(typeof type == "string"){
			for(var i=0;i<this.length;i++){
				if(this[i].dicname == type){
					type = this[i].dicvalue;
					break;
				}
			}
		}
		var result = [];
		for(var i=0;i<this.length;i++){
			if(this[i].dictype == type){
				result.push(this[i]);
			}
		}
		return result;
	};
	Ext.define("Pcbms.DictComboBox", {
		extend : "Ext.form.ComboBox",
		alias : "widget.dictcombo",
		displayField : 'dicname',
		valueField : 'dicname',
		editable : false,
		initComponent : function() {
			this.store = Ext.create("Ext.data.Store", {
				fields : [{
							name : 'dicname',
							type : 'string'
						}, {
							name : 'dicvalue',
							type : 'string'
						}],
				sorters: [ {
			         property: 'dicvalue',
			         direction: 'ASC'
			     }],
				data : dictdata.filter(this.dictype)
			});
			this.callParent();
		},
		filterValue : function(v) {
			this.store.filterBy(function(r) {
						if (r.get("dicvalue") == v) {
							return true;
						}
						return false;
					});
		}
	});
}
/**
 * 将系统的查询面板通用化，在定义组件的时候可以传入的参数有<br/>
 * <ul>
 * <li>model: 必须 </li>
 * <li>al(autoLoad) : 可选(true,false)</li>
 * <li>storeId : 可选 url : 数据查询的链接地址,必须或必须填入</li>
 * <li>proxy proxy : 查询数据链接的地址信息</li>
 * <li>sTitle : 查询数据的标题可选默认为 数据查询 </li>
 * <li> sbConfig : { text : 查询按钮的文字, handler:点击查询后执行的方法 例如: <code>
 *	//传入的是 store 和 查询的表单
 * function( store,form){
 * 	//做出处理
 * }
 * </code> }</li>
 * <li>abs : [额外的按钮,可以放入导出按钮等等] </li>
 * <li>searchs:[当即有字母 "n" 的时候另起一行, 当 具有tshow的时候,默认是不显示的 ]</li>
 * <li>page:true(默认) 或者false 默认是需要分页的</li>
 * <li>actions:[这里是 action 的定义 action 中如有 <code>sf:function(records){
 * 	//被选中的内容
 * }</code>]</li>
 * <li>columns:[列信息]</li>
 * <li>sm: {有两种模式 checkbox 和普通的, 使用 checkbox 的时候 可以用SINGLE ---， 使用普通的时候是 NONE}</li>
 * </ul>
 */
Ext.define("Pcbms.CommonGridPanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.commongrid",
	layout : "border",
	al : true,
	bodyStyle : 'background:white; padding:12px; overflow:hidden !important;',
	sbConfig : {
		text : '查询',
		scale : 'small',
		iconCls : 'searchsmall',
		handler : function(store, form) {
			var queryParam = form.getForm().getValues();
			queryParam.validquery = true;
			if (queryParam.validquery) {
				store.getProxy().extraParams = queryParam;
				store.loadPage(1);
			} else {
				Ext.Msg
						.alert("\u67e5\u8be2\u9519\u8bef",
								"\u4f60\u7684\u67e5\u8be2\u53c2\u6570\u9519\u8bef,\u8bf7\u68c0\u67e5!");
			}
		}
	},
	sTitle : '请输入你的查询条件:',
	page : true,
	sm : 'MULTI',
	selection : 'checkboxmodel',
	getStore : function() {
		var me = this;
		if (me.store == null) {
			return me.down("grid").getStore();
		}
		return me.store;
	},
	genItems : function(columns, searchs, actions) {
		var me = this;
		var rs = [];
		var storeconfig = {
			model : me.model,
			autoLoad : me.al,
			pageSize : me.page ? 25 : 99999
		};
		if (Ext.isEmpty(me.proxy)) {
			storeconfig.proxy = Pcbms.ajaxProxy2(me.url);
		} else {
			storeconfig.proxy = me.proxy;
		}
		if (!Ext.isEmpty(me.storeId)) {
			storeconfig.storeId = me.storeId;
		}
		if (!Ext.isEmpty(me.sorters)) {
			storeconfig.sorters = me.sorters;
		}
		// 初始化表单内容
		if (!Ext.isEmpty(searchs)) {
			// 如果没有查询内容 那么不执行
			var formConfig = {
				xtype : 'form',
				border : false,
				region : 'north',
				items : [{
							xtype : 'displayfield',
							anchor : '100%',
							labelSeparator : '',
							value : '<b>' + me.sTitle + '</b>'
						}, {
							xtype : 'container',
							defaults : {
								labelWidth : 65
							},
							layout : {
								type : 'hbox',
								defaultMargins : {
									top : 0,
									right : 15,
									bottom : 0,
									left : 0
								}
							},
							items : []
						}]
			};
			var dsitems = formConfig.items[1].items;
			for (var i = 0; i < searchs.length; i++) {
				if (searchs[i] == "n") {
					dsitems = [];
					formConfig.items.push({
								type : 'fieldcontainer',
								hidden : true,
								border : false,
								style : 'margin-top:5px',
								layout : {
									type : 'hbox',
									defaultMargins : {
										top : 0,
										right : 15,
										bottom : 0,
										left : 0
									}
								},
								defaults : {
									labelWidth : 65,
									width : 200,
									style : 'margin-right:10px'
								},
								tshowct : true,
								items : dsitems
							})
					continue;
				}
				if (!searchs[i].tshow) {
					// 开始创建行
					dsitems.push(searchs[i]);
					continue;
				}
				dsitems.push(searchs[i]);
			}
			me.store = Ext.create("Ext.data.Store", storeconfig);
			// 放入按钮 前台查询信息结束
			formConfig.items[1].items.push({
						xtype : 'button',
						text : me.sbConfig.text,
						scale : me.sbConfig.scale,
						iconCls : me.sbConfig.iconCls,
						handler : function(b) {
							var form = b.up("form");
							me.sbConfig.handler.call(this, me.store, form);
						}
					});
			if (!Ext.isEmpty(me.abs)) {
				// 其他按钮
				for (var i = 0; i < me.abs.length; i++) {
					formConfig.items[1].items.push(me.abs[i]);
				}
			}
			if (formConfig.items.length > 2) {
				formConfig.items[1].items.push({
							xtype : 'checkbox',
							boxLabel : '更多的查询条件',
							listeners : {
								change : function(field) {
									var as = field.up("form")
											.query("[tshowct]");
									Ext.each(as, function(a) {
												if (a.isHidden()) {
													a.show();
												} else {
													a.hide();
												}
											});
								}
							},
							inputValue : '1'
						});
			}
			formConfig.items.push({
						xtype : 'displayfield',
						width : 220,
						style : 'margin-top: 10px;',
						anchor : '100%',
						labelSeparator : '',
						value : '<b>详细内容列表</b>'
					});
			rs.push(formConfig);
		} else {
			me.store = Ext.create("Ext.data.Store", storeconfig);
		}
		// 现在是表单信息
		var gridConfig = {
			xtype : 'grid',
			region : 'center',
			store : me.store,
			plugins : [Ext.create('Ext.grid.plugin.CellEditing')],
			columns : columns
		};
		Ext.apply(gridConfig, me.gridConfig);
		var modelConfig = {
			mode : me.sm,
			listeners : {
				selectionchange : function(model, selected) {
					if (Ext.isEmpty(actions)) {
						return;
					}
					for (var i = 0; i < actions.length; i++) {
						var sf = actions[i].initialConfig.sf;
						if (Ext.isFunction(sf)) {
							actions[i].setDisabled(sf.call(this, selected));
						}
					}
				}
			}
		}
		if (me.sm != "NONE" && me.selection == "checkboxmodel") {
			me.sel = Ext.create("Ext.selection.CheckboxModel", modelConfig);
		} else {
			me.sel = Ext.create("Ext.selection.RowModel", modelConfig);
		}
		gridConfig.selModel = me.sel;
		if (me.page) {
			gridConfig.bbar = Ext.create("Ext.PagingToolbar", {
						store : me.store,
						displayInfo : true,
						beforePageText : "当前页",
						afterPageText : "总 {0} 页",
						displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
						emptyMsg : " 暂无信息"
					});
		} else {
			gridConfig.bbar = [];
		}
		var viewConfig = {
			stripeRows : true
		};
		if (Ext.isFunction(me.getRowClass)) {
			viewConfig.getRowClass = me.getRowClass;
		}
		if (!Ext.isEmpty(actions)) {
			var contextMenu = Ext.create('Ext.menu.Menu', {
						items : actions
					});
			gridConfig.tbar = [];
			for (var i = 0; i < actions.length; i++) {
				gridConfig.tbar.push(actions[i]);
				gridConfig.tbar.push("-");
				if (Ext.isArray(gridConfig.bbar)) {
					gridConfig.bbar.push(actions[i]);
					gridConfig.bbar.push("-");
				}
			}
			if (Ext.isArray(gridConfig.bbar)) {
				gridConfig.bbar.push("->");
				gridConfig.bbar.push({
							xtype : 'tbtext',
							text : '暂无信息',
							itemId : 'displayItem'
						});
			}
			me.store.on("load", function(s, rs) {
						// 更新总的信息数量
						me.down("#displayItem").setText("总 " + rs.length
								+ " 条记录");
					});
			Ext.apply(viewConfig, {
						listeners : {
							itemcontextmenu : function(view, rec, node, index,
									e) {
								e.stopEvent();
								contextMenu.showAt(e.getXY());
								return false;
							}
						}
					});
		}
		gridConfig.viewConfig = viewConfig;
		rs.push(gridConfig);
		return rs;
	},
	onDestroy : function() {
		var me = this;
		Ext.destroyMembers(me, 'proxy', 'page', 'sbConfig');
		Ext.destroy([me.sel, me.abs, me.items]);
		me.store = null;
		me.sel = null;
		me.abs = null;
		me.items = null;
		me.callParent(arguments);
	}
});
Ext.define("Pcbms.DateRangeField", {
			extend : "Ext.form.FieldContainer",
			alias : "widget.daterangefield",
			fieldLabel : '时间范围',
			width : 370,
			combineErrors : true,
			defaults : {
				hideLabel : true
			},
			layout : {
				type : 'hbox',
				defaultMargins : {
					top : 0,
					right : 15,
					bottom : 0,
					left : 0
				}
			},
			initComponent : function() {
				var me = this;
				me.items = [{
							xtype : 'displayfield',
							value : '从'
						}, {
							xtype : 'datefield',
							name : me.startname,
							itemId : 'startdatefield',
							endDateField : 'enddatefield',
							vtype : 'daterange',
							width : 110,
							getSubmitValue : function() {
								if (this.getValue() != null) {
									return this.getValue().getTime();
								}
								return null;
							}
						}, {
							xtype : 'displayfield',
							value : '到'
						}, {
							xtype : 'datefield',
							vtype : 'daterange',
							itemId : 'enddatefield',
							width : 110,
							startDateField : 'startdatefield',
							name : me.endname,
							getSubmitValue : function() {
								if (this.getValue() != null) {
									return this.getValue().getTime() + 86400000;
								}
								return null;
							}
						}]
				me.callParent();
			},
			onDestroy : function() {
				var me = this;
				me.callParent();
			}
		});

Pcbms.contractauditurl = "business/contractAction!auditInput.action?title={0}_合同信息审核&contract.contractId={0}&widget=Pcbms.business.ContractAuditForm";