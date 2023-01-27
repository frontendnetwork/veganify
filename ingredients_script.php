<?php
/**
 * VeganCheck.me Script
 * @author Philip Brembeck
 * @license MIT License
 * @copyright (C) 2022 Philip Brembeck
 * @copyright (C) 2022 JokeNetwork
 * @copyright (C) 2022 VeganCheck.me Contributors
 * @link https://vegc.net/license
 *
 */

require ('vendor/autoload.php');

// Initialize Localization
$i18n = new i18n('/var/www/virtual/jake/vegancheck.me/l10n/{LANGUAGE}.json', '/var/www/virtual/jake/vegancheck.me/langcache/', 'en');
$i18n->init();
$dotenv = Dotenv\Dotenv::createImmutable('/var/www/virtual/jake/');
$dotenv->load();

$input1 = str_replace(',', ', ', $_POST['ingredients']);
$input = preg_replace('~[\r\n]+~', '', $input1);

function translate($targetlang, $text) {
  $deeplauth = $_ENV['DEEPL_AUTH'];
  $headers = array('Content-Disposition' => 'form-data', 'Authorization' => 'DeepL-Auth-Key '.$deeplauth.'');
  $data = array('target_lang' => $targetlang, 'text' => $text);
  return Requests::post('https://api-free.deepl.com/v2/translate', $headers, $data);
}

// Textfield is empty
if (empty($input) || preg_match('/[^a-zA-Z0-9-:äöüÄÖÜéèêëėàáâæãåāôòóõœōçćčñńßśšŚŠÉÈÊËĖÀÁÂÆÃÅĀÇĆČÛÙÚŪûùúū., ]+/', $input))
{
    print_r('<span class="animated fadeIn"><div class="resultborder">' . L::ingredients_error .'</div></span>');
}

// Textfield is not empty
else
{
    $translation = translate('en', $input);
    $tr = json_decode($translation->body);
    if($translation->status_code == "200"){
        $ingredients = $tr->translations[0]->text;
        $originlang = $tr->translations[0]->detected_source_language;
    }
    else {
        $ingredients = $input;
    }

    $url = 'https://python.cldsi.de/v0/ingredients/'.$ingredients;
    $headers = array('Content-Type' => 'text/plain');
    $response = Requests::get($url, $headers);
    $product = json_decode($response->body);
    if($product->data->vegan == "false"){
        print_r('<div class="animated fadeIn"><div class="resultborder">');
        print_r('<div class="Grid">
                        <div class="Grid-cell description"><b>Vegan</b></div>
                        <div class="Grid-cell icons"><span class="non-vegan icon-cancel"></span></div>
                      </div>');

        foreach ($product->data->flagged as $node) {
            if(isset($originlang)){
                $translation = translate($originlang, $node);
                $tr = json_decode($translation->body);
                if($translation->status_code == "200"){
                    $i = $tr->translations[0]->text;
                }
                else {
                    $i = $node;
                }
            }
            else {
                $i = $node;
            }
            print_r('
                      <div class="Grid">
                        <div class="Grid-cell description">'.ucfirst($i).'</div>
                        <div class="Grid-cell icons"><span class="non-vegan icon-cancel"></span></div>
                      </div></span>');
        }

     print_r('<span class="source">'. L::results_datasource .' <a href="https://www.veganpeace.com/ingredients/ingredients.htm">VeganPeace</a>, <a href="https://www.peta.org/living/food/animal-ingredients-list/">PETA</a> '.L::ingredients_and.' <a href="http://www.veganwolf.com/animal_ingredients.htm">The VEGAN WOLF</a><sup data-target="license" data-toggle="modal">?</sup><br>'.L::ingredients_translated.' <a href="https://deepl.com">DeepL</a><br>'. L::results_processed . '<sup data-target="processed" data-toggle="modal">?</sup></span>');
     print_r('</div></div>');
    }
    elseif($product->data->vegan == "true"){
        print_r('<div class="animated fadeIn"><div class="resultborder">');
        print_r('<div class="Grid">
                        <div class="Grid-cell description"><b>Vegan</b></div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>');
        print_r('<span class="source">'. L::results_datasource .' <a href="https://www.veganpeace.com/ingredients/ingredients.htm">VeganPeace</a>, <a href="https://www.peta.org/living/food/animal-ingredients-list/">PETA</a> '.L::ingredients_and.' <a href="http://www.veganwolf.com/animal_ingredients.htm">The VEGAN WOLF</a><sup data-target="license" data-toggle="modal">?</sup><br>'. L::results_processed . '<sup data-target="processed" data-toggle="modal">?</sup></span>');
        print_r('</div></div>');
    }
    else {
        print_r('<span class="animated fadeIn"><div class="resultborder">' . L::ingredients_error .'</div></span>');
    }
}
?>
