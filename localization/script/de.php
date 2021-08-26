<?php
if (empty($barcode)){
	echo '<span class="animated fadeIn">Das Barcode-Feld darf nicht leer sein.</span>';
}

else {
	$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode.'.json');
	$product = json_decode($data);
	$array = $product->product->ingredients_analysis_tags;
	$name = $product->product->product_name;
	if (in_array("en:non-vegan", $array)) {
	    echo '<span class="non-vegan animated fadeIn">"'.$name.'" ist nicht vegan.</span>';
	}
	elseif (in_array("en:vegan-status-unknown", $array)) {
	    echo  '<div class="animated fadeIn"><span class="unknown">Wir wissen leider nicht ob "'.$name.'" vegan ist.</span><br><p class="unknown">Weißt du es? <a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'">Ändere das Produkt bei OpenFoodFacts</a>.</p></div>';
	}
	elseif (in_array("en:vegan", $array)) {
		echo  '<span class="vegan animated fadeIn">"'.$name.'" ist Vegan!</span>';
	}
	else {
		echo '<div class="animated fadeIn"><span>Dieses Produkt haben wir noch nicht in unserer Datenbank.</span><p class="missing">Willst du es hinzufügen? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Dieses Produkt hinzufügen bei OpenFoodFacts</a>.</p></div>';
	}
}
?>