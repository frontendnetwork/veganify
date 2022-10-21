<div class="pwa-install-prompt__container">
            <button class="pwa-install-prompt__overlay"><?php echo L::prompt_close; ?></button>
            <div class="pwa-install-prompt">
                <div class="pwa-install-prompt__icon__container">
                    <img class="pwa-install-prompt__icon" src="../img/icon.png" alt="VeganCheck.me">
                </div>
                <div class="pwa-install-prompt__content">
                    <h3 class="pwa-install-prompt__title"><?php echo L::prompt_install; ?></h3>
                    <p class="pwa-install-prompt__text"><?php echo L::prompt_desc; ?></p>
                    <p class="pwa-install-prompt__guide"><?php echo L::prompt_info; ?></p>
                </div>
            </div>
        </div>

<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../js/BarcodeScanner.min.js"></script>
<script src="../js/app.js?v=<?php echo $versions->js; ?>"></script>
<script src="../node_modules/pwa-install-prompt/script.js"></script>
<script>
var prompt = new pwaInstallPrompt();
</script>
<?php 
        if (isset($_COOKIE['log']) && $_COOKIE['log'] == "Yes"){
          print_r('<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>');
        }  
        elseif (isset($_COOKIE['log']) && $_COOKIE['log'] == "No"){
          print_r('<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5"></script>');
        }  
        else{
          print_r('<script async src="https://analytics.vegancheck.me/ackee.js" data-ackee-server="https://analytics.vegancheck.me" data-ackee-domain-id="77898809-adfe-4573-a05f-88cd663f0fb5" data-ackee-opts=\'{ "detailed": true }\'></script>');
        } 
?>