<?php

if (empty($barcode)){
	echo '<span class="animated fadeIn">Das Barcode-Feld darf nicht leer sein und keine Sonderzeichen enthalten.</span>';
}

else {
	$data = file_get_contents('https://world.openfoodfacts.org/api/v0/product/'.$barcode);
	$product = json_decode($data);

	if (!empty($product->product)) {
		$array = $product->product->ingredients_analysis_tags;
		$name = $product->product->product_name;
		$response = $product->status_verbose;

		if (in_array("en:palm-oil", $array)) {
			$palmoil = '<span class="non-vegan"> Enthält Palmöl <span class="icon-cancel"></span></span>';
		}

		else {
			$palmoil = '<span class="vegan"> Kein Palmöl <span class="icon-ok"></span> </span>';
		}

			if (in_array("en:non-vegan", $array)) {
			    echo '<div class="animated fadeIn"><span class="non-vegan">"'.$name.'" Vegan <span class="icon-cancel"></span> </span>'.$palmoil.'<a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20ist%20nicht%20vegan!%20-%20Geprüft%20mit%20" class="btn-dark">Tweet</a></div>';
			}
			elseif (in_array("en:vegan-status-unknown", $array)) {
			    echo  '<div class="animated fadeIn"><span class="unknown">Wir wissen nicht ob "'.$name.'" vegan ist <span class="icon-cancel"></span> </span>'.$palmoil.'<br><a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark">Produkt ändern</a></div>';
			}
			elseif (in_array("en:vegan", $array)) {
				echo '<div class="animated fadeIn"><span class="vegan">"'.$name.'" ist Vegan <span class="icon-ok"></span> </span>'.$palmoil.'<a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20ist%20vegan!%20-%20Geprüft%20mit%20" class="btn-dark">Tweet</a></div>';
			}
			elseif ($response == "no code or invalid code"){
				echo '<div class="animated fadeIn"><span class="missing">Mit diesem Barcode stimmt etwas nicht.</span></div>';
			}
			else {
				echo '<div class="animated fadeIn"><span>Dieses Produkt haben wir noch nicht in unserer Datenbank.</span><p class="missing">Willst du es hinzufügen? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Dieses Produkt hinzufügen bei OpenFoodFacts</a>.</p></div>';
			}
	}
	else {
		echo '<div class="animated fadeIn"><span>Dieses Produkt haben wir noch nicht in unserer Datenbank.</span><p class="missing">Willst du es hinzufügen? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Dieses Produkt hinzufügen bei OpenFoodFacts</a>.</p></div>';
	}
}
?>