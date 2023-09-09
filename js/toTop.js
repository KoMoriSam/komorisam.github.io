var timer = null;

function toTop() {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        var oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
            document.body.scrollTop = document.documentElement.scrollTop = oTop - 24;
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}

var pageHeight = 700;
window.onscroll = function () {
    var backTop = document.documentElement.scrollTop ||
        document.body.scrollTop;
    if (backTop > pageHeight) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
}
