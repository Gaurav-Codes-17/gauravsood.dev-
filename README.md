# Gaurav Sood - Portfolio Website

A premium dark-themed portfolio website built with Next.js 14, showcasing full-stack development projects including ZenFeed and ONS Logistics.

## Features

- 🎨 **Premium Dark Theme** - Sophisticated design with indigo and gold accents
- ⚡ **Next.js 14** - Latest App Router with server components
- 🎭 **Smooth Animations** - Subtle, professional animations throughout
- 📱 **Fully Responsive** - Optimized for all devices
- 🔍 **SEO Optimized** - Meta tags and structured data
- 🚀 **Fast Performance** - Optimized for speed and efficiency

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js and deploy

## Customization

### Update Personal Information

Edit `/app/page.tsx`:
- Line 47-52: Update name and bio
- Line 442-445: Update email and social links

### Modify Projects

Edit the project cards in `/app/page.tsx`:
- ZenFeed project: Lines 238-316
- ONS Logistics project: Lines 319-409

### Change Colors

Edit `/app/globals.css` CSS variables (lines 6-18):
```css
:root {
  --indigo:      #6387ff;
  --gold:        #e8c87a;
  /* ... more colors */
}
```

## Structure

```
portfolio-gaurav/
├── app/
│   ├── globals.css      # All styles
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main page component
├── public/              # Static assets
├── package.json
├── next.config.js
└── tsconfig.json
```

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Custom CSS with CSS Variables
- **Fonts:** Google Fonts (Cormorant Garamond, JetBrains Mono, Manrope)
- **Deployment:** Vercel (recommended)

## SEO Features

- Meta tags for social sharing
- OpenGraph protocol support
- Semantic HTML structure
- Fast loading times
- Mobile-optimized

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Email:** gauravsood@example.com
- **LinkedIn:** [Gaurav Sood](https://www.linkedin.com/in/gaurav-sood-1a345a163/)
- **GitHub:** [@Gaurav-Codes-17](https://github.com/Gaurav-Codes-17/)

---

Built with ❤️ by Gaurav Sood
