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
		$nutriscore = $product->product->nutriscore_grade;

		if(isset($array)){

			if($nutriscore == "a"){
				$nutriscore = '<span class="vegan">Nutriscore A<span class="icon-ok"></span></span>';
			}
			elseif($nutriscore == "b"){
				$nutriscore = '<span class="vegan">Nutriscore B<span class="icon-ok"></span></span>';
			}
			elseif($nutriscore == "c"){
				$nutriscore = '<span class="vegan">Nutriscore C<span class="icon-ok"></span></span>';
			}
			elseif($nutriscore == "d"){
				$nutriscore = '<span class="non-vegan">Nutriscore D<span class="icon-cancel"></span></span>';
			}
			elseif($nutriscore == "e"){
				$nutriscore = '<span class="non-vegan">Nutriscore E<span class="icon-cancel"></span></span>';
			}
			else {
				$nutriscore = '<span class="unknown">Nutriscore unknown<span class="icon-cancel"></span> </span>';
			}

			if (in_array("en:palm-oil", $array)) {
				$palmoil = '<span class="non-vegan"> Contains Palmoil<span class="icon-cancel"></span> </span>';
			}
			elseif (in_array("en:palm-oil-free", $array)) {
				$palmoil = '<span class="vegan"> No Palmoil<span class="icon-ok"></span> </span>';
			}
			else {
				$palmoil = '<span class="unknown"> Palmoil unknown<span class="icon-cancel"></span> </span>';
			}

			if (in_array("en:non-vegan", $array)) {
			    echo '<div class="animated fadeIn"><span class="non-vegan">"'.$name.'": Not vegan<span class="icon-cancel"></span> </span>'.$palmoil.$nutriscore.'<a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20is%20not%20vegan!%20-%Checked%with%20" class="btn-dark">Tweet</a></div>';
			}
			elseif (in_array("en:vegan-status-unknown", $array)) {
			    echo  '<div class="animated fadeIn"><span class="unknown">We are not sure if "'.$name.'" is vegan or not.<span class="icon-cancel"></span></span>'.$palmoil.$nutriscore.'<br><a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark">Edit product</a></div>';
			}
			elseif (in_array("en:vegan", $array)) {
				echo '<div class="animated fadeIn"><span class="vegan">"'.$name.'" is vegan<span class="icon-ok"></span> </span>'.$palmoil.$nutriscore.'<a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20is%20vegan!%20-%Checked%20with%20" class="btn-dark">Tweet</a></div>';
			}
			elseif ($response == "no code or invalid code"){
				echo '<div class="animated fadeIn"><span class="missing">This barcode is invalid.</span></div>';
			}
			else {
				echo '<div class="animated fadeIn"><span>This product is not in our database yet.</span><p class="missing">Do you want to add it? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Add this product at OpenFoodFacts</a>.</p></div>';
			}
		}
		else {
			echo '<div class="animated fadeIn"><span>We do not have enough info on this product yet.</span><p class="missing">Want to add info? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Edit this product at OpenFoodFacts</a>.</p></span></div>'; 
		}
	}
	else {
		echo '<div class="animated fadeIn"><span>This product is not in our database yet.</span><p class="missing">Do you want to add it? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Add this product at OpenFoodFacts</a>.</p></div>';
	}
}
?>