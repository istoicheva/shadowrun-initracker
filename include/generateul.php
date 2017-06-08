<?php				
# ?players=5 or ?players=name1,name2,name3
$get_input = htmlspecialchars($_GET['players']); // Get GET requests and parse it into html
$is_names = FALSE;		// Names in request (FALSE by default)
$has_cookies = FALSE;	// Cookies present (FALSE by default)

// Was there a GET request
if (isset($_GET['players'])) {
	
	if (is_numeric($get_input)) {	// Was it a number?
		$field = $get_input;
	} else {
		$is_names = TRUE;	// If not a number, treat everything else like names
		$arr_names = explode(",", $get_input);
		$field = count($arr_names);
	}

// No GET request
} else {

	// Are there cookies?
	if( isset( $_COOKIE['total_fields'] ) && ($_COOKIE['total_fields'] > -1)) {
		
		// This should never return -1 but it is possible, so just in case to not break anything
		$field = $_COOKIE['total_fields'] + 1;
		$has_cookies = TRUE;
		$cookie_lines = $_COOKIE;
		foreach ($cookie_lines as $key => $value) {
			if (!is_numeric($key)) {
				unset($cookie_lines[$key]);
			}
		}
		$cookie_entries;
		foreach ($cookie_lines as $key => $value) {
			$temp_arr = explode(",", $value);
			$cookie_entries[] = $temp_arr;
		}

	// No cookies or GET request, turn to default
	} else {
		$field = 7;	// Default set value
	}

}



for ($i=0; $i < $field; $i++) { 

	$li_classes = "ini-line";
	$type_class = "fa fa-globe";
	$character;
	$inivalue = 0;
	$fulldeff = "";
	$notes;

	if ($is_names) {
		$character = $arr_names[$i];
	} else if ($has_cookies) {
		
		$li_classes = $cookie_entries[$i][0];
		$type_class = $cookie_entries[$i][1];
		$character = $cookie_entries[$i][2];
		$inivalue = $cookie_entries[$i][3];
		if ($cookie_entries[$i][4] == 1) {
			$fulldeff = "checked";
		} else {
			$fulldeff = "";
		}
		$notes = $cookie_entries[$i][5];

	} else {
		$character = 'Character '. $i;
	}

	echo '<li class="' . $li_classes . '"><span class="location"><i class="' . $type_class . '"></i></span><span class="ininame editable">' . $character . '</span><span class="inivalue editable">' . $inivalue . '</span><span class="inibuttons"><button class="tookturn">Acted</button><button class="remove">Remove</button><button class="deduct5">-5</button><button class="deduct10">-10</button><span><span class="tickbox fulldefence"><input type="checkbox" name="fulldef" ' . $fulldeff . '></span><span class="notes"><input type="text" class="notes" placeholder="Notes" value="' . $notes . '"/></span></li>';
}