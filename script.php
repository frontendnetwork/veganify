<?php
// Vegan: https://world.openfoodfacts.org/api/v0/product/4251105509585.json
// Vegan uknown: https://world.openfoodfacts.org/api/v0/product/4008638170726.json
// Not vegan: 5000159404259

$barcode = $_POST['barcode'];

if (empty($barcode)){
	echo "Please enter a valid barcode.";
}

else {
	$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode.'.json');
	$product = json_decode($data);
	$array = $product->product->ingredients_analysis_tags;
	$name = $product->product->product_name;
	if (in_array("en:non-vegan", $array)) {
	    echo '"'.$name.'" is most likely not Vegan';
	}
	elseif (in_array("en:vegan-status-unknown", $array)) {
	    echo  'We are not sure if "'.$name.'" is vegan or not.';
	}
	elseif (in_array("en:vegan", $array)) {
		echo  '"'.$name.'" is Vegan!';
	}
	else {
		echo "This product is not in our database yet.";
	}
}
?>