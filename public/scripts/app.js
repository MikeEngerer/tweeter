const charCounter = function() {
	$(".new-tweet textarea").keyup(function(e) {
		let $counter = $("span.counter");
		let len = $(this).val().length;
		$counter.text(140 - len);
		if ($counter.text() < 0 && !$counter.hasClass("red-text")) {
			$counter.attr("class", "counter red-text");
		} else if ($counter.text() >= 0 && $counter.hasClass("red-text")) {
			$counter.attr("class", "counter");
		}
	})
}

const renderTweets = function(tweets) {
	tweets.forEach(function(e) {
		let $tweet = createTweetElement(e);
		$('#tweet-container').prepend($tweet);
	});
};

const loadTweets = function() {
		$.ajax({
			url: "/tweets/",
			type: "GET", 
			success: function(result) {
				renderTweets(result)
			}});
};

const renderNewest = function(tweets) {
	let $tweet = createTweetElement(tweets[tweets.length - 1]);
	$('#tweet-container').prepend($tweet);
};

const loadNewest = function () {
		$.ajax({
			url: "/tweets/",
			type: "GET", 
			success: function(result) {
				renderNewest(result)
			}});
	return result;
}

const toggleCompose = function () {
	$(".compose").click(function() {
		let $composeBox = $(".new-tweet");
		if ($composeBox.css("display") !== "none") {
			$composeBox.slideUp();
		} else {
			$composeBox.slideDown();
			$(".new-tweet textarea").focus();
		}
	});
};

const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function(data) {
    let name = data.user.name,
    	avatar = data.user.avatars.small,
    	handle = data.user.handle,
    	text = data.content.text,
    	time = data.created_at,
    	calcTime = (Math.floor((Date.now() - time) / 1000)),
    	timeAgo;

    if (calcTime < 60) {
    	timeAgo = calcTime + " seconds";
    } else if (calcTime < 3600) {
    	timeAgo = Math.floor(calcTime / 60) + " minutes";
    } else if (calcTime < 86400) {
    	timeAgo = Math.floor(calcTime / 3600) + " hours";
    } else if (calcTime < 31536000) {
    	timeAgo = Math.floor(calcTime / 86400) + " days";
    } else if (calcTime > 31536000) {
    	timeAgo = Math.floor(calcTime / 31536000) + " years";
    }

    let layout = `<article> 
	    			<header>
	    				<img src="${escape(avatar)}" alt="avatar">
	        			<h3>${escape(name)}</h3>
	        			<h5>${escape(handle)}</h5>
	    			</header>
	    			<p>
	    				${escape(text)}
	   				</p>
	   				<div>
	    			<footer>
	        			<h5>${escape(timeAgo)} ago</h5>
		        			<i class="fas fa-flag"></i>
		        			<i class="fas fa-retweet"></i>
		        			<i class="fas fa-thumbs-up"></i>
	    			</footer>
	    			</div>
				  </article>`;
	return layout;
}

const postTweet = function() {
	$("#post-tweet").on("submit", function(e) {
		e.preventDefault();
		let $rawText = $("textarea").val();
		let len = $rawText.length;
		let $error = $(".new-tweet div.error");
		if (len > 140) {
			if ($error.css("display") === "block") {
				$error.slideUp(function() {
					$error.text("Tweet length exceeds maximum value!");
					$error.slideDown();
				})
			} else {
				$error.text("Tweet length exceeds maximum value!");
				$error.slideDown();
			}
		} else if (len === 0) {
			if ($error.css("display") === "block") {
				$error.slideUp(function() {
					$error.text("Tweet must contain content!");
					$error.slideDown();
				})
			} else {
				$error.text("Tweet must contain content!");
				$error.slideDown();
			}
		} else {
			$error.slideUp()
			let $text = $("textarea").serialize();
			$.ajax({
			  	url: `/tweets/`,
			 	type: 'POST',
			 	data: $text,
			 	success: function(result) {
		 		loadNewest();
		 	}})
		 	$("textarea").val("");
		 	$("span.counter").text(140);
		}
	});
};

$(document).ready(function() {
	postTweet();
	loadTweets();
	toggleCompose();
	charCounter();
});

