<p align="center">
 <img width="100px" src="img/hero_icon.png" align="center" alt="VeganCheck Logo">
</p>
<h3 align="center">VeganCheck.me</h3>

<p align="center">
  Check if a product is vegan or not with <a href="https://vegancheck.me"><strong>» VeganCheck.me</strong></a>
</p>

# 
  <p align="center">
	<a href="https://jokenetwork.de/badges"><img alt="JKN Status: Active" src="https://jokenetwork.de/assets/img/gitstatus/active.svg"></a>
	<a href="https://sonarcloud.io/summary/new_code?id=JokeNetwork_vegancheck.me"><img alt="Quality Gate Status" src="https://sonarcloud.io/api/project_badges/measure?project=JokeNetwork_vegancheck.me&metric=alert_status"></a>
  <a href="https://codeclimate.com/github/JokeNetwork/vegancheck.me/maintainability"><img src="https://api.codeclimate.com/v1/badges/3e4c87c9f6b92b9e13b5/maintainability" /></a>
<a href="https://www.codacy.com/gh/JokeNetwork/vegancheck.me/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=JokeNetwork/vegancheck.me&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/88f4f14676db4160881af922125245d7"/></a>
<a href="https://www.codefactor.io/repository/github/jokenetwork/vegancheck.me"><img src="https://www.codefactor.io/repository/github/jokenetwork/vegancheck.me/badge" alt="CodeFactor" /></a> <a href="https://circleci.com/gh/JokeNetwork/vegancheck.me/tree/main"><img src="https://circleci.com/gh/JokeNetwork/vegancheck.me/tree/main.svg?style=svg" alt="CircleCI"></a>
	<br>
<a href="https://github.com/sponsors/philipbrembeck"><img src="https://img.shields.io/badge/Sponsor%20on%20GitHub-white.svg?logo=githubsponsors" alt="Consider Sponsoring"></a>
<a href="https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536"><img src="https://shields.io/badge/Donate%20with%20PayPal-blue?style=flat&logo=Paypal" alt="Donate"></a>
	
  
[<img src="https://jokenetwork.de/assets/img/PWA.svg" alt="Open PWA in browser" width="150" align="right">](https://vegancheck.me) 
## 🌱 Progressive Web App

[Open PWA in browser](https://vegancheck.me) - [Product page on JokeNetwork.de](https://jokenetwork.de/#projects) - [API](https://github.com/JokeNetwork/vegancheck.me/wiki) - [Python tool](https://github.com/JokeNetwork/VeganCheck-Python) - [Cloduflare-cached: isitvegan.io](https://isitvegan.io)

Follow us on [Twitter](https://twitter.com/vegancheckme) and [Instagram](https://instagram.com/vegancheck.me) for updates! 

## 👨🏼‍💻 Overview
<p align="center">
<img src="img/Hero.svg" alt="VeganCheck.me Hero" align="center" height="500"><br>
	<sup>MacBook Pro® and iPhone® are trademarks of Apple Inc., registered in the U.S. and other countries.</sup>
</p>
	
**Are you looking for our free API? [Read our Wiki](https://github.com/JokeNetwork/vegancheck.me/wiki).**

VeganCheck.me checks the barcode (EAN or UPC) of a food- or non-food-product and tells you if it is vegan or not. It is an useful tool for vegans and vegetarians - Developed with usability and simplicity in mind, so without distracting irrelevant facts or advertising.
	
VeganCheck.me combines the Databases of OpenFoodFacts, OpenBeautyFacts, Brocade.io and Open EAN Database in one tool. 
	
The [VeganCheck Ingredients API](https://github.com/JokeNetwork/vegan-ingredients-api), a fork of is-vegan, checks the products ingredients against a list of thousands of non-vegan items.

<img src="https://user-images.githubusercontent.com/4144601/158242454-413ec5dc-103d-450a-a0ed-ec6f463db14d.mp4" alt="VeganCheck.me Demo" align="right" height="500">
	
### Requirements: 
- PHP >=7.4 installed
- Composer installed with the following components: 
  ````bash
  $ composer require rmccue/requests
  ````
  ````bash
  $ composer require vlucas/phpdotenv
  ````
  ````bash
  $ composer require philipp15b/php-i18n
  ````
- Optional: Get an API-Key for Open EAN Database by donating to Coast against plastic (Küsten gegen Plastik) - [Learn more here](https://opengtindb-org.translate.goog/userid.php?_x_tr_sl=de&_x_tr_tl=en&_x_tr_hl=de&_x_tr_pto=wapp), insert it in the `.env.example` and rename it to `.env`. 
Also change the path to the .env-file in `script.php`. Then you should be good to go!
  ```php
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
  ````
- Or just use: 
  ````bash
  $ composer install
  $ npm install
  ````

Get the [latest release](https://github.com/JokeNetwork/vegancheck.me/releases) or fork this repositiory and make the changes you want!

## 🧩 Contribute
This repo is mainly maintained by the team of [@jokenetwork](https://github.com/jokenetwork) ([JokeNetwork.de](https://jokenetwork.de)), but you can also help, if you want to!

**What we currently need help with:**

Please refer to our issue trackers to see where you could help: 
- [[Tasks] Project enhancements](https://github.com/JokeNetwork/vegancheck.me/issues/53)
- [[Tasks] Code Improvements](https://github.com/JokeNetwork/vegancheck.me/issues/52)
- [[Tasks] Localization](https://github.com/JokeNetwork/vegancheck.me/issues/59)
- [ToDo until v2.x](https://github.com/JokeNetwork/vegancheck.me/milestone/2)

## 🤝 Dependencies & Credits 

This repo uses:

* [JQuery](https://jquery.com) @jQuery
* [BarCode-reader](https://github.com/iemadk/BarCode-reader) [@iemadk](https://github.com/iemadk)
* [OpenFoodFacts API](https://openfoodfacts.org/) & [OpenBeautyFacts API](https://openbeautyfacts.org/) [@openfoodfacts](https://github.com/openfoodfacts)
* [Brocade.io API](https://brocade.io) [@ferrisoxide](https://github.com/ferrisoxide)
* [Open EAN Database](https://opengtindb.org)
* [is-vegan](https://github.com/hmontazeri/is-vegan) [@hmontazeri](https://github.com/hmontazeri)

## 👩‍⚖️ License

All text and code in this repository is licensed under [MIT](https://github.com/jokenetwork/VeganCheck.me/blob/main/LICENSE), © 2022 Philip Brembeck, © 2022 JokeNetwork.
