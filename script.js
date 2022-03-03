var paper = 0;
var write = 0;
var tool = 0;

// 時間
var time_mid = 0;

// output
var target = {};
var stroke = [];
var cont = NaN;

var sym = 0;
window.onload = function() {
	//網址
	sym = 0;
	if (location.search) {
		var paras = location.search.substr(1).split('&')[0].split('=');
		sym = paras[0]=='sym'?paras[1]:0;
	}
	change_sym(sym);

	//object
	paper = document.getElementById('paper');
	write = document.getElementById('write');
	tool = write.getContext('2d');

	reset();

	// 觸控
	prepare();
}

// change_sym
function change_sym(sym) {
	sym = parseInt(sym)
	switch(sym) {
		case 0:
			sym_text = '$ \\displaystyle \\frac{\\pi}{2} + 2k\\pi $';
			break;
		//beta function
		case 1:
			sym_text = '$ \\displaystyle \\int_0^1 t^{x-1}(1-t)^{y-1} \\, \\mathrm{d}t $';
			break;
		//gamma function
		case 2:
			sym_text = '$ \\displaystyle \\int_0^\\infty t^{z-1}e^{-t} \\, \\mathrm{d}t	$';
			break;

		case -1:
			sym_text = 'thanks for writing';
			break;
		default:
			sym_text = 'sym range(0~2)';
	}
	document.getElementById('symbow').innerHTML = sym_text;
}

function next_sym() {
	sym = parseInt(sym)
	if (sym < 2 && sym > -2) {
		window.location.href = '?sym='+String(sym+1);
	}
	else {
		window.location.href = '?sym='+String(-1);
	}
}

// reset
function reset() {
	write.width = paper.offsetWidth-20;
	write.height = paper.offsetHeight-20;

	tool.lineWidth = 4;

	// 歸0
	target = {};
	stroke = [];
}

// 判斷是否已下筆
var write_down = 0;

// 滑鼠
function change_color_d(x, y) {
	write_down = 1
	tool.moveTo(x, y);

	// 時間
	time_mid = new Date().getTime();
	
	// cont
	cont = [[x, y, time_mid]];
}
function change_color_u() {
	write_down = 0

	stroke.push(cont);

	// console.log(target);
}
function change_color_m(x, y) {
	if (write_down) {
		tool.lineTo(x, y);
		tool.stroke();// 繪製

		// 時間
		time_mid = new Date().getTime()

		// cont
		cont.push([x, y, time_mid]);
	}
}

// 觸控
var paper_rect = 0;
var paper_left = 0;
var paper_top = 0;
function prepare(){
	write.addEventListener('touchstart', function (e) {
		// e.preventDefault();
		// 觸控資訊
		paper_rect = paper.getBoundingClientRect();
		paper_left = paper_rect.x;
		paper_top = paper_rect.y;
		change_color_d(e.changedTouches[0].clientX-paper_left, e.changedTouches[0].clientY-paper_top);
	});
	write.addEventListener('touchend', function (e) {
		// e.preventDefault();
		change_color_u();
	});
	write.addEventListener('touchmove', function (e) {
		e.preventDefault();
		change_color_m(e.changedTouches[0].clientX-paper_left, e.changedTouches[0].clientY-paper_top);
	});
}

// output
function output() {
	target['name'] = sym;
	target['stroke'] = stroke;
	// console.log(target);

	// target
	var target_on = JSON.stringify(target);
	var blob_target_on = new Blob([target_on], {type: "text/plain;charset=utf-8"});
	saveAs(blob_target_on, "sym_"+String(sym)+".json");
}