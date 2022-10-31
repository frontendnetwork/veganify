<div id="pwainstall">
    <div class="flex-container">
        <div class="flex-item" id="pwaclose">
            &times;
        </div>
        <div class="flex-item">
            <img src="../img/maskable_icon.png">
        </div>
        <div class="flex-item">
            <span class="heading">VeganCheck.me</span>
            <span class="subheading"><?php echo L::meta_title; ?></span>
        </div>
        <div class="flex-item">
            <span class="button" id="getbtn"><?php echo L::prompt_get; ?></span>
        </div>
    </div>
</div>

<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../js/BarcodeScanner.min.js"></script>
<script src="../js/app.js?v=<?php echo $versions->js; ?>"></script>
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