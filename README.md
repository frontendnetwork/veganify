<div align="center">
<img width="128px" src="https://user-images.githubusercontent.com/4144601/233675806-32769506-f311-416b-80f4-2e8aff0a85a9.svg" alt="Veganify Logo">

# Veganify

Check if a product is vegan or not with <a href="https://veganify.app"><strong>» Veganify.app</strong></a>

<br/>
<a href="https://veganify.app"><img src="https://user-images.githubusercontent.com/4144601/233676587-c0b1f89a-9e1f-49f9-b4b9-fdbf1e592f5f.png" alt="Veganify Hero" align="center"></a>
<br><br>
<a href="https://www.producthunt.com/products/vegancheck-me?utm_source=badge-featured" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=396704&theme=neutral&period=weekly&topic_id=43" alt="Veganify - Check&#0032;if&#0032;a&#0032;product&#0032;if&#0032;vegan&#0047;vegetarian&#0032;easily&#0032;and&#0032;fast | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
<a href="https://www.producthunt.com/products/vegancheck-me?utm_source=badge-featured" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=396704&theme=neutral&period=weekly&topic_id=204" alt="Veganify- Check&#0032;if&#0032;a&#0032;product&#0032;if&#0032;vegan&#0047;vegetarian&#0032;easily&#0032;and&#0032;fast | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</div>

## Overview

Veganify checks the barcode (EAN or UPC) of a food- or non-food-product and tells you if it is vegan or not. It is an useful tool for vegans and vegetarians - Developed with usability and simplicity in mind, so without distracting irrelevant facts or advertising.
Veganify combines the Databases of OpenFoodFacts, OpenBeautyFacts and Open EAN Database, as well as our very own ingredient checker in one tool.

<details>
  <summary>See an example of how it works!</summary>
  <img src="https://user-images.githubusercontent.com/4144601/198900839-8dc58d58-fdb8-48b6-93e4-a4662ae64954.mov" width="300">
  <img src="https://user-images.githubusercontent.com/4144601/198900861-49ef1a5f-0663-4d73-b72d-d147cddaabd3.MP4" width="300">
</details>

The [Veganify Ingredients API](https://github.com/frontendnetwork/Veganify-API) checks the products ingredients against a list of thousands of non-vegan items.

<p align="center">
<a href="https://veganify.app">Open PWA in browser</a> | <a href="https://frontendnet.work/#projects">Product page on FrontEndNetwork</a> | <a href="https://frontendnet.work/veganify-api">Use the API</a> | <a href="https://shareshortcuts.com/shortcuts/2224-vegancheck.html">iOS Shortcut</a> | <a href="https://stats.uptimerobot.com/LY1gRuP5j6">Uptime Status</a>
</p>

## Developer Guide

> [!TIP]
> We're using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages. Please follow this convention when making changes.

### Prerequisites

- Node.js 20 or later
- pnpm (enabled via corepack)

To enable pnpm using corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/frontendnetwork/veganify.git
   cd veganify
   ```
2. Install dependencies & start dev server:

   ```bash
   pnpm install
   pnpm dev
   ```

### Project Structure

```
src/
├── @components/
│   ├── shared/
│   ├── ComponentName/
│   │   ├── hooks/      			# Component-specific hooks
│   │   ├── utils/      			# Component-specific utilities
│   │   │	├── util.ts
│   │   │	└──	util.test.ts		# Utility specify tests
│   │   ├── models/     			# Component-specific types/interfaces
│   │   ├── componentPart.tsx		# Component files
│   │   └── index.tsx				# Component files
├── @models/        # Global type definitions
├── styles/         # CSS styles
├── tests/          # Only test setup files & Playwright tests
└── locales/        # next-intl translation files
```

### Development Commands

```bash
# Start development server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm check-types

# Run unit tests
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Build for production
pnpm build
```

### Development Guidelines

> [!NOTE]  
> We're aware not everything in this repo follows those standards. This is because of how the project was started and evolved. We're working on improving this.

#### Component Structure

- Break down components into smaller, reusable pieces
- Each significant component should have its own directory with the following structure:
  - `hooks/` for component-specific hooks
  - `utils/` for component-specific utilities
  - `models/` for component-specific types
- Small, simple components can be single files

#### Testing

- All utility functions must have 100% test coverage
- Tests are written using Jest for unit testing
- Components currently don't require test coverage
- Playwright is used for end-to-end testing but currently only coversa few basics use cases. More tests are needed.

#### TypeScript

- TypeScript is mandatory
- The `any` type is not acceptable unless absolutely necessary
- Always define proper interfaces and types in the appropriate `models` folder
- Use type inference when possible

#### Internationalization

- Use `next-intl` for translations
- Add new translations to all language files in `/locales`
- Follow the existing translation key structure

#### Code Style

- Follow Node.js, React, and Next.js best practices
- Use the App Router pattern for routing
- Keep components pure and functional when possible
- Use hooks for state management and side effects
- Follow the DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused

#### Styling

- Place all styles in the `styles` folder
- Keep styles modular and scoped to components when possible
- Be sure to use SCSS for styling
- Use CSS variables for theming and repeated values

When making a contribution, please follow these guidelines to ensure consistency and maintainability.

Remember that every contribution, no matter how small, is valuable to the project. Thank you for helping make Veganify better!

## Support

Please refer to our issue trackers to see where you could help:

- [[Tasks] Code Improvements](https://github.com/frontendnetwork/veganify/issues/52)
- [[Tasks] Localization](https://github.com/frontendnetwork/veganify/issues/59)

<a href="https://fink.inlang.com/github.com/frontendnetwork/veganify?ref=badge"><img src="https://badge.inlang.com/?url=github.com/frontendnetwork/veganify" alt="Veganify on Inlang" style="border-radius: 5%;"></a>

or if you find something else you could improve, just open a new issue for it!

### Support us

<a href="https://github.com/sponsors/philipbrembeck"><img src="https://img.shields.io/badge/Sponsor%20on%20GitHub-white.svg?logo=githubsponsors" alt="Consider Sponsoring"></a>
<a href="https://ko-fi.com/vegancheck"><img src="https://img.shields.io/badge/Buy%20us%20a%20coffee-white.svg?logo=kofi" alt="Buy us a coffee"></a>
<a href="https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536"><img src="https://shields.io/badge/Donate%20with%20PayPal-blue?style=flat&logo=Paypal" alt="Donate"></a>

### Premium Supporters

<a href="https://uptimerobot.com">
	<picture>
	  <source srcset="https://github.com/user-attachments/assets/2ae2e9eb-5099-4962-87fb-a99a0b069e29" media="(prefers-color-scheme: dark)" width="120">
	  <img src="https://github.com/user-attachments/assets/638da2ff-755d-4343-acc1-330e41fbda95" width="120">
	</picture>
</a>

<a href="https://veganism.social/@mvtracing">
	<picture>
	  <source srcset="https://user-images.githubusercontent.com/4144601/218593453-28333f8a-3e24-46d2-8bc9-856eb2e4a390.png" media="(prefers-color-scheme: dark)" width="120">
	  <img src="https://user-images.githubusercontent.com/4144601/218593448-cde11d35-97ec-498d-8aa9-6613ed5471bd.png" width="120">
	</picture>
</a>

<a href="https://philip.media">
	<picture>
	  <source srcset="https://user-images.githubusercontent.com/4144601/218594015-e28f4b94-c6ac-4ad7-842f-83296adc9d74.svg" media="(prefers-color-scheme: dark)" width="160">
	  <img src="https://user-images.githubusercontent.com/4144601/218594012-3a5968bc-5145-4f7a-aeed-e411164ddb71.svg" width="160">
	</picture>
</a>

## Dependencies & Credits

This repo uses:

- [Quagga.js](https://serratus.github.io/quaggaJS/)
- [OpenFoodFacts API](https://openfoodfacts.org/) & [OpenBeautyFacts API](https://openbeautyfacts.org/) [@openfoodfacts](https://github.com/openfoodfacts)
- [Open EAN Database](https://opengtindb.org)

## License

All text and code in this repository is licensed under [MIT](https://github.com/frontendnetwork/veganify/blob/main/LICENSE), © 2024 Philip Brembeck, © 2024 FrontEndNetwork.
