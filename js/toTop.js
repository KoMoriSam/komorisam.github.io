const topBtn = document.getElementById('topBtn'),
header = document.getElementById('main');

function toTop() {
    header.scrollIntoView({behavior:'smooth'});
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
