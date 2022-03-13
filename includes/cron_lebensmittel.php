<?php
require('/var/www/virtual/jake/vegancheck.me/vendor/autoload.php');
$headers = array(
    'Authorization' => 'baystmuv-vi-1.0 os=ios, key=9d9e8972-ff15-4943-8fea-117b5a973c61',
    'Content-Type' => 'application/json'
);
$data = '{"food":{"rows": 10000}}';
$response = Requests::post('https://lebensmittelwarnung.api.proxy.bund.dev/verbraucherschutz/baystmuv-verbraucherinfo/rest/api/warnings/merged',
                           $headers, $data);

$warnings = $response->body;

$jsonData = $warnings;
file_put_contents('warnings.json', $jsonData);

echo "Success";

?>