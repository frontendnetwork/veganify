<?php
if (empty($barcode)){
	echo '<span class="animated fadeIn">Barcode-field cannot be empty or include special characters.</span>';
}

else {
	$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode);
	$product = json_decode($data);


	if (!empty($product->product)) {
		$array = $product->product->ingredients_analysis_tags;
		$name = $product->product->product_name;
		$response = $product->status_verbose;

		if (in_array("en:non-vegan", $array)) {
		    echo '<div class="animated fadeIn"><span class="non-vegan">"'.$name.'" is not vegan.</span><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20is%20not%20vegan!%20-%Checked%with%20" class="btn-dark">Tweet</a></div>';
		}
		elseif (in_array("en:vegan-status-unknown", $array)) {
		    echo  '<div class="animated fadeIn"><span class="unknown">We are not sure if "'.$name.'" is vegan or not.</span><br><a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark">Edit product</a></div>';
		}
		elseif (in_array("en:vegan", $array)) {
			echo '<div class="animated fadeIn"><span class="vegan">"'.$name.'" is vegan!</span><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20is%20vegan!%20-%Checked%20with%20" class="btn-dark">Tweet</a></div>';
		}
		elseif ($response == "no code or invalid code"){
			echo '<div class="animated fadeIn"><span class="missing">This barcode is invalid.</span></div>';
		}
		else {
			echo '<div class="animated fadeIn"><span>This product is not in our database yet.</span><p class="missing">Do you want to add it? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Add this product at OpenFoodFacts</a>.</p></div>';
		}
	}
	else {
		echo '<div class="animated fadeIn"><span>This product is not in our database yet.</span><p class="missing">Do you want to add it? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Add this product at OpenFoodFacts</a>.</p></div>';
	}
}
?>