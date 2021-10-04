var paper = 0;
var write = 0;
var tool = 0;

//時間開始\結束\次數
var time_start = 0;
var time_mid = 0;
var time_diff = 0;
var times = 0;

var cont = 0;

//output
var target = {};

function start(th) {
	document.getElementById('tool_box').style.bottom = '0vh';

	paper = document.getElementById('paper');
	write = document.getElementById('write');

	paper.style.height = 'calc(100vh - 100px)';
	setTimeout(()=> reset(), 1000);

	tool = write.getContext('2d');

	//觸控
	prepare();

	th.setAttribute("onclick", "reset()");
	th.innerHTML = 'reset';

	document.getElementById('tool_box').innerHTML += '<div class="tool" onclick="output()">output</div>';
}

//reset
function reset() {
	write.width = paper.offsetWidth;
	write.height = paper.offsetHeight;

	//次數歸0
	times = 0;

	target = {};
	target['width'] = write.width;
	target['height'] = write.height;
}

//判斷是否已下筆
var write_down = 0;

//滑鼠
function change_color_d(x, y) {
	write_down = 1
	tool.moveTo(x, y);

	//次數\時間
	times += 1;
	time_start = new Date().getTime();
	time_diff = times == 1?0:time_start-time_mid;
	
	//cont
	cont = [[0, x, y]];

	// console.log(x, y, time_diff, times);
}
function change_color_u() {
	write_down = 0

	target[times] = {'time_diff': time_diff, 'cont': cont};

	// console.log(target);
}
function change_color_m(x, y) {
	if (write_down) {
		tool.lineTo(x, y);
		tool.stroke();//繪製

		//時間
		time_mid = new Date().getTime()

		//cont
		cont.push([time_mid-time_start, x, y]);

		// console.log(x, y, time_mid-time_start);
	}
}

//觸控
var paper_rect = 0;
var paper_left = 0;
var paper_top = 0;
function prepare(){
	write.addEventListener('touchstart', function (e) {
		// e.preventDefault();
		//觸控資訊
		paper_rect = paper.getBoundingClientRect();
		paper_left = paper_rect.x;
		paper_top = paper_rect.y;
		change_color_d(e.changedTouches[0].clientX-co_paper_left, e.changedTouches[0].clientY-co_paper_top);
	});
	write.addEventListener('touchend', function (e) {
		// e.preventDefault();
		change_color_u();
	});
	write.addEventListener('touchmove', function (e) {
		e.preventDefault();
		change_color_m(e.changedTouches[0].clientX-co_paper_left, e.changedTouches[0].clientY-co_paper_top);
	});
}

//output
function output() {
	target['times'] = times;
	console.log(target);

	//target_online
	var target_on = JSON.stringify(target);
	var blob_target_on = new Blob([target_on], {type: "text/plain;charset=utf-8"});
	saveAs(blob_target_on, "target_on.json");

	//target_offline
	var write = document.getElementById("write");
	write.toBlob(function(blob) {
		saveAs(blob, "target_off.png");
	});
}
$.ajax({
        type: 'POST',
        url: "train.py",
        data: {param: target}, //passing some input here
        dataType: "text",
        success: function(response){
           output = response;
           alert(output);
        }
}).done(function(data){
    console.log(data);
    alert(data);
});