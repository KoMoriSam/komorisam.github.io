const button_top = document.getElementById('button_top'),
header = document.getElementById('main');

function toTop() {
    header.scrollIntoView({behavior:'smooth'});
}

var pageHeight = window.innerHeight;
window.onscroll = function () {
    var backTop = document.documentElement.scrollTop ||
        document.body.scrollTop;
    if (backTop > pageHeight / 4) {
        button_top.classList.add('show-button_top');
    } else {
        button_top.classList.remove('show-button_top');
    }
}
