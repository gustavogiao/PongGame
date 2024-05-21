var profile = document.getElementsByClassName('container')[0];
setInterval(function(){
	var rand = Math.floor((Math.random() * 21) + 1);
	var size = (Math.random() * 4) + 0;
	var randAnim = Math.floor((Math.random() * 3) + 1);
	var length = Math.floor((Math.random() * 5) + 3);
	var bubble = document.createElement('div');
	bubble.offsetLeft = profile.offsetLeft + rand;
	bubble.className = "bubble";
	bubble.id = "bubble";
			bubble.style.width = size + "vw";
	bubble.style.height = size + "vw";
	bubble.style.marginLeft = rand + "vw";
	bubble.style.animation="bubble" + randAnim + " " + length + "s ease forwards";
	document.getElementsByClassName('bubbler')[0].appendChild(bubble);

	},800);
