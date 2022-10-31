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

// Require enviroment variables for the OpenEANDB-API-Key
$dotenv = Dotenv\Dotenv::createImmutable('/var/www/virtual/jake/');
$dotenv->load();
$userid = $_ENV['USER_ID_OEANDB'];

// Initialize Localization
$i18n = new i18n('/var/www/virtual/jake/vegancheck.me/l10n/{LANGUAGE}.json', '/var/www/virtual/jake/vegancheck.me/langcache/', 'en');
$i18n->init();

$sent_barcode = filter_input(INPUT_POST, 'barcode');

// Create a uniqid for support (Delete this if you're not using VeganCheck.me-Tracker)
$ticket = uniqid();

// Set all variables
$vegan = null;
$vegetarian = null;
$animaltestfree = null;
$palmoil = null;
$nutriscore = null;

// Open Issue on GitHub when error occurs (Delete if you're not using VeganCheck.me-Tracker)
$openissue = '<a href="https://github.com/JokeNetwork/vegancheck.me/issues/new?assignees=philipbrembeck&labels=bug&body=' . urlencode('Error ticket #' . $ticket . ' (Please always include this number!) - Please describe your issue:') . '" target="_blank" class="button">' . L::results_reporterror . '</a>';

// Barcode is empty
if (empty($sent_barcode) || $sent_barcode == null)
{
    print_r('<span class="animated fadeIn"><div class="resultborder">' . L::results_invalid . '<br>' . $openissue . '</div></span>');
}

// Barcode is not empty
else
{
    $barcode = $sent_barcode;
    $data = Requests::get('https://world.openfoodfacts.org/api/v0/product/' . $barcode);
    $product = json_decode($data->body);

    $beautydata = Requests::get('https://world.openbeautyfacts.org/api/v0/product/' . $barcode);
    $beautyproduct = json_decode($beautydata->body);

    // When to use OpenBeautyFacts & when to use OpenFoodFacts
    if (empty($product->product) && !empty($beautyproduct->product))
    {
        $api = 'https://world.openbeautyfacts.org/api/v0/product/';
        $baseuri = "https://world.openbeautyfacts.org";
        $edituri = 'https://world.openbeautyfacts.org/cgi/product.pl?type=edit&code=' . $barcode;
        $apiname = 'OpenBeautyFacts';
    }
    elseif (!empty($product->product) && empty($beautyproduct->product))
    {
        $api = 'https://world.openfoodfacts.org/api/v0/product/';
        $baseuri = "https://world.openfoodfacts.org";
        $edituri = 'https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=' . $barcode;
        $apiname = 'OpenFoodFacts';
    }
    else
    {
        $api = 'https://world.openfoodfacts.org/api/v0/product/';
        $baseuri = "https://world.openfoodfacts.org";
        $edituri = 'https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=' . $barcode;
        $apiname = 'OpenFoodFacts';
    }
    $data = Requests::get($api . $barcode);
    $product = json_decode($data->body);

    // Start JSON array request
    if (!empty($product->product))
    {
        $array = $product
            ->product->ingredients_analysis_tags;
        $productname = $product
            ->product->product_name;
        $genericname = $product
            ->product->generic_name;
        $response = $product->status_verbose;
        $nutriscore = $product
            ->product->nutriscore_grade;

        // Check for non-animal-tested products
        if ($apiname == "OpenBeautyFacts")
        {
            if (isset($product
                ->product
                ->labels_tags))
            {
                if (in_array("en:not-tested-on-animals", $product
                    ->product
                    ->labels_tags) || in_array("de:ohne-tierversuche", $product
                    ->product
                    ->labels_tags) || in_array("en:cruelty-free", $product
                    ->product
                    ->labels_tags) || in_array("fr:cruelty-free", $product
                    ->product
                    ->labels_tags) || in_array("en:cruelty-free-international", $product
                    ->product
                    ->labels_tags) || in_array("en:vegan-society", $product
                    ->product
                    ->labels_tags))
                {
                    $animaltestfree = '
                    <div class="Grid">
                        <div class="Grid-cell description">' . L::results_animaltestfree . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>
                      ';
                }

                // Check for the manufacturer in PETA Cruelty Free brands
                elseif (!empty($product
                    ->product
                    ->brands))
                {
                    $petapi = Requests::get('https://api.vegancheck.me/v0/peta?type=crueltyfree');
                    $peta = json_decode($petapi->body);

                    if (in_array($beautyproduct
                        ->product->brands, $peta->PETA_DOES_NOT_TEST))
                    {
                        $animaltestfree = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_animaltestfree . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>';
                        $apiname = 'OpenBeautyFacts, PETA Beauty without Bunnies';
                    }

                }

                else
                {
                    $animaltestfree = null;
                }
            }
            // Check for the manufacturer in PETA Cruelty Free brands
            elseif (!empty($product
                ->product
                ->brands))
            {
                $petapi = Requests::get('https://api.vegancheck.me/v0/peta?type=crueltyfree');
                $peta = json_decode($petapi->body);
                if (in_array($beautyproduct
                    ->product->brands, $peta->PETA_DOES_NOT_TEST))
                {
                    $animaltestfree = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_animaltestfree . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>';
                    $apiname = 'OpenBeautyFacts, PETA Beauty without Bunnies';
                }
            }
            else
            {
                $animaltestfree = null;
            }
        }
        else
        {
            $animaltestfree = null;
        }

        // Check if $productname is given or $genericname is given
        if (empty($productname) && !empty($genericname))
        {
            $productname = $genericname;
        }
        elseif (empty($genericname) && empty($productname))
        {
            $productname = L::results_unknown;
        }

        // Set palmoil as unknown before checking it, to display "unknown" in case of no API response
        $palmoil = '<div class="Grid">
                        <div class="Grid-cell description">' . L::modal_palmoil . '<sup id="palm_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="unknown icon-help"></span></div>
                      </div>';


        // Set vegetarian as unknown before checking it
        $vegetarian = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegetarian . '</div>
                        <div class="Grid-cell icons"><span class="unknown icon-help"></span></div>
                      </div>';

        // Checks for the nutriscore
        if ($nutriscore == "a")
        {
            $nutriscore = '<div class="Grid">
                        <div class="Grid-cell description">Nutriscore<sup id="nutri_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="nutri_a icon-a"></span></div>
                      </div>';
        }
        elseif ($nutriscore == "b")
        {
            $nutriscore = '<div class="Grid">
                        <div class="Grid-cell description">Nutriscore<sup id="nutri_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="nutri_b icon-b"></span></div>
                      </div>';
        }
        elseif ($nutriscore == "c")
        {
            $nutriscore = '<div class="Grid">
                        <div class="Grid-cell description">Nutriscore<sup id="nutri_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="nutri_c icon-c"></span></div>
                      </div>';
        }
        elseif ($nutriscore == "d")
        {
            $nutriscore = '<div class="Grid">
                        <div class="Grid-cell description">Nutriscore<sup id="nutri_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="nutri_d icon-d"></span></div>
                      </div>';
        }
        elseif ($nutriscore == "e")
        {
            $nutriscore = '<div class="Grid">
                        <div class="Grid-cell description">Nutriscore<sup id="nutri_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="nutri_e icon-e"></span></div>
                      </div>';
        }
        elseif ($apiname == "OpenBeautyFacts")
        {
            $nutriscore = null;
        }
        else
        {
            $nutriscore = '<div class="Grid">
                        <div class="Grid-cell description">Nutriscore<sup id="nutri_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="unknown icon-help"></span></div>
                      </div>';
        }

        if (isset($array))
        {
            // Checks for the palm-oil status
            // Needs to be after isset($array) because it checks within the array
            if (in_array("en:palm-oil", $array))
            {
                $palmoil = '<div class="Grid">
                        <div class="Grid-cell description">' . L::modal_palmoil . '<sup id="palm_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="non-vegan icon-cancel"></span></div>
                      </div>';
            }
            elseif (in_array("en:palm-oil-free", $array))
            {
                $palmoil = '<div class="Grid">
                        <div class="Grid-cell description">' . L::modal_palmoil . '<sup id="palm_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>';
            }
            else
            {
                $palmoil = '<div class="Grid">
                        <div class="Grid-cell description">' . L::modal_palmoil . '<sup id="palm_modal">?</sup></div>
                        <div class="Grid-cell icons"><span class="unknown icon-help"></span></div>
                      </div>';
            }

            // Checks for the vegetarian status
            if (in_array("en:non-vegetarian", $array))
            {
                $vegetarian = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegetarian . '</div>
                        <div class="Grid-cell icons"><span class="non-vegan icon-cancel"></span></div>
                      </div>';
            }
            elseif (in_array("en:vegetarian", $array))
            {
                $vegetarian = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegetarian . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>';
            }
            else
            {
                $vegetarian = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegetarian . '</div>
                        <div class="Grid-cell icons"><span class="unknown icon-help"></span></div>
                      </div>';
            }

            // if not vegan
            if (in_array("en:non-vegan", $array))
            {
                $vegan = "false";
            }
            // if vegan status unknown
            elseif (in_array("en:vegan-status-unknown", $array) || in_array("en:maybe-vegan", $array))
            {
                if (in_array("brands", $array))
                {
                    // Check the brand with the PETA Vegan Approved API
                    $petapi = Requests::get('https://api.vegancheck.me/v0/peta?type=veganapproved&company=' . $product
                        ->product
                        ->brands);
                    $peta = json_decode($petapi->body);
                    if (in_array($product
                        ->product->brands, $peta->PETA_VEGAN_APPROVED))
                    {
                        $vegan = "true";
                        $apiname = 'OpenFoodFacts &amp; PETA Vegan Approved';
                    }
                    else
                    {
                        $vegan = "unknown";
                    }
                }
                else
                {
                    $vegan = "unknown";
                }
            }
            // if vegan
            elseif (in_array("en:vegan", $array))
            {
                $vegan = "true";
            }
            elseif ($response == "no code or invalid code")
            {
                $endrepsone = "invalid";
            }
            // Product is not in OFF/OBF db
            else
            {
                $endrepsone = "notindb";
            }
        }
        // Fomer: $missinginfo, now: Name-output & nutriscore if available
        else
        {
            $vegan = "unknown";
        }
    }

    // Use brocade API if item is not in OFF and use OEDBAPI if item is not in brocade
    else
    {
        $brocade = Requests::get('https://www.brocade.io/api/items/' . $barcode);
        $product = json_decode($brocade->body);
        if (!empty($product->name))
        {
            $productname = $product->name;
            $ingredients = $product->ingredients;
            if (!empty($productname) && !empty($ingredients))
            {
                $apiname = 'Brocade.io';
                $baseuri = "https://www.brocade.io";
                $edituri = 'https://www.brocade.io/products/' . $barcode;
                include_once ('includes/isvegan.php');
                $response = explode(', ', $ingredients);
                $result = array_uintersect($isvegan, $response, fn($a, $b) => strcasecmp($a, $b));
                if (empty($result))
                {
                    $vegan = "true";
                }
                else
                {
                    $vegan = "false";
                }
            }
            else
            {
                $endrepsone = "notindb";
                $apiname = 'Brocade.io';
                $baseuri = "https://brocade.io";

            }
        }
        else
        {
            $oedb = Requests::get('https://opengtindb.org/?ean=' . $barcode . '&cmd=query&queryid=' . $userid);
            $array = parse_ini_string($oedb->body, false, INI_SCANNER_RAW);
            $status = $array['error'];
            $desc = utf8_encode($array['descr']);
            if ($status == "0")
            {
                $apiname = 'Open EAN Database';
                $baseuri = "https://opengtindb.org";
                $edituri = 'https://opengtindb.org/index.php?cmd=ean1&ean=' . $barcode;
                $productname = utf8_encode($array['name'] . ' ' . $array['detailname']);
                $contents = $array['contents'];

                if (!empty($contents) && $contents >= "128" && $contents < "256")
                {
                    $vegan = "false";
                    $vegetarian = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegetarian . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>';
                }
                elseif (!empty($contents) && $contents >= "256" && $contents < "384" || $contents >= "384" && $contents < "512")
                {
                    $vegan = "true";
                    $vegetarian = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegetarian . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>';
                }
                elseif (!empty($desc))
                {
                    include_once ('includes/isvegan.php');
                    $response = explode(', ', $desc);
                    $result = array_uintersect($isvegan, $response, fn($a, $b) => strcasecmp($a, $b));

                    if (empty($result))
                    {
                        $vegan = "unknown";
                    }
                    else
                    {
                        $vegan = "false";
                    }
                }
                else
                {
                    $endrepsone = "notindb";
                }
            }
            else
            {
                $endrepsone = "notindb";
            }
        }
    }
}

// Return results
if ($vegan == "false")
{
    if ($apiname == "Brocade.io" || $apiname == "Open EAN Database")
    {
        $processed = ' &middot; ' . L::results_processed . '<sup id="processed_modal">?</sup>';
    }
    else
    {
        $processed = null;
    }
    print_r('<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="unknown">  
                        <span class="name" id="name_sh">"' . $productname . '":</span>
                      </span>
                      <span id="result_sh"><div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegan . '</div>
                        <div class="Grid-cell icons"><span class="non-vegan icon-cancel"></span></div>
                      </div></span>' . $vegetarian . $animaltestfree . $palmoil . $nutriscore . '
                      <span class="source">' . L::results_datasource . ' <a href="' . $baseuri . '" target="_blank">' . $apiname . '</a><sup id="license_modal">?</sup>' . $processed . '</span>
                      <span class="button" id="share" onClick="sharebutton()">' . L::footer_share . '</span>
                      <a href="' . $edituri . '" target="_blank" class="button"><span class="icon-pencil"></span> ' . L::results_edit . '</a>
                    </div>
                  </div>');
}
elseif ($vegan == "true")
{
    // Vegetarian is always true when vegan is true
    $vegetarian = '<div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegetarian . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div>';

    if ($apiname == "Brocade.io")
    {
        $processed = ' &middot; ' . L::results_processed . '<sup id="processed_modal">?</sup>';
    }
    else
    {
        $processed = null;
    }
    print_r('<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="unknown">
                        <span class="name" id="name_sh">"' . $productname . '":</span>
                      </span>
                      <span id="result_sh"><div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegan . '</div>
                        <div class="Grid-cell icons"><span class="vegan icon-ok"></span></div>
                      </div></span>' . $vegetarian . $animaltestfree . $palmoil . $nutriscore . '
                      <span class="source">' . L::results_datasource . ' <a href="' . $baseuri . '" target="_blank">' . $apiname . '</a><sup id="license_modal">?</sup>' . $processed . '</span>
                      <span class="button" id="share" onClick="sharebutton()">' . L::footer_share . '</span>
                      <a href="' . $edituri . '" target="_blank" class="button"><span class="icon-pencil"></span> ' . L::results_edit . '</a>
                    </div>
                  </div>');
}
elseif ($vegan == "unknown")
{
    print_r('<div class="animated fadeIn">
                    <div class="resultborder">
                      <span class="unknown">
                        <span class="name" id="name_sh">"' . $productname . '":</span>
                      </span>
                      <span id="result_sh"><div class="Grid">
                        <div class="Grid-cell description">' . L::results_vegan . '</div>
                        <div class="Grid-cell icons"><span class="unknown icon-help"></span></div>
                      </div></span>' . $vegetarian . $animaltestfree . $palmoil . $nutriscore . '
                      <span class="source">' . L::results_datasource . ' <a href="' . $baseuri . '" target="_blank">' . $apiname . '</a><sup id="license_modal">?</sup></span>
                      <span class="button" id="share" onClick="sharebutton()">' . L::footer_share . '</span>
                      <a href="' . $edituri . '" target="_blank" class="button"><span class="icon-pencil"></span> ' . L::results_edit . '</a>
                    </div>
                  </div>');
}
elseif ($endrepsone == "invalid")
{
    print_r('<div class="animated fadeIn"><div class="resultborder"><span class="missing">' . L::results_invalidscan . '</span><br>' . $openissue . '</div></div>');
}
elseif ($endrepsone == "notindb" && !empty($productname) && $productname !== "n/a")
{
    print_r('<div class="animated fadeIn"><div class="resultborder"><span class="name">"' . $productname . '":</span><p class="missing">' . L::results_notindb . '</p><p class="missing">' . L::results_add . ' <a href="https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=' . $barcode . '" target="_blank">' . L::results_addonoff . '</a> ' . L::results_or . ' <a href="https://world.openbeautyfacts.org/cgi/product.pl?code=' . $barcode . '" target="_blank">' . L::results_addonobf . '</a>.</p>
                  <span class="source">' . L::results_datasource . ' <a href="' . $baseuri . ' target="_blank"">' . $apiname . '</a><sup id="license_modal">?</sup></span>' . $openissue . '</div></div>');
}
elseif ($endrepsone == "notindb")
{
    print_r('<div class="animated fadeIn"><div class="resultborder"><span>' . L::results_notindb . '</span><p class="missing">' . L::results_add . ' <a href="https://world.openfoodfacts.org/cgi/product.pl?code=' . $barcode . '" target="_blank">' . L::results_addonoff . '</a> ' . L::results_or . ' <a href="https://world.openbeautyfacts.org/cgi/product.pl?code=' . $barcode . '" target="_blank">' . L::results_addonobf . '</a>.</p>
    ' . $openissue . '
    </div></div>');
}

// Remove before using on your own site unless you're using VeganCheck.me-Tracker
include_once ("stats.php");
?>
