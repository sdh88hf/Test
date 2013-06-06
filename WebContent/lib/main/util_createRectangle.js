/**
 * 一个的 Arial 的字体的长宽比例 长宽比的话 2.5:4
 * 
 * @param width
 * @param height
 * @param 起始的点
 * @returns 需要构造成矩形的参数
 */
function createRectangle(width, height, start, bl,id) {

	var ws = "" + width;

	var lh = "" + height;

	start.x = start.x * bl;
	start.y = start.y * bl;

	width = width * bl;
	height = height * bl;

	var rectangle = {
		viewBox : false,
		items : [],
		width : width,
		height : height,
		focusOnToFront : true,
		x : start.x,
		y : start.y
	};
	rectangle.items.push({
				type : "path",
				"stroke-width" : "1",
				stroke : "black",
				path : "M0 0 L" + width + " 0 L" + width + " " + height
						+ " L0 " + height + " Z"
			});

	rectangle.items.push({
				type : 'text',
				text : ws,
				fill : 'green',
				font : '16px Arial',
				x : (width - ws.length * 10) / 2,
				y : 9
			});

	rectangle.items.push({
				type : 'text',
				text : lh,
				fill : 'green',
				font : '16px Arial',
				x : 4,
				y : (height - lh.length * 10) / 2,
				rotate : {
					degrees : 90
				}
			});

	if (width >= height) {
		rectangle.items.push({
					type : 'text',
					text : id,
					fill : 'green',
					font : '16px Arial',
					x : (width-(id+"").length) / 2,
					y : height / 2
				});
	} else {
		rectangle.items.push({
					type : 'text',
					text : id,
					fill : 'green',
					font : '16px Arial',
					x : width / 2,
					y : (height-(id+"").length) / 2,
					rotate : {
						degrees : 90
					}
				});
	}

	return rectangle;
}