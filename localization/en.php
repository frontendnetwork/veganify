<?php 
$langArray = array(
        "meta" =>  array(
        	"lang" => "en",
        	"title" => "Is it Vegan? - Vegan Check",
        	"description" => "Are you unsure whether a product is vegan or not? With VeganCheck.me you can scan the bar code of an item while shopping and check whether it is vegan or not and that without a lot of other unnecessary information! Try it out now!"
        ),
        "form" => array(
        	"scanbarcode" => "Scan barcode",
        	"enterbarcode" => "Enter product barcode",
        	"submit" => "Submit"
        ),
        "footer" => array(
        	"credits" => 'Made with <i class="icon-vegancheck"></i> by <a href="https://philipbrembeck.com">Philip Brembeck</a> &amp; <a href="https://jokenetwork.de">JokeNetwork</a>',
        	"legal" => '<a href="../privacy-policy">Privacy Policy</a> / <a href="../impressum">Imprint</a> / <a href="//github.com/JokeNetwork/vegancheck.me/wiki">API</a>'
        ),
        "layover" => array(
        	"close" => "Close scanner"
        ),
        "other" => array(
        	"offline" => "You are currently offline. VeganCheck.me only works with a functioning internet-connection.",
        	"reload" => "Reload",
        	"rotate" => "Please turn your device",
                "timeout" => "This takes longer than usual",
                "timeoutfinal" => "The request took too long. Please try again."
        ),
        "results" => array(
        	"invalid" => "Barcode cannot be empty or include special characters.",
        	"invalidscan" => "This barcode is invalid.",
        	"notindb" => "This product is not in our database yet.",
        	"add" => "Do you want to add it?",
        	"addonoff" => "add food",
                "addonobf" => "add cosemtics",
                "or" => "or",
        	"missinginfo" => "We do not have enough info on this product yet.",
        	"addinfo" => "Want to add info?",
        	"editonoff" => "Edit this product at OpenFoodFacts",
        	"vegan" => "Vegan",
        	"notvegetarian" => "Not vegetarian",
        	"vegetarian" => "Vegetarian",
        	"unknown" => "unknown",
        	"containspalmoil" => "Contains palmoil",
        	"nopalmoil" => "No palmoil",
        	"palmoilunknown" => "Palmoil unknown",
        	"notvegan" => "Not vegan",
        	"tweettext" => "%20is%20not%20vegan!%20-%Checked%with%20",
        	"tweettextvegan" => "+is+vegan!+-+Checked+with",
        	"edit" => "Edit",
        	"reporterror" => "Report an issue",
                "animaltestfree" => "Not tested on animals",
                "checkingredients" => "The products ingredients were processed and checked automatically. Please check the ingredients yourself to be sure.",
                "datasource" => "Data source:",
                "processed" => "Computed automatically"
        ),
        "modal" => array(
                "palmoil" => "Palm-oil",
                "palmoil_desc" => "Palm-oil has an extremly harmful impact on the planet. It is the major driver of deforestation of some of the most biodiverse forests, destroying the natural habitats of already endangered animals. Because of this, we'd recommend to not buy any products that contain palm-oil. Sadly, there are still many products out there which include palm oil.",
                "nutriscore_desc" => "The Nutriscore indicates the nutritional profile of a product in traffic light form. However, the Nutriscore is not considered accurate and should not be used as a reference.",
                "processed" => "Computed automatically",
                "processed_desc" => 'This message means that the ingredients of the product have been checked by the <a href="https://github.com/JokeNetwork/vegan-ingredients-api">VeganCheck.me Ingredients API</a> and have been automatically classified as vegan or non-vegan.<br> 
The ingredients are provided in each case by the indicated source.<br>
We do not make any claims about the accuracy or timeliness of the ingredients or the review criteria.<br>
Sometimes manufacturers change the ingredients of their product so that it is no longer vegan, for example by adding milk powder.<br>
Please double check the ingredients of the product to be sure.'
        )
    );
?>