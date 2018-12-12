$(document).ready(function() {
  	$(".new-tweet textarea").keyup(function(e) {
  		var len = $(this).val().length
  		$("span.counter").text(140 - len)
  		if ($("span.counter").text() < 0 && !$("span.counter").hasClass("red-text")) {
			$("span.counter").attr("class", "counter red-text")
		} else if ($("span.counter").text() >= 0 && $("span.counter").hasClass("red-text")) {
			$("span.counter").attr("class", "counter")
		}
  	})
});
