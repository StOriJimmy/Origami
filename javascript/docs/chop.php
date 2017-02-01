<?php include 'header.php';?>

<section id="chop">
	<h2>Chopping</h2>
	<div class="accordion">
		<p>Avoid crossing lines. Get the the X &amp; Y of the intersection:</p>
	</div>

	<div class="centered">
		<pre><code>graph.<span class="token function">chop</span>()</code></pre>
	</div>

	<div class="centered p5sketch" id="divTest06"></div>
	<p class="quote">press and hold</p>

	<div class="centered">
		<pre><code>graph.<f>edgesIntersect</f>(<span class="token argument" id="spanEdgeIntersect1"> edge1</span>,<span class="token argument" id="spanEdgeIntersect2"> edge2 </span>)</code></pre>
	</div>
	<p>the goal is to turn any overlapping lines into segments, adding the point of intersection between them</p>
</section>

<section id="chop">
	<div class="centered p5sketch" id="divTest07"></div>
</section>

<script language="javascript" type="text/javascript" src="../tests/06_chop.js"></script>
<script language="javascript" type="text/javascript" src="../tests/07_chop_many.js"></script>
<script>
	$(".accordion-title").html("MORE");
	var p506 = new p5(test06, 'divTest06');
	var p507 = new p5(test07, 'divTest07');

	$("#spanEdgeIntersect1").mouseenter(function(){ p506.setHighlight1(true); })
	                        .mouseleave(function(){ p506.setHighlight1(false); });
	$("#spanEdgeIntersect2").mouseenter(function(){ p506.setHighlight2(true); })
	                        .mouseleave(function(){ p506.setHighlight2(false); });

	p506.mouseMovedCallback = function(x,y){
		if(x == undefined || y == undefined){
			$("#spanNearest1MouseX").html('x');
			$("#spanNearest1MouseY").html('y');
		}else{
			$("#spanNearest1MouseX").html(x.toFixed(2));
			$("#spanNearest1MouseY").html(y.toFixed(2));
		}
	};
	p507.mouseMovedCallback = function(x,y){
		if(x == undefined || y == undefined){
			$("#spanNearest2MouseX").html('x');
			$("#spanNearest2MouseY").html('y');
		}else{
			$("#spanNearest2MouseX").html(x.toFixed(2));
			$("#spanNearest2MouseY").html(y.toFixed(2));
		}
	};
	p508.mouseMovedCallback = function(x,y){
		if(x == undefined || y == undefined){
			$("#spanNearest3MouseX").html('x');
			$("#spanNearest3MouseY").html('y');
		}else{
			$("#spanNearest3MouseX").html(x.toFixed(2));
			$("#spanNearest3MouseY").html(y.toFixed(2));
		}
	};
</script>

<?php include 'footer.php';?>