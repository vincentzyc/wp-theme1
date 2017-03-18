//页面元素加载动画
var allAnimation = (function() {
	function Animation(target, animation) {
		$(target).each(function() {
			if($(this).offset().top < $(window).height()) {
				$(this).css('animation', animation + ' 2s');
			} else {}
		});
		$(window).scroll(function() {
			var sTop = $(document).scrollTop();
			var wTop = $(window).height();
			$(target).each(function() {
				if($(this).offset().top - wTop < sTop) {
					$(this).css('animation', animation + ' 2s');
				} else {}
			});
		});
	};
	return {
		Animation: Animation,
	};
})();
//设置宽高相等
function hwEqual (target) {
	$(target).height($(target).width());
}

//显示大图
var bigimg = (function() {
	function Zoom(imgbox, hoverbox, l, t, x, y, h_w, h_h, showimg) {
		/*
		imgbox 当前图片区域
		hoverbox 鼠标移入区域
		l 当前图片左距离
		t 当前图片上距离
		x 鼠标距离X轴
		y 鼠标距离Y轴
		h_w 鼠标移入图片块宽度
		h_h 鼠标移入图片块高度
		showbox 展示大图区域
		*/
		var moveX = x - l - (h_w / 2); //鼠标区域距离
		var moveY = y - t - (h_h / 2); //鼠标区域距离
		//判断鼠标使其不跑出图片框
		moveX < 0 ? moveX = 0 : '';
		moveY < 0 ? moveY = 0 : '';
		moveX > imgbox.width() - h_w ? moveX = imgbox.width() - h_w : '';
		moveY > imgbox.height() - h_h ? moveY = imgbox.height() - h_h : '';
		//求图片比例
		var zoomX = showimg.width() / imgbox.width();
		var zoomY = showimg.height() / imgbox.height();
		//确定位置
		showimg.css({ left: -(moveX * zoomX), top: -(moveY * zoomY) });
		hoverbox.css({ left: moveX, top: moveY });
	};

	function Zoomhover(imgbox, hoverbox, showimg) {
		var l = imgbox.offset().left;
		var t = imgbox.offset().top;
		$(".probox img,.hoverbox").mouseover(function(e) {
			var w = hoverbox.width();
			var h = hoverbox.height();
			var x = e.pageX;
			var y = e.pageY;
			$(".hoverbox,.showbox").show();
			Zoom(imgbox, hoverbox, l, t, x, y, w, h, showimg);
		}).mousemove(function(e) {
			var w = hoverbox.width();
			var h = hoverbox.height();
			var x = e.pageX;
			var y = e.pageY;
			Zoom(imgbox, hoverbox, l, t, x, y, w, h, showimg);
		}).mouseout(function() {
			showimg.parent().hide();
			hoverbox.hide();
		})
	};
	return {
		Zoomhover: Zoomhover,
	};
})();

//tab切换
function changeTab(This) {
	var _this = This.parentNode;
	$(_this).addClass("active").siblings().removeClass('active');
	$(_this).parent().next().children('div').hide().eq($(_this).index()).show();
};

//小屏显示子菜单
function showmsubmenu(This, event) {
	event.stopPropagation();
	event.preventDefault();
	var _this = This.parentNode;
	$(_this).next('ul').slideToggle('fast', function() {
		This.innerHTML == '+' ? This.innerHTML = '-' : This.innerHTML = '+';
	});
};

//小图滚动插件
(function($) {
	$.fn.parallelRoll = function(options) {
		var opts = $.extend({}, $.fn.parallelRoll.defaults, options);
		var _this = this;
		var len = _this.find(opts.itemName).length;
		var autoRollTimer;
		var flag = true; // 防止用户快速多次点击上下按钮
		var arr = new Array();
		var item_w = $(opts.itemName).outerWidth(true);//计算元素的宽度  包括补白+边框
		console.log(item_w);
		var box_w = $(opts.boxName).outerWidth();

		//只有当  滚动层盒子宽度 大于 最外层盒子宽度 时才加载事件,否则不加载
		if(len * item_w > box_w) {
			_this[0].innerHTML += _this[0].innerHTML; //为不出现空白停顿   将滚动元素再赋值一次
			len = 2 * len; //同时赋值以后的滚动元素个数是之前的两倍  2 * len.
			_this.css({ width: (len * item_w) + len + 'px' }); // 设置滚动层盒子的宽度
			return this.each(function() {
				_this.closest(opts.boxName).hover(function() {
					clearInterval(autoRollTimer);
				}, function() {
					switch(opts.direction) {
						case 'left':
							autoRollTimer = setInterval(function() {
								left();
							}, opts.time);
							break;
						case 'right':
							autoRollTimer = setInterval(function() {
								right();
							}, opts.time);
							break;
						case 'none':
							clearInterval(autoRollTimer);
							break;
						default:
							alert('参数错误！');
							break;
					}
				}).trigger('mouseleave');
				$(opts.prev).on('click', function() {
					flag ? right() : "";
				});
				$(opts.next).on('click', function() {
					flag ? left() : "";
				});
			});
		} else {
			_this.css({ width: (len * item_w) + len + 'px' }); // 设置滚动层盒子的宽度
			$(opts.prev).hide();
			$(opts.next).hide();
		};

		function left() {
			flag = false;
			_this.animate({ marginLeft: -(item_w * opts.amount) }, 800, function() {
				_this.find(opts.itemName).slice(0, opts.amount).appendTo(_this);
				_this.css({ marginLeft: 0 });
				flag = true;
			});
		};

		function right() {
			flag = false;
			arr = _this.find(opts.itemName).slice(-opts.amount);
			for(var i = 0; i < opts.amount; i++) {
				$(arr[i]).css({ marginLeft: -item_w * (i + 1) }).prependTo(_this);
			}
			_this.animate({ marginLeft: item_w * opts.amount }, 800, function() {
				_this.find(opts.itemName).removeAttr('style');
				_this.css({ marginLeft: 0 });
				flag = true;
			});
		};
	};
	//插件默认选项
	$.fn.parallelRoll.defaults = {
		boxName: '.rollbox', //最外层盒子类名
		itemName: '.itemroll', //滚动元素(jq写法)
		time: 3000, //滚动间隔时间(毫秒)
		direction: 'left', // 滚动方向  right-->向右    left-->向左    none-->不滚动
		prev: '.prev', //上一张
		next: '.next', //下一张
		amount: 1 // 滚动数  默认是1
	};
})(jQuery);