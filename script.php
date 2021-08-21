<?php
// Vegan: https://world.openfoodfacts.org/api/v0/product/4251105509585.json
// Vegan uknown: https://world.openfoodfacts.org/api/v0/product/4008638170726.json
// Not vegan: 5000159404259

$barcode = $_GET['barcode'];

$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode.'.json');

$character = json_decode($data);
$array = $character->product->ingredients_analysis_tags;

if (in_array("en:non-vegan", $array)) {
    echo "Not Vegan";
}
elseif (in_array("en:vegan-status-unknown", $array)) {
    echo "We're not sure.";
}
elseif (in_array("en:vegan", $array)) {
	echo "Vegan!";
}
else {
	echo "This product is not in our database yet.";
}
?>