Ext.define('NameValue', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'name',
		type : 'string',
		convert : function(value, record) {
			return record.raw;
		}
	}, {
		name : 'value',
		type : 'string',
		convert : function(value, record) {
			return record.raw;
		}
	} ]
});