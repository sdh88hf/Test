Ext.define("Pcbms.ux.gridgroup", {
			extend : 'Ext.grid.feature.Grouping',
			getFeatureTpl : function(values, parent, x, xcount) {
				var me = this;

				return [
						'<tpl if="typeof rows !== \'undefined\'">',
						// group row tpl
						'<tr class="'
								+ Ext.baseCSSPrefix
								+ 'grid-group-hd '
								+ (me.startCollapsed ? me.hdCollapsedCls : '')
								+ ' {hdCollapsedCls}"><td class="'
								+ Ext.baseCSSPrefix
								+ 'grid-cell" colspan="'
								+ parent.columns.length
								+ '" {[this.indentByDepth(values)]}><div class="'
								+ Ext.baseCSSPrefix + 'grid-cell-inner"><div '

								+ '>' + me.groupHeaderTpl
								+ '<button>发送</button></div></div></td></tr>',
						// this is the rowbody
						'<tr id="{viewId}-gp-{name}" class="'
								+ Ext.baseCSSPrefix + 'grid-group-body '
								+ (me.startCollapsed ? me.collapsedCls : '')
								+ ' {collapsedCls}"><td colspan="'
								+ parent.columns.length
								+ '">{[this.recurse(values)]}</td></tr>',
						'</tpl>'].join('');
			},
			onGroupClick : function(view, group, idx, foo, e) {
//				var me = this, toggleCls = me.toggleCls, groupBd = Ext.fly(
//						group.nextSibling, '_grouping');
//
//				if (groupBd.hasCls(me.collapsedCls)) {
//					me.expand(groupBd);
//				} else {
//					me.collapse(groupBd);
//				}
			},
			initComponent : function() {

				this.callParent();
			}

		});