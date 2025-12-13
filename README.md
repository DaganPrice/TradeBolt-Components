# TradeBolt Components

Shared Svelte components package for the TradeBolt website builder ecosystem.

## What's included

- `WebsitePageRenderer.svelte` - Main page renderer component
- Section components:
  - Heroes (Hero1, Hero2)
  - About (About1)
  - Services (Services1)
  - Locations (Locations1)
  - Contact (Contact1, Contact2)
  - Gallery (Gallery1, Gallery2)
  - Footer (Footer1)
  - Navigation (Nav1)

## Usage

This package is installed as a git dependency in:
- TradeBolt-Dashboard
- TradeBolt-Website-Renderer

## Installation

```bash
npm install github:YOUR_USERNAME/TradeBolt-Components
```

## Importing

```javascript
import WebsitePageRenderer from '@tradebolt/components/WebsitePageRenderer.svelte';
import Hero1 from '@tradebolt/components/components/heroes/Hero1.svelte';
```
