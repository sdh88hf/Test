Ext.Loader.setPath("app", "./lib");

Ext.Loader.setConfig({
			enabled : true
		});

/**
 * 绘制开料图
 * 
 * @param {}
 *            config mainX原料宽 mainY原料高 panels
 *            需要拼的板[{name:'',x:'',y:'',count:''}]
 */
function drawPanel(config,ff) {

	// 窗体长宽
	var winX = Ext.getBody().getWidth();
	// var winY = Ext.getBody().getHeight();
	var winY = 1080;
	// 原料长宽
	var mainX = config["mainX"];
	var mainY = config["mainY"];

	// 根据较小的边来计算比率
	var sfflag = mainX > mainY ? mainY : mainX;

	var winflag = mainX > mainY ? winY : winX;

	// 比率
	var sf = changeTwoDecimal((winflag / sfflag) * 0.8);

	var mainPanel = Ext.create("Ext.panel.Panel", {
				width : mainX * sf,
				height : mainY * sf,
				// layout : 'absolute',
				id : 'mp',
				border : false,
				items : []

			});

	var tbar = Ext.create("Ext.toolbar.Toolbar", {});

	var panelList = [];
	var windowId = 0;
	// 是否有重叠
	var iscd = false;

	Ext.each(config.panels, function() {
		var me = this;
		tbar.add({
			text : "添加" + this.name,
			handler : function() {

				if (iscd) {
					alert("存在重叠的板子,请更正后再添加");
					return;
				}

				var width = changeTwoDecimal(me.width * sf);

				var height = changeTwoDecimal(me.height * sf);

				var panel = Ext.create("Ext.window.Window", {

					width : width,
					height : height,
					minHeight : 20,
					minWidth : 20,
					isfirst : true,
					id : "panel" + windowId,
					name : me.name,
					modal : true,
					constrain : true,
					title : me.name + " X:" + me.width + " Y:" + me.height,
					resize : false,
					closable : true,
					listeners : {
						close : function() {

							iscd = false;
						},
						move : function(e) {
							if (this.isfirst) {
								this.isfirst = false;
								return;
							}

							// 智能识别
							// 如果左边距小于10
							if (this.getEl().getX() - mX < 10) {
								this.getEl().setX(mX);
							}
							if (this.getEl().getY() - mY < 10) {
								this.getEl().setY(mY);
							}

							// alert(mainPanel.getEl().getWidth()+mX-this.getEl().getX()-this.getEl().getWidth());
							if (mainPanel.getEl().getWidth() + mX
									- this.getEl().getX()
									- this.getEl().getWidth() < 10) {

								this.getEl().setX(mainPanel.getEl().getWidth()
										+ mX - this.getEl().getWidth());
							}

							if (mainPanel.getEl().getHeight() + mY
									- this.getEl().getY()
									- this.getEl().getHeight() < 10) {

								this.getEl().setY(mainPanel.getEl().getHeight()
										+ mY - this.getEl().getHeight());
							}

							// 判断是否与其他面板重叠
							for (var i = 0; i < panelList.length; i++) {

								if (this.getId() == panelList[i]) {
									return;
								}

								if (Ext.getCmp("" + panelList[i])) {

									var win = Ext.getCmp("" + panelList[i]);

									// 多少范围以内自动校正
									var f = 30;

									if (win.getEl().getX()
											+ win.getEl().getWidth()
											- this.getEl().getX() < f// 目标面板的右边距-当前面板的左边距
											&& win.getEl().getX()
													+ win.getEl().getWidth()
													- this.getEl().getX() > 0// 目标面板的右边距-当前面板的左边距
											&& ((this.getEl().getY() >= win
													.getEl().getY() && this
													.getEl().getY() < win
													.getEl().getY()
													+ win.getEl().getHeight()) || (this
													.getEl().getY()
													+ this.getHeight() >= win
													.getEl().getY() && this
													.getEl().getY()
													+ this.getHeight() < win
													.getEl().getY()
													+ win.getEl().getHeight()))) {
										//alert(1);
										if (win.getEl().getX()
												+ win.getEl().getWidth()
												+ this.getEl().getWidth() <= mainPanel
												.getWidth()
												+ mX) {
											this.getEl().setX(win.getEl()
													.getX()
													+ win.getEl().getWidth());
										}

									}

									if (this.getEl().getX() + this.getWidth()
											- win.getEl().getX() < f
											&& this.getEl().getX()
													+ this.getWidth()
													- win.getEl().getX() > 0// 目标面板的右边距-当前面板的左边距
											&& win.getEl().getX()
													+ win.getEl().getWidth()
													- this.getEl().getX() > 0// 目标面板的右边距-当前面板的左边距
											&& ((this.getEl().getY() >= win
													.getEl().getY() && this
													.getEl().getY() < win
													.getEl().getY()
													+ win.getEl().getHeight()) || (this
													.getEl().getY()
													+ this.getHeight() >= win
													.getEl().getY() && this
													.getEl().getY()
													+ this.getHeight() < win
													.getEl().getY()
													+ win.getEl().getHeight()))) {
										this.getEl().setX(win.getEl().getX()
												- this.getWidth());

									}
									if (win.getEl().getX()
											- this.getEl().getX()
											- this.getWidth() < f
											&& this.getEl().getX()
													+ this.getWidth() < win
													.getEl().getX()
											&& ((this.getEl().getY() >= win
													.getEl().getY() && this
													.getEl().getY() < win
													.getEl().getY()
													+ win.getEl().getHeight()) || (this
													.getEl().getY()
													+ this.getHeight() >= win
													.getEl().getY() && this
													.getEl().getY()
													+ this.getHeight() < win
													.getEl().getY()
													+ win.getEl().getHeight()))) {
										//alert(9);

										this.getEl().setX(win.getEl().getX()
												- this.getWidth());

									}

									if (this.getEl().getX()
											- win.getEl().getX()
											- win.getWidth() < f
											&& win.getEl().getX()
													+ win.getWidth()
													- this.getEl().getX() < f
											&& ((this.getEl().getY() >= win
													.getEl().getY() && this
													.getEl().getY() < win
													.getEl().getY()
													+ win.getEl().getHeight()) || (this
													.getEl().getY()
													+ this.getHeight() >= win
													.getEl().getY() && this
													.getEl().getY()
													+ this.getHeight() < win
													.getEl().getY()
													+ win.getEl().getHeight()))) {
										//alert(2);

										this.getEl().setX(win.getEl().getX()
												+ win.getWidth());

									}

									// 右上
									if (win.getEl().getY()
											+ win.getEl().getHeight()
											- this.getEl().getY() < f
											&& win.getEl().getY()
													+ win.getEl().getHeight()
													- this.getEl().getY() > 0
											&& this.getEl().getX() >= win
													.getEl().getX()
											&& this.getEl().getX() < win
													.getEl().getX()
													+ win.getEl().getWidth()) {
										//alert(3);
										if (win.getEl().getY()
												+ win.getEl().getHeight() >= mY
												&& win.getEl().getY()
														+ win.getEl()
																.getHeight() <= mY
														+ mainPanel.getHeight()) {

											this.getEl().setY(win.getEl()
													.getY()
													+ win.getEl().getHeight());

										}

									}

									// 右上
									if (this.getEl().getY()
											- win.getEl().getY()
											- win.getEl().getHeight() < f
											&& this.getEl().getY()
													- win.getEl().getY()
													- win.getEl().getHeight() > 0
											&& ((this.getEl().getX() >= win
													.getEl().getX() && this
													.getEl().getX() < win
													.getEl().getX()
													+ win.getEl().getWidth()) || (this
													.getEl().getX()
													+ this.getWidth() > win
													.getEl().getX() && this
													.getEl().getX()
													+ this.getWidth() <= win
													.getEl().getX()
													+ win.getEl().getWidth()))) {
										//alert(3);
										if (win.getEl().getY()
												+ win.getEl().getHeight() >= mY
												&& win.getEl().getY()
														+ win.getEl()
																.getHeight() <= mY
														+ mainPanel.getHeight()) {

											this.getEl().setY(win.getEl()
													.getY()
													+ win.getEl().getHeight());

										}

									}
									// 左上
									if (win.getEl().getY()
											+ win.getEl().getHeight()
											- this.getEl().getY() < f
											&& win.getEl().getY()
													+ win.getEl().getHeight()
													- this.getEl().getY() > 0
											&& this.getEl().getX()
													+ this.getWidth() > win
													.getEl().getX()
											&& this.getEl().getX()
													+ this.getWidth() <= win
													.getEl().getX()
													+ win.getEl().getWidth()) {
										//alert(4);
										if (win.getEl().getY()
												+ win.getEl().getHeight() >= mY
												&& win.getEl().getY()
														+ win.getEl()
																.getHeight()
														+ this.getHeight() <= mY
														+ mainPanel.getHeight()) {
											this.getEl().setY(win.getEl()
													.getY()
													+ win.getEl().getHeight());
										}
									}

									// 左下角
									if (win.getEl().getY()
											- this.getEl().getY()
											- this.getHeight() < f
											&& win.getEl().getY()
													- this.getEl().getY()
													- this.getHeight() > 0
											&& this.getEl().getX() >= win
													.getEl().getX()
											&& this.getEl().getX() < win
													.getEl().getX()
													+ win.getEl().getWidth()) {
										//alert(5);
										if (win.getEl().getY()
												- this.getHeight() >= mY
												&& win.getEl().getY()
														- this.getHeight()
														+ this.getHeight() <= mY
														+ mainPanel.getHeight()) {
											this.getEl().setY(win.getEl()
													.getY()
													- this.getHeight());
										}

									}
									
									// 左下角
									if (-win.getEl().getY()
											+ this.getEl().getY()
											+ this.getHeight() < f
											&& -win.getEl().getY()
											+ this.getEl().getY()
											+ this.getHeight() > 0
											&& this.getEl().getX() >= win
													.getEl().getX()
											&& this.getEl().getX() < win
													.getEl().getX()
													+ win.getEl().getWidth()) {
										//alert(5);
										if (win.getEl().getY()
												- this.getHeight() >= mY
												&& win.getEl().getY()
														- this.getHeight()
														+ this.getHeight() <= mY
														+ mainPanel.getHeight()) {
											this.getEl().setY(win.getEl()
													.getY()
													- this.getHeight());
										}

									}

									// 右下角
									if (this.getEl().getY() + this.getHeight()
											- win.getEl().getY() < f&&
											this.getEl().getY() + this.getHeight()
											- win.getEl().getY()>0
										
											&& this.getEl().getX()
													+ this.getWidth() > win
													.getEl().getX()
											&& this.getEl().getX()
													+ this.getWidth() <= win
													.getEl().getX()
													+ win.getEl().getWidth()) {
										//alert(6);
										if (win.getEl().getY()
												- this.getHeight() >= mY
												&& win.getEl().getY()
														- this.getHeight() <= mY
														+ mainPanel.getHeight()) {

											this.getEl().setY(win.getEl()
													.getY()
													- this.getHeight());

										}

									}
									
									// 右下角
									if (win.getEl().getY()-this.getEl().getY() - this.getHeight()
											 < f&&
											win.getEl().getY()-this.getEl().getY() - this.getHeight()>0
										
											&& this.getEl().getX()
													+ this.getWidth() > win
													.getEl().getX()
											&& this.getEl().getX()
													+ this.getWidth() <= win
													.getEl().getX()
													+ win.getEl().getWidth()) {
										//alert(6);
										if (win.getEl().getY()
												- this.getHeight() >= mY
												&& win.getEl().getY()
														- this.getHeight() <= mY
														+ mainPanel.getHeight()) {

											this.getEl().setY(win.getEl()
													.getY()
													- this.getHeight());

										}

									}

									// 判断左上角
									if (this.getEl().getX() >= win.getEl()
											.getX()
											&& this.getEl().getX() < win
													.getEl().getX()
													+ win.getEl().getWidth()
											&& this.getEl().getY() >= win
													.getEl().getY()
											&& this.getEl().getY() < win
													.getEl().getY()
													+ win.getEl().getHeight()) {

										alert("板子左上角与其他板子重叠");
										iscd = true;
										break;

									}// 判断左下角
									else if (this.getEl().getX() >= win.getEl()
											.getX()
											&& this.getEl().getX() < win
													.getEl().getX()
													+ win.getEl().getWidth()
											&& this.getEl().getY()
													+ this.getHeight() > win
													.getEl().getY()
											&& this.getEl().getY()
													+ this.getHeight() <= win
													.getEl().getY()
													+ win.getEl().getHeight()) {

										alert("板子左下角与其他板子重叠");
										iscd = true;
										break;

									}// 判断右上角
									else if (this.getEl().getX()
											+ this.getWidth() > win.getEl()
											.getX()
											&& this.getEl().getX()
													+ this.getWidth() <= win
													.getEl().getX()
													+ win.getEl().getWidth()
											&& this.getEl().getY() >= win
													.getEl().getY()
											&& this.getEl().getY() < win
													.getEl().getY()
													+ win.getEl().getHeight()) {

										alert("板子右上角与其他板子重叠");
										iscd = true;
										break;

									}// 判断右下角
									else if (this.getEl().getX()
											+ this.getWidth() > win.getEl()
											.getX()
											&& this.getEl().getX()
													+ this.getWidth() <= win
													.getEl().getX()
													+ win.getEl().getWidth()
											&& this.getEl().getY()
													+ this.getHeight() > win
													.getEl().getY()
											&& this.getEl().getY()
													+ this.getHeight() <= win
													.getEl().getY()
													+ win.getEl().getHeight()) {

										alert("板子右下角与其他板子重叠");
										iscd = true;
										break;

									}

									iscd = false;

								}

							}

						}
					}

				});

				mainPanel.add(panel);

				panel.show();

				panelList.push("panel" + windowId);

				windowId++;

				panel.getEl().on("dblclick", function(e) {
							var w = this.getWidth();
							var h = this.getHeight();
							panel.setWidth(h);
							panel.setHeight(w);
						});

			}
		});

	});

	tbar.add({
				text : "生成",
				handler : function() {
					
					if(panelList.length<=0){
						
						alert("你尚未添加任何面板,无法生成");
						return;
					}

					var result = {};
					for (var i = 0; i < panelList.length; i++) {

						if (Ext.getCmp("" + panelList[i])) {

							var win = Ext.getCmp("" + panelList[i]);

							if (result[win.name]) {
								result[win.name].push({
											x : win.getEl().getX() - mX,
											y : win.getEl().getY() - mY,
											width : win.getWidth(),
											height : win.getHeight()
										});

							} else {

								result[win.name] = [{
											x : win.getEl().getX() - mX,
											y : win.getEl().getY() - mY,
											width : win.getWidth(),
											height : win.getHeight()
										}];
							}

						}

					}

					console.log(result);
					
					ff(result);

				}

			});

	var win = Ext.create("Ext.window.Window", {

				title : '开料图绘制',
				items : mainPanel,
				draggable : false,
				modal : true,
				resizable : false,
				tbar : tbar
			});
	win.show();

	var mX = mainPanel.getEl().getX();

	var mY = mainPanel.getEl().getY();
}

function changeTwoDecimal(x) {
	var f_x = parseFloat(x);
	if (isNaN(f_x)) {
		alert('非数字');
		return false;
	}
	var f_x = Math.round(x * 10) / 10;

	return f_x;
}
