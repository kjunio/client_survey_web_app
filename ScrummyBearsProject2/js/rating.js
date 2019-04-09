
function onload(event) {
var starRating = raterJs( {
		element:document.querySelector("#rater"), 
		rateCallback:function rateCallback(rating, done) {
			this.setRating(rating); 
			done(); 
		}, 
		onHover:function(currentIndex, currentRating) {
			document.querySelector('.live-rating').textContent = currentIndex; 
		}, 
		onLeave:function(currentIndex, currentRating) {
			document.querySelector('.live-rating').textContent = currentRating; 
		}
	}); 
}
window.addEventListener("load", onload, false); 