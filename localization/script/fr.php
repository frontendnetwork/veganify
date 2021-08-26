<?php
if (empty($barcode)){
	echo '<span class="animated fadeIn">Le champ ne peut pas être vide.</span>';
}

else {
	$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode.'.json');
	$product = json_decode($data);
	$array = $product->product->ingredients_analysis_tags;
	$name = $product->product->product_name;
	if (in_array("en:non-vegan", $array)) {
	    echo "<span class=\"non-vegan animated fadeIn\">".$name." n'est pas végétalien.</span>";
	}
	elseif (in_array("en:vegan-status-unknown", $array)) {
	    echo  '<div class="animated fadeIn"><span class="unknown">Je ne sais pas si "'.$name.'" est végétalien.</span><br><p class="unknown"><a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'">Modifier ce produit à OpenFoodFacts</a>.</p></div>';
	}
	elseif (in_array("en:vegan", $array)) {
		echo  '<span class="vegan animated fadeIn">"'.$name.'" est végétalien !</span>';
	}
	else {
		echo "<div class=\"animated fadeIn\"><span>Ce produit n'est pas dans notre base de données.</span></div>";
	}
}
?>