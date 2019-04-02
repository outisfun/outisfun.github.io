<!DOCTYPE html>
<html lang="en" class="no-js">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Experimental map navigation</title>
		<link href="https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,500" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body class = "xpr">
		<div class = "xpr__container">
			<div class = "xpr-map">
	            <div class = "surface-container">
	                <svg version="1.1" class = "surface" id="theSVG" viewBox="0 0 800 800" width="7000" height="2500" xml:space="preserve">
	                    <defs>
	                    <mask id="masker">
	                        <rect class="gradientBox" fill="url(#theGradient)" x="0" y="0" width="7000" height="2500"/>
	                    </mask>

	                    <pattern id="guy" patternUnits="userSpaceOnUse" width="7000" height="2500">
	                        <image xlink:href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/314556/scienceGuy.jpg" x="0" y="0" width="800" height="800" />
	                    </pattern>

	                    <lineargradient id="theGradient" gradientUnits="userSpaceOnUse" x1="0" y1="400" x2="7000" y2="2500">
	                        <stop  offset="0" style="stop-color:#000000"/>
	                        <stop  offset="1" style="stop-color:#ffffff"/>
	                    </lineargradient>

	                    </defs>
	                      
	                    <g mask="url(#masker)">
	                    <rect id="theImage" width="7000" height="2500" x="0" y="0" fill="url(#guy)" />
	                    </g>

	                </svg>
	            </div>
	            <!-- <div class = "surface" style = "background-image: url('../../preview/assets/bowie2.jpg')"></div> -->
	            <div class = "xpr-map__loc" data-xcrd = "22" data-ycrd = "54" data-ttl = "Narcissus" data-target = "Bluebell">

	            	<div class = "xpr-map__loc__center">
	            		<h1>22 / 54 / Narcissus (to Bluebell)</h1>
	                	<a href = "#" class = "xpr-map__loc__explore">explore</a>
	                	<a href = "#" class = "xpr-map__loc__nav">navigate</a>
	            	</div>
	            	<div class = "xpr-map__loc__el">
	            		<h1>You know how this ends.</h1>
	            	</div>
	                
	            </div>
	            <div class = "xpr-map__loc" data-xcrd = "12" data-ycrd = "14" data-ttl = "Orchid" data-target = "Anemone">
	                
	            	<div class = "xpr-map__loc__center">
	            		<h1>12 / 14 / Orchid (to Anemone)</h1>
	                	<a href = "#" class = "xpr-map__loc__explore">explore</a>
	                	<a href = "#" class = "xpr-map__loc__nav">navigate</a>
	            	</div>
	            	<div class = "xpr-map__loc__el">
	            		<h1>You know how this ends.</h1>
	            	</div>
	            </div>
	            <div class = "xpr-map__loc" data-xcrd = "50" data-ycrd = "50" data-ttl = "Bluebell" data-target = "Orchid">
	                <div class = "xpr-map__loc__center">
	            		<h1>50 / 50 / Bluebell (to Orchid)</h1>
	                	<a href = "#" class = "xpr-map__loc__explore">explore</a>
	                	<a href = "#" class = "xpr-map__loc__nav">navigate</a>
	            	</div>
	            	<div class = "xpr-map__loc__el">
	            		<h1>You know how this ends.</h1>
	            	</div>
	            </div>
	            <div class = "xpr-map__loc" data-xcrd = "80" data-ycrd = "65" data-ttl = "Anemone" data-target = "Petunia">
	                <div class = "xpr-map__loc__center">
	            		<h1>80 / 65 / Anemone (to Petunia)</h1>
	                	<a href = "#" class = "xpr-map__loc__explore">explore</a>
	                	<a href = "#" class = "xpr-map__loc__nav">navigate</a>
	            	</div>
	            	<div class = "xpr-map__loc__el">
	            		<h1>You know how this ends.</h1>
	            	</div>
	            </div>
	            <div class = "xpr-map__loc" data-xcrd = "30" data-ycrd = "20" data-ttl = "Petunia" data-target = "Narcissus">
	                <div class = "xpr-map__loc__center">
	            		<h1>30 / 20 / Petunia (to Narcissus)</h1>
	                	<a href = "#" class = "xpr-map__loc__explore">explore</a>
	                	<a href = "#" class = "xpr-map__loc__nav">navigate</a>
	            	</div>
	            	<div class = "xpr-map__loc__el">
	            		<h1>You know how this ends.</h1>
	            	</div>
	            </div>
	        </div>
		</div>
		<script src="script.js"></script>
	</body>
</html>
