<?php
	$debug = isset($_REQUEST['debug']);
?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>XPath Expression Tester</title>
		<meta name="description" content="Online XPath Expression tester with detailed result set info and the ability to set the XPath expression context." />
		<meta name="author" content="Mike Scalora" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
		<link class="skin" href="style.css" rel="stylesheet" type="text/css">
		<link class="skin" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/ui-lightness/jquery-ui.css" rel="stylesheet" type="text/css">		
		<link href="fav.png" rel="shortcut icon">
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:200,600' rel='stylesheet' type='text/css'>
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name = "viewport" content = "initial-scale = 1.0, user-scalable = no">
	</head>
	<body class='<?php if ($debug) echo "debug"; ?>'>
		<div id='header'>
			<div id='title'>
				XPath Workshop - Visualization &amp; Testing
				<div id='sig'>
					by Mike Scalora
				</div>
			</div>
		</div>
		<div id='root'>
			<div id='tl-container' class='container top-container left-container'>
				<div id='in-label' class='label'>Input XML Test Document<div class='message-container'><div class='message'><span class='marker'></span><div class='details'></div></div></div></div>
				<textarea id='in' class='section rw-section'>
<items>
	<item id='bob1' url='root'>def</item>
	<item ref='bob2' url='leaf'>ref</item>
	<item>ref</item>
	<item></item>
	<item ref='bob2' url='leaf'></item>
	<item/>
	<item ref='bob3' url='leaf'/>
	<item><hr/><hr/><hr/></item>
	<item><hr/>test<hr/></item>	
</items>
				</textarea>
			</div>
			<div id='bl-container' class='container bottom-container left-container'>
				<div id='xpath-label' class='label'>XPath Expressions <span class='tag'>One per line, relative to the result of the context expression</span></div>
				<textarea id='xpath' class='section' autofocus="autofocus">item/text()|//@*|item</textarea>
				<div id='buttons'>
					<button id='eval'>Eval</button>
					<button id='save' title='Save the Input XML, XPath and Context expressions'>Save</button>
					<button id='load' title='Load previously saved values'>Load</button>
					<button id='reset' title='Reset to the values when the page loaded'>Reset</button>
				</div>
			</div>
			<div id='tr-container' class='container top-container right-container'>
				<div id='out-label' class='label'>Results</div>
				<div id='out' class='section ro-section' contenteditable="true"></div>
			</div>
			<div id='br-container' class='container bottom-container right-container'>
				<div id='context-label' class='label'>Context XPath Expression <span class='tag'>Sets the context (starting point) for the other expressions</span></div>
				<textarea id='context' class='section'></textarea>
				<div id='controls'>
					<div id='controls-bar'>
						<div id='controls-strip'>
							<div id='font-size-area'>
								Font size: <span id='font-size'></span><div id='font-slider'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id='pos-container'><div id='pos-control'>⇄</div></div>
		</div>
	</body>
	<script src="logic.js"></script>
</html>
