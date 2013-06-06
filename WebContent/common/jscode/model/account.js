Ext.define("Account", {
	extend : "Ext.data.Model",
	fields : [
	          "id",
	          {name:"username",defaultValue:'name'},
	          {name:"password",defaultValue:'123'},
	          {name:"email",defaultValue:'mail@163.com'},
	          {name:"lastLoginTime",type:"date",dateFormate:'n/j h:ia'}
	],
	idProperty: 'id'
});