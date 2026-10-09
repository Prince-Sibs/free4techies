# Contributing to free4techies

Thank you for considering contributing!

## How to Contribute

1. Fork the repository.
2. Add your resource to `contribution/resources.json` following the structure in `public/resources.json`.
3. Open a pull request against `main`.

## Valid Category Slugs

Use one of these predefined category slugs when adding resources:

- `ai-ml` — AI & ML
- `development-tools` — Development Tools
- `hosting-deployment` — Hosting / Deployment
- `databases-storage` — Databases & Storage
- `design-ui` — Design & UI
- `learning` — Learning
- `productivity-collaboration` — Productivity & Collaboration
- `others` — Others (for resources that don't fit elsewhere)

## Format for `contribution/resources.json`

```json
{
  "development-tools": [
    {
      "name": "Tool Name",
      "desc": "Short description",
      "link": "https://example.com"
    }
  ],
  "others": [
    {
      "name": "Uncategorized Tool",
      "desc": "Resource that doesn't fit other categories",
      "link": "https://example.com"
    }
  ]
}
```

**Important Notes:**
- Use lowercase slug IDs (e.g., `development-tools`, not `Development Tools`)
- Keep descriptions concise (under 80 characters)
- Ensure links are valid and publicly accessible
- Resources not matching existing categories should go in `others`
- Duplicate links are automatically deduplicated during merge

## CI/CD

GitHub Actions will validate and merge contributions automatically when possible.

## Code of Conduct

Be respectful and follow community guidelines.
