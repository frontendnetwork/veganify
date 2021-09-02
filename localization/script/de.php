<?php
if (empty($barcode)){
	echo '<span class="animated fadeIn">Das Barcode-Feld darf nicht leer sein und keine Sonderzeichen enthalten.</span>';
}

else {
	$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode);
	$product = json_decode($data);
	$array = $product->product->ingredients_analysis_tags;
	$name = $product->product->product_name;
	$response = $product->status_verbose;

	if (in_array("en:non-vegan", $array)) {
	    echo '<div class="animated fadeIn"><span class="non-vegan">"'.$name.'" ist nicht vegan.</span><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20ist%20nicht%20vegan!%20-%20Geprüft%20mit%20https://vegancheck.me" class="btn-dark">Tweet</a></div>';
	}
	elseif (in_array("en:vegan-status-unknown", $array)) {
	    echo  '<div class="animated fadeIn"><span class="unknown">Wir wissen leider nicht ob "'.$name.'" vegan ist.</span><br><p class="unknown">Weißt du es? <a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'">Ändere das Produkt bei OpenFoodFacts</a>.</p></div>';
	}
	elseif (in_array("en:vegan", $array)) {
		echo '<div class="animated fadeIn"><span class="vegan">"'.$name.'" ist Vegan!</span><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20ist%20vegan!%20-%20Geprüft%20mit%20" class="btn-dark">Tweet</a></div>';
	}
	elseif ($response == "no code or invalid code"){
		echo '<div class="animated fadeIn"><span class="missing">Mit diesem Barcode stimmt etwas nicht.</span></div>';
	}
	else {
		echo '<div class="animated fadeIn"><span>Dieses Produkt haben wir noch nicht in unserer Datenbank.</span><p class="missing">Willst du es hinzufügen? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Dieses Produkt hinzufügen bei OpenFoodFacts</a>.</p></div>';
	}
}
?>