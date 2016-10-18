var ele = document.querySelector('audio');

function log()  {
	for (var i = 0; i < ele.buffered.length; i++)
	{
	  console.log("Portion " + i);
	  console.log("  Start: " + ele.buffered.start(i)); 
	  console.log("  End: " + ele.buffered.end(i));
	}
}