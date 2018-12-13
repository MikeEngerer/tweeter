const renderTweets = function(tweets) {
	tweets.forEach(function(e) {
		var $tweet = createTweetElement(e);
		$('#tweet-container').prepend($tweet);
	})
}

const toggleCompose = function () {
	$(".compose").click(function() {
		var $composeBox = $(".new-tweet")
		if ($composeBox.css("display") !== "none") {
			$composeBox.slideUp()
		} else {
			$composeBox.slideDown()
			$(".new-tweet textarea").focus()
		}
	})
}

const escape = function(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const createTweetElement = function(data) {
    var name = data.user.name,
    	avatar = data.user.avatars.small,
    	handle = data.user.handle,
    	text = data.content.text,
    	time = data.created_at,
    	layout = `<article> 
	    			<header>
	    				<img src="${escape(avatar)}" alt="avatar">
	        			<h3>${escape(name)}</h3>
	        			<h5>${escape(handle)}</h5>
	    			</header>
	    			<p>
	    				${escape(text)}
	   				</p>
	    			<footer>
	        			<h5>${escape(time)}</h5>
	    			</footer>
				  </article>`
	return layout;
}

const postTweet = function() {
	$("#post-tweet").on("submit", function(e) {
		e.preventDefault();
		let $rawText = $("textarea").val();
		let len = $rawText.length;
		let $error = $(".new-tweet div.error")
		if (len > 140) {
			$error.text("Tweet length exceeds maximum value!");
			$error.slideDown()
			if ($error.css("display") === "block") {
				$error.slideUp()
				$error.text("Tweet length exceeds maximum value!");
				$error.slideDown()
			}
		} else if (len === 0) {
			$error.text("Tweet must contain content!");
			$error.slideDown()
			if ($error.css("display") === "block") {
				$error.slideUp()
				$error.text("Tweet must contain content!");
				$error.slideDown()
			}
		} else {
			$error.slideUp()
			var $text = $("textarea").serialize()
			$.ajax({
			  	url: `/tweets/`,
			 	type: 'POST',
			 	data: $text,
			 	success: function(result) {
		 		loadTweets()
		 	}})
		 	$("textarea").val("")
		 	$("span.counter").text(140)
		}
	})
}

const loadTweets = function() {
		$.ajax({
			url: "/tweets/",
			type: "GET", 
			success: function(result) {
				renderTweets(result)
			}})
}

$(document).ready(function() {
	postTweet();
	loadTweets();
	toggleCompose();
})

