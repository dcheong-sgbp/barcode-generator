# Usage & API

It is a standard custom element, so it works with no wrapper in plain HTML, React, Vue, Svelte and Astro.

## Plain HTML

```html
<script src="barcode-generator.js"></script>
<barcode-generator></barcode-generator>
```

## React

```jsx
import "@sgbp/barcode-generator";
export default function Page() { return <barcode-generator />; }
```

## Vue

```vue
<script setup>
import "@sgbp/barcode-generator";
</script>

<template>
  <barcode-generator />
</template>
```

---

Prefer to just use it without installing anything? The
[live Barcode Generator](https://sgbp.tech/tools/barcode-generator) is hosted and ready to go.
