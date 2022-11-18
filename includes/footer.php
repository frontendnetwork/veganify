 <div class="modal_view animatedfaster fadeInUp" id="installation">
      <div class="modal_close" id="modal_close"><a class="btn-dark" data-dismiss="modal">&times;</a></div>
          <span class="center">
            <img src="../img/pwainstall_img.svg" class="heading_img">
            <h1><?php echo L::prompt_install; ?></h1>
          </span>
          <p><?php echo L::prompt_info; ?> <svg viewBox="0 0 90 90" version="1.1" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;width:.8rem;height:.8rem;" fill="#ccc">
    <g id="_12-add--new--plus--square" serif:id="12-add,-new,-plus,-square" transform="matrix(2.49151,0,0,2.49151,-14.7849,-14.7849)">
        <path id="Shape" d="M37,6C39.689,6 42,8.179 42,11L42,37C42,39.689 39.831,42 37,42L11,42C8.311,42 6,39.788 6,37L6,11C6,8.311 8.169,6 11,6L37,6ZM11,8C9.402,8 8,9.276 8,11L8,37C8,38.598 9.289,40 11,40L37,40C38.598,40 40,38.738 40,37L40,11C40,9.402 38.718,8 37,8L11,8ZM24,15C24.513,15 25,15.404 25,16L25,23L32,23C32.552,23 33,23.448 33,24C33,24.513 32.561,25 32,25L25,25L25,32C25,32.552 24.552,33 24,33C23.487,33 23,32.59 23,32L23,25L16,25C15.448,25 15,24.552 15,24C15,23.487 15.426,23 16,23L23,23L23,16C23,15.448 23.448,15 24,15Z" style="fill-rule:nonzero;"/>
    </g>
</svg>
</p>
    </div>
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
            <span class="button" data-target="installation" data-toggle="modal"><?php echo L::prompt_get; ?></span>
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