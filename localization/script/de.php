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
		$nutriscore = $product->product->nutriscore_grade;

		if(isset($array)){

			if($nutriscore == "a"){
				$nutriscore = '<span class="vegan">Nutriscore A<span class="icon-ok"></span> </span>';
			}
			elseif($nutriscore == "b"){
				$nutriscore = '<span class="vegan">Nutriscore B<span class="icon-ok"></span> </span>';
			}
			elseif($nutriscore == "c"){
				$nutriscore = '<span class="vegan">Nutriscore C<span class="icon-ok"></span> </span>';
			}
			elseif($nutriscore == "d"){
				$nutriscore = '<span class="non-vegan">Nutriscore D<span class="icon-cancel"></span> </span>';
			}
			elseif($nutriscore == "e"){
				$nutriscore = '<span class="non-vegan">Nutriscore E<span class="icon-cancel"></span> </span>';
			}
			else {
				$nutriscore = '<span class="unknown">Nutriscore unbekannt<span class="icon-help"></span> </span>';
			}

			if (in_array("en:palm-oil", $array)) {
				$palmoil = '<span class="non-vegan"> Enthält Palmöl<span class="icon-cancel"></span> </span>';
			}
			elseif (in_array("en:palm-oil-free", $array)) {
				$palmoil = '<span class="vegan"> Kein Palmöl<span class="icon-ok"></span> </span>';
			}
			else {
				$palmoil = '<span class="unknown"> Palmöl-Inhalt unbekannt<span class="icon-help"></span> </span>';
			}

				if (in_array("en:non-vegan", $array)) {
				    echo '<div class="animated fadeIn"><span class="non-vegan">"<span class="name">'.$name.'</span>":<br>Nicht vegan<span class="icon-cancel"></span> </span>'.$palmoil.$nutriscore.'<br><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20ist%20nicht%20vegan!%20-%20Geprüft%20mit%20" class="btn-dark" id="tweet"><span class="icon-twitter"></span> Tweet</a><a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> Ändern</a></div>';
				}
				elseif (in_array("en:vegan-status-unknown", $array) or in_array("en:maybe-vegan", $array)) {
				    echo  '<div class="animated fadeIn"><span class="unknown">"<span class="name">'.$name.'</span>":<br>Vegan<span class="icon-help"></span> </span>'.$palmoil.$nutriscore.'<br><a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> Ändern</a></div>';
				}
				elseif (in_array("en:vegan", $array)) {
					echo '<div class="animated fadeIn"><span class="vegan">"<span class="name">'.$name.'</span>":<br>Vegan<span class="icon-ok"></span> </span>'.$palmoil.$nutriscore.'<br><a href="https://twitter.com/intent/tweet?url=https://vegancheck.me&text='.$name.'%20ist%20vegan!%20-%20Geprüft%20mit%20" class="btn-dark" id="tweet"><span class="icon-twitter"></span> Tweet</a><a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code='.$barcode.'" class="btn-dark"><span class="icon-pencil"></span> Ändern</a></div>';
				}
				elseif ($response == "no code or invalid code"){
					echo '<div class="animated fadeIn"><span class="missing">Mit diesem Barcode stimmt etwas nicht.</span></div>';
				}
				else {
					echo '<div class="animated fadeIn"><span>Dieses Produkt haben wir noch nicht in unserer Datenbank.</span><p class="missing">Willst du es hinzufügen? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Dieses Produkt hinzufügen bei OpenFoodFacts</a>.</p></div>';
				}
		}
		else {
			echo '<div class="animated fadeIn"><span>Zu diesem Produkt haben wir noch zu wenige Infos.</span><p class="missing">Willst du Infos hinzufügen? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Dieses Produkt bearbeiten bei OpenFoodFacts</a>.</p></span></div>'; 
		}

	}
	else {
		echo '<div class="animated fadeIn"><span>Dieses Produkt haben wir noch nicht in unserer Datenbank.</span><p class="missing">Willst du es hinzufügen? <a href="https://world.openfoodfacts.org/cgi/product.pl?code='.$barcode.'">Dieses Produkt hinzufügen bei OpenFoodFacts</a>.</p></div>';
	}
}
?>