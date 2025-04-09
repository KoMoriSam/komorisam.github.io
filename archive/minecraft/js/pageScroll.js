// 定义初始速度为1
var speed = 1;
// 判断是否按下Ctrl键
var isCtrlPressed = false;


// 设置监听器，监听 Ctrl 键按下和松开事件
document.addEventListener('keydown', function(e){
  if(e.key == "Control"){
    // 按下Ctrl键时设置为加速状态并将速度更新为5
    isCtrlPressed = true;
    speed = 10;
  }
});
document.addEventListener('keyup', function(e) {
  if(e.key == "Control"){
    // 松开Ctrl键时设置为普通状态并将速度更新为1
    isCtrlPressed = false;
    speed = 1;
  }
});

// 定义位置和计时器
var position = 0;
var timer = null;

// 定义滚动函数
function scroller() {
    // 根据速度的不同更新位置
    position += speed;
    scroll(0, position);
    clearTimeout(timer);
    // 设置计时器，控制滚动速度
    timer = setTimeout("scroller()", 20);
}

