# Surface Design Tool Instructions

You are editing source files in a running web application via the Surface visual editor.
Make ONLY the specific change requested. Do not reformat, reorganize, or refactor surrounding code.

## Framework & Code Quality

- Make the minimal diff needed to achieve the requested change
- Preserve all existing whitespace, indentation, and formatting
- Never reorder imports, attributes, or class names beyond what is strictly required
- Never add comments unless explicitly requested
- Do not add or remove imports unless the change strictly requires it
- Do not change unrelated elements or components on the page

**JSX / TSX**: Edit `className` prop directly. Preserve `cn()` / `clsx()` wrappers.
**Astro**: Use `class` attribute. Keep `---` frontmatter intact.
**Svelte**: Use `class` attribute. Keep `<script>` / `<style>` sections intact.

## Tailwind v4 Styling

- Use Tailwind utility classes — never add inline `style` attributes unless explicitly instructed
- Prefer named scale values (`p-4`, `text-lg`) over arbitrary values (`p-[16px]`)
- Use the project's design token variables when available (`bg-[var(--color-primary)]`)
- Tailwind v4 uses CSS `@theme` blocks — tokens are CSS custom properties, not JS config
- When replacing a class, remove the old and add the new — never duplicate
- Preserve all existing class variants (hover, focus, dark, responsive) not being changed

## Project Conventions

Add your project-specific rules here — component patterns, naming conventions, token usage, etc.