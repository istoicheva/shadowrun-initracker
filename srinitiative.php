<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Shadowrun 5th Edition Initiative Tool</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="css/sr-style.css">
		<script src="//code.jquery.com/jquery-1.10.2.js"></script>
		<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
		<script src="js/jquery.cookie.js"></script>
		<script src="js/jquery_functions.js"></script>
	</head>
	<body>

	<?php if (!isset( $_COOKIE['total_fields'] )) : ?>
		<div class="box warning">Chummer, save button creates a cookie with the information from the table so you can load it for later. You can clean all the cookies created by this page with the Purge button.</div>
	<?php endif; ?>
		<div id="newentry">
			<h2>New Participant:</h2>
			<input class="newename" type="text" placeholder="Name"/> <input type="number" class="newini" placeholder="0"/> <button class="addnew">Add</button>
		</div>

		<div class="box">
			<h2 class="box-header">Initiative Tracker</h2>
			<div class="table-header">
				<span class="head-place">Type</span><span class="head-name">Character</span><span class="head-ini">Init</span><span class="head-options">Options</span><span class="head-def">Def</span>
			</div>
			<ul id="inilist">
				<?php include_once ('include/generateul.php'); ?>
			</ul>
			<button id="switchalltypes" class="default">Switch All Types</button>
			<button id="sort">Sort Initiative</button>
			<button id="endpass">End Pass</button>
			<button id="clear">End Turn / Clear</button>
			<button id="save" alt="Creates a cookies with the above infomation.">Save</button>
			<button id="purge" alt="Removes all cookies created by this page.">Purge</button>
		</div>

		<div class="box" id="toggleButtonLine">
			<h2 class="box-header">Combat Related Tables</h2>
			<button id="btn-iniformulas">Initiative Formulas</button>
			<button id="btn-actioncombat">Combat Actions</button>
			<button id="btn-actionmatrix">Matrix Actions</button>
		</div>

		<div class="box hide" id="iniformulas-box">
		<?php include_once('include/iniformulas.php'); ?>
		</div>

		<div class="box hide" id="action-combat-box">
		<?php include_once('include/actionslist-combat.php'); ?>
		</div>

		<div class="box hide" id="action-matrix-box">
		<?php include_once('include/actionslist-matrix.php'); ?>
		</div>
	</body>
</html>