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
	    echo '<span class="non-vegan">"'.$name.'" is most likely not Vegan.</span>';
	}
	elseif (in_array("en:vegan-status-unknown", $array)) {
	    echo  '<span class="unknown">We are not sure if "'.$name.'" is vegan or not.</span>';
	}
	elseif (in_array("en:vegan", $array)) {
		echo  '<span class="vegan">'.$name.'" is Vegan!</span>';
	}
	else {
		echo "This product is not in our database yet.";
	}
}
?>