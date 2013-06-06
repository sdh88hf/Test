var tpl_client = Ext.create('Ext.XTemplate', '<p>客户编号: {userid}</p>',
		'<p>客户联系人: {contact}</p>', '<p>公司姓名: {company}</p>',
		'<p>客户级别: {clientlevel}</p>', '<p>Email: {email}</p>',
		'<p>传真号码: {faxno}</p>', '<p>联系电话: {mobile}, {telephone}</p>');
var tpl_employee = Ext.create('Ext.XTemplate', '<p>员工编号: {userid}</p>',
		'<p>员工姓名: {name}</p>', '<p>Email: {email}</p>',
		'<p>联系电话: {mobile}, {telephone}</p>', '<p>QQ: {qq}</p>',
		'<p>MSN: {msn}</p>', '<p>职称: {title}</p>', '<p>职位: {position}</p>');