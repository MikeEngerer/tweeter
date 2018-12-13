// Keeps track of character count and adds red-text class to counter if len > 140
const charCounter = function() {
	$(".new-tweet textarea").keyup(function(e) {
		let $counter = $("span.counter");
		let len = $(this).val().length;
		// Sets char count as user types
		$counter.text(140 - len);
		// if count falls below 0, text changes to red via adding red-text class
		// class removed when user reverts to > 0
		if ($counter.text() < 0 && !$counter.hasClass("red-text")) {
			$counter.attr("class", "counter red-text");
		} else if ($counter.text() >= 0 && $counter.hasClass("red-text")) {
			$counter.attr("class", "counter");
		}
	})
}
// called by loadTweets to render result (all tweets) from db following GET "/"
// each tweet is prepended as to display them newest first
const renderTweets = function(tweets) {
	tweets.forEach(function(e) {
		let $tweet = createTweetElement(e);
		$('#tweet-container').prepend($tweet);
	});
};
// calls renderTweets to display all tweets on page load (doc.ready)
const loadTweets = function() {
		$.ajax({
			url: "/tweets/",
			type: "GET", 
			success: function(result) {
				renderTweets(result)
			}});
};
// called by loadNewest
// this function prepends newest tweet following POST (postTweet) and subsequent GET (loadNewest)
// needed in order to prevent loading all tweets on new post (causes duplication of already loaded tweets)
const renderNewest = function(tweets) {
	let $tweet = createTweetElement(tweets[tweets.length - 1]);
	$('#tweet-container').prepend($tweet);
};
// called by postTweet when a new tweet is composed and posted; only gets newest tweet rather than entire db
const loadNewest = function () {
		$.ajax({
			url: "/tweets/",
			type: "GET", 
			success: function(result) {
				renderNewest(result)
			}});
	return result;
}
// controls compose button
const toggleCompose = function () {
	// on compose button click, if compose box is already hidden it slides up; else, slides down
	// and cursor is focused to form textarea
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
// prevent cross site scripting; effectively escapes characters; called by createTweetElement at textarea
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
// apply user data and input to html skeleton for insertion as article into the new tweet section
const createTweetElement = function(data) {
    let name = data.user.name,
    	avatar = data.user.avatars.small,
    	handle = data.user.handle,
    	text = data.content.text,
    	time = data.created_at,
    	calcTime = (Math.floor((Date.now() - time) / 1000)),
    	timeAgo;
    // determines time ago for tweet loading, converts to s, min, hour, day, year and
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
    //html skeleton to be inserted into index.html
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
	//returns processed skeleton
	return layout;
}
// ajax post request of new tweet
const postTweet = function() {
	$("#post-tweet").on("submit", function(e) {
		e.preventDefault();
		let $rawText = $("textarea").val();
		let len = $rawText.length;
		let $error = $(".new-tweet div.error");
		// highly convoluted way to check if error is true, and slideup/down error 
		// message depending on current state.....needs refactoring 
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
		// if error does not exist, tweet is posted and loaded to the page via loadNewest()
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
// after loading other page files (html/css/etc), tweets are loaded and functionality begins
$(document).ready(function() {
	postTweet();
	loadTweets();
	toggleCompose();
	charCounter();
});

