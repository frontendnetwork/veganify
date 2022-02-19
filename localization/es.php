<?php
$langArray = array(
        "meta" =>  array(
        	"lang" => "es",
        	"title" => "¿Es vegano? - Vegan Check",
        	"description" => "¿No estás seguro de si un producto es vegano o no? Con VeganCheck.me puedes escanear el código de barras de un artículo mientras compras y comprobar si es vegano o no, ¡y eso sin mucha otra información innecesaria! Pruébalo ahora!"
        ),
        "form" => array(
        	"scanbarcode" => "Escanear código de barras",
        	"enterbarcode" => "Introduzca el código de barras del producto",
        	"submit" => "Enviar"
        ),
        "footer" => array(
                "share_text" => "¿Te gusta VeganCheck?"
                "share" => "Compartir",
        	"credits" => 'Hecho con <i class="icon-vegancheck"></i> por <a href="https://philipbrembeck.com">Philip Brembeck</a> &amp; <a href="https://jokenetwork.de">JokeNetwork</a>',
        	"legal" => '<a href="../privacy-policy">Política de privacidad</a> / <a href="../impressum">aviso legal</a> / <a href="//github.com/JokeNetwork/vegancheck.me/wiki">API</a>'
        ),
        "layover" => array(
        	"close" => "Cerrar escáner"
        ),
        "other" => array(
        	"offline" => "Actualmente estás desconectado. VeganCheck.me sólo funciona con una conexión a Internet en funcionamiento.",
        	"reload" => "Intenta de nuevo",
        	"rotate" => "Por favor, gire su dispositivo",
                "timeout" => "Esto tarda más de lo normal",
                "timeoutfinal" => "La consulta ha tardado demasiado. Por favor, inténtalo de nuevo."
        ),
        "results" => array(
        	"invalid" => "El código de barras no puede estar vacío ni incluir caracteres especiales.",
        	"invalidscan" => "Este código de barras no es válido.",
        	"notindb" => "Este producto aún no está en nuestra base de datos",
        	"add" => "¿Quiere añadirlo?",
        	"addonoff" => "Añadir comida",
                "addonobf" => "add cosemtics",
                "or" => "o",
        	"missinginfo" => "Todavía no tenemos suficiente información sobre este producto.",
        	"addinfo" => "¿Quieres añadir información?",
        	"editonoff" => "Editar este producto en OpenFoodFacts",
        	"vegan" => "Vegano",
        	"notvegetarian" => "Non vegetariano",
        	"vegetarian" => "Vegetariano",
        	"unknown" => "Desconocido",
        	"containspalmoil" => "Contiene Palmoil",
        	"nopalmoil" => "No contiene Palmoil",
        	"palmoilunknown" => "Palmoil desconocido",
        	"notvegan" => "No es vegano",
        	"tweettext" => "%20no%20es%20vegano!%20-%20Comprobado%20con%20",
        	"tweettextvegan" => "%20es%20vegano!%20-%20Comprobado%20con%20",
        	"edit" => "Editar",
        	"reporterror" => "Informar de un problema",
                "animaltestfree" => "No probado en animales",
                "checkingredients" => "Los ingredientes del producto se han procesado y comprobado automáticamente. Compruebe usted mismo los ingredientes para estar seguro.",
                "datasource" => "Fuente de datos:",
                "processed" => "Calculado automáticamente"
        ),
        "modal" => array(
                "palmoil" => "Aceite de palma",
                "palmoil_desc" => "El aceite de palma tiene un impacto extremadamente perjudicial para el planeta. Es el principal impulsor de la deforestación de algunos de los bosques más biodiversos, destruyendo los hábitats naturales de animales ya amenazados. Por ello, recomendamos no comprar ningún producto que contenga aceite de palma. Lamentablemente, todavía hay muchos productos que incluyen aceite de palma.",
                "nutriscore_desc" => "El Nutriscore indica el perfil nutricional de un producto en forma de semáforo. Sin embargo, el Nutriscore no se considera exacto y no debe utilizarse como referencia.",
                "processed" => "Calculado automáticamente",
                "processed_desc" => 'Este mensaje significa que los ingredientes del producto han sido verificados por la <a href="https://github.com/JokeNetwork/vegan-ingredients-api">VeganCheck.me Ingredients API</a> y se han clasificado automáticamente como vegano o no vegano.<br>
Los ingredientes son proporcionados en cada caso por la fuente indicada.<br>
No hacemos ninguna afirmación sobre la precisión o la puntualidad de los ingredientes o los criterios de revisión.<br>
A veces, los fabricantes cambian los ingredientes de su producto para que ya no sea vegano, por ejemplo, añadiendo leche en polvo.<br>
Verifique dos veces los ingredientes del producto para estar seguro.'
        )
    );
?>