# NexaStudio — Digital Creative Agency Website

![NexaStudio Banner](https://via.placeholder.com/1280x400/0A0A0F/6C63FF?text=NexaStudio+%E2%80%94+Digital+Creative+Agency)

A modern, fully responsive digital agency website built with **pure HTML5, CSS3, and Vanilla JavaScript** — zero frameworks, zero dependencies, production-quality code.

---

## 📋 Project Description

NexaStudio is a single-page digital agency website showcasing services, portfolio work, team values, client testimonials, and a validated contact form. Every interaction — from the typed headline to the scroll-reveal animations to the portfolio filter — is built from scratch with clean, maintainable JavaScript.

The design system uses an electric-violet-on-near-black palette with deliberate use of CSS custom properties (design tokens), making the entire visual identity easy to retheme.

---

## ✨ Features

### Pages / Sections
- **Sticky Navigation Bar** — glass-blur effect on scroll, active-link highlight
- **Hero Section** — animated dot-grid background, floating glow blobs, typed text, animated stat counters
- **Services Section** — 6 animated feature cards with hover glow effects
- **Portfolio / Work Section** — filterable project grid (All / Brand / Web / Motion) with overlay animation
- **About Section** — two-column layout with values list
- **Testimonials Section** — client review cards
- **Contact Section** — full form with inline validation and success state
- **Footer** — multi-column with social links, navigation, and auto-updating copyright year

### JavaScript Interactions
- ✅ Responsive Hamburger Menu (slide-in drawer, focus trap, Escape key close)
- ✅ Smooth Scroll (native, offset-corrected for sticky nav)
- ✅ Scroll Reveal Animations (IntersectionObserver — up / left / right directions)
- ✅ Active Navigation Highlight (scroll-position based)
- ✅ Back To Top Button (shows after 400px scroll)
- ✅ Contact Form Validation (inline errors on blur, submit guard, loading state, success message)
- ✅ Typed Headline Effect (cycles through 5 phrases)
- ✅ Animated Count-Up Stats (eased number animation)
- ✅ Portfolio Filter (category-based show/hide)

### Responsive Design
- Mobile-First CSS approach
- CSS Grid + Flexbox throughout
- Media query breakpoints: 400px / 640px / 768px / 960px / 1024px / 1280px
- Works perfectly on: Mobile, Tablet, Laptop, Desktop

### Accessibility
- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA attributes on interactive elements
- Focus trap in mobile menu
- `prefers-reduced-motion` respected
- Keyboard navigable (visible focus rings)
- Skip-to-content link ready
- `role="alert"` on form errors (screen reader friendly)

---

## 🛠 Technologies Used

| Technology     | Usage                                      |
|----------------|--------------------------------------------|
| HTML5          | Semantic structure, accessibility          |
| CSS3           | Custom properties, Grid, Flexbox, animations |
| Vanilla JS     | All interactions — no libraries            |
| Google Fonts   | Syne (display) + Inter (body)              |

**NOT used:** React, Vue, Angular, Bootstrap, Tailwind CSS, jQuery, any npm packages, any CDN libraries (except Google Fonts).

---

## 📁 Folder Structure

```
NexaStudio
│
├── index.html      ← Semantic HTML, all sections
├── style.css       ← Complete design system + responsive styles
├── script.js       ← All JavaScript modules
└── README.md       ← This file
```

---

## 🚀 How to Run (Windows 11)

### Step 1 — Create the Project Folder
Open **File Explorer**, navigate to your desired location (e.g., `C:\Users\YourName\Desktop`), and create a new folder called `NexaStudio`.

### Step 2 — Create the Files
Inside `C:\Users\YourName\Desktop\NexaStudio`, create these files:
```
index.html
style.css
script.js
README.md
```

### Step 3 — Paste the Code
Open each file in any text editor (Notepad, VS Code, etc.) and paste the corresponding code.

### Step 4 — Open in VS Code
Right-click the `NexaStudio` folder → **"Open with Code"**
(or open VS Code and use **File → Open Folder**)

### Step 5 — Run with Live Server
1. In VS Code, go to **Extensions** (Ctrl+Shift+X)
2. Search for **"Live Server"** by Ritwick Dey
3. Click **Install**
4. Open `index.html` in the editor
5. Click **"Go Live"** in the bottom status bar
6. Your browser will open at `http://127.0.0.1:5500`

### Step 6 — Verify Responsiveness
In your browser, press **F12** to open DevTools, then:
- Click the **device toolbar icon** (or press Ctrl+Shift+M)
- Test at: Mobile (375px), Tablet (768px), Laptop (1024px), Desktop (1440px)

---

## 📸 Screenshots

| Section          | Preview                                           |
|------------------|---------------------------------------------------|
| Hero             | *(Add screenshot here)*                          |
| Services Cards   | *(Add screenshot here)*                          |
| Portfolio Filter | *(Add screenshot here)*                          |
| Contact Form     | *(Add screenshot here)*                          |
| Mobile View      | *(Add screenshot here)*                          |

---

## 🎨 Design Tokens (Color Palette)

| Token             | Value       | Usage                        |
|-------------------|-------------|------------------------------|
| `--clr-bg`        | `#0A0A0F`   | Page background              |
| `--clr-surface`   | `#13131A`   | Cards, nav, footer           |
| `--clr-surface2`  | `#1C1C27`   | Elevated elements            |
| `--clr-accent`    | `#6C63FF`   | Electric violet — primary    |
| `--clr-accent2`   | `#FF6B6B`   | Coral — secondary / errors   |
| `--clr-text`      | `#E8E8F0`   | Primary body text            |
| `--clr-muted`     | `#8888A8`   | Secondary / caption text     |
| `--clr-border`    | `#2A2A3A`   | Dividers, card borders       |

**Fonts:** Syne (display, headings) + Inter (body, UI)

---

## 👤 Author

**NexaStudio**
Built as a production-quality frontend project template.

---

## 📄 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).

You are free to use, modify, and distribute this project for personal and commercial purposes with attribution.

---

*Built with HTML5 · CSS3 · Vanilla JavaScript — no frameworks harmed in the making of this website.*
