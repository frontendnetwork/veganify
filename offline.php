<?php
  include_once('includes/header.php');
?>
  </head>
  <body>
    <div class="container">
      <div id="main">
        <img src="../img/VeganCheck.svg" alt="Logo">
        <h1>VeganCheck.me</h1>
        <p id="code"></p>

        <h3><?php echo L::other_offline; ?></h3>
        <h3><a href="/"><?php echo L::other_reload; ?></a></h3>
      </div>
    </div>
    <script>
      window.addEventListener('online', function(e) { window.location.href = "/"; });
    </script>
  </body>
</html>