/* Demo purposes only */
$(".hover").mouseleave(
    function () {
        $(this).removeClass("hover");
    }
);

function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    reveals.forEach((reveal) => {
        var windowHeight = window.innerHeight;
        var elementTop = reveal.getBoundingClientRect().top;
        var elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add("active");
        } else {
            reveal.classList.remove("active");
        }
    });
}
window.addEventListener("scroll", reveal);

$(".cs-cards figure").each(function () {
    $(this)
        .find("figcaption")
        .append("<img class='imgbghover' src='' />");
    var imgsrc = $(this)
        .find("img.card-img")
        .attr("src");
    $(this)
        .find(".imgbghover")
        .attr("src", imgsrc);
});

var btn = $('#button');

$(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: 0
    }, '300');
});
