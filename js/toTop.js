var timer = null;
const topBtn = document.getElementById('topBtn');

function toTop() {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        var oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
            document.body.scrollTop = document.documentElement.scrollTop = oTop - 50;
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}

var pageHeight = window.innerHeight;
window.onscroll = function () {
    var backTop = document.documentElement.scrollTop ||
        document.body.scrollTop;
    if (backTop > pageHeight / 4) {
        topBtn.classList.add('topBtn-display');
    } else {
        topBtn.classList.remove('topBtn-display');
    }
}
