<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Initr Demo</title>

	<link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/vendor/ui-darkness/jquery-ui-1.10.3.custom.css">
	<link rel="stylesheet" href="css/vendor/jquery.formit.css">
</head>
<body>

	<h1>Initr Demo</h1>

	<h2>$.fn - datepicker</h2>
	<input class="datepicker">

	<h2>$ - formIt</h2>
	<form action="./index.html" method="get">
		<p>
		    <input type="checkbox" name="checkbox-test" value="1" id="checkbox-test-1">
		    <label for="checkbox-test-1">default</label>
		</p>
		<p>
		    <input type="checkbox" name="checkbox-test" value="2" checked="checked" id="checkbox-test-2">
		    <label for="checkbox-test-2">checked</label>
		</p>
		<p>
		    <select name="select-test">
		        <option value="1">Option 1</option>
		        <option value="2">Another option</option>
		        <option value="3">Option three</option>
		        <option value="4">Something random</option>
		    </select>
		</p>
	</form>

	<h2>app - yourModule</h2>
	<div data-plugin="yourModule">Increase font size by 1px on click.</div>

	<h2>Anonymous dependency with selector</h2>
	<div class="your-selector">Make me blue on load.</div>

	<h2>Anonymous dependency with selector and validate function</h2>
	<ul class="another-selector">
		<li>One</li>
		<li>Two</li>
		<li>Three</li>
	</ul>


	<!-- Include jQuery -->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>

	<!-- Load our configuration variables -->
	<?php include 'config.php'; ?>

	<!--
		Inline script block so we can know in javascript if we are in production or dev.
		I prefer to put this on the `app` namespace to reduce global clutter.
	-->
	<script>
		(function(app) {
			app.IS_DEV = <?php echo $IS_DEV ? 'true' : 'false'; ?>;
		})(window.app || (window.app = {}));
	</script>

	<?php if ($IS_DEV): ?>

	<!--
		Development
		If we are in dev mode, load our core source script files.
	-->
	<script src="javascript/vendor/consoleshiv.js"></script>
	<script src="javascript/vendor/initr.js"></script>
	<script src="javascript/initr.config.js"></script>

	<?php else: ?>

	<!--
		Production
		If we are in production mode, load our concatenated and minified core file.
		Our one script to rule them all. Muahahaha.
	-->
	<script src="javascript/min/core.js"></script>

	<?php endif; ?>

</body>
</html>
