<?php
// Vegan: https://world.openfoodfacts.org/api/v0/product/4251105509585.json
// Vegan uknown: https://world.openfoodfacts.org/api/v0/product/4008638170726.json
// Not vegan: 5000159404259

$barcode = $_POST['barcode'];

if (empty($barcode)){
	echo '<span class="animated fadeIn">Barcode-field cannot be empty.</span>';
}

else {
	$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode.'.json');
	$product = json_decode($data);
	$array = $product->product->ingredients_analysis_tags;
	$name = $product->product->product_name;
	if (in_array("en:non-vegan", $array)) {
	    echo '<span class="non-vegan animated fadeIn">"'.$name.'" is not Vegan.</span>';
	}
	elseif (in_array("en:vegan-status-unknown", $array)) {
	    echo  '<div class="animated fadeIn"><span class="unknown">We are not sure if "'.$name.'" is vegan or not.</span><br><p class="unknown">Do you know? <a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'">Edit this product at OpenFoodFacts</a>.</p></div>';
	}
	elseif (in_array("en:vegan", $array)) {
		echo  '<span class="vegan animated fadeIn">"'.$name.'" is Vegan!</span>';
	}
	else {
		echo '<div class="animated fadeIn"><span>This product is not in our database yet.</span><p class="missing">Do you want to add it? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Add this product at OpenFoodFacts</a>.</p></div>';
	}
}
?>