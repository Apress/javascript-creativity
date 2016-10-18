var ele = document.querySelector('audio');

function log()  {
	for (var i = 0; i < ele.played.length; i++)
	{
	  console.log("Portion " + i);
	  console.log("  Start: " + ele.played.start(i)); 
	  console.log("  End: " + ele.played.end(i));
	}
}