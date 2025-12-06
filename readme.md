# AquaBuilder

**AquaBuilder** is a full-featured aquarium planning tool inspired by PCPartPicker, built with Next.js, TypeScript, and Tailwind CSS. It helps aquarium enthusiasts design compatible aquatic environments by selecting fish, plants, equipment, and substrate with real-time compatibility validation.

---

## 🌊 Project Overview

AquaBuilder provides:

- 🐟 Real-time compatibility checks for aquatic life and equipment
- 💡 Smart suggestions and stocking level calculations
- 🧪 Water parameter visualizers
- 📊 Equipment and livestock catalogs with filtering and sorting
- 🎨 Responsive, accessible UI with a light-themed aqua palette

---

## 🧱 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Storage**: LocalStorage + shareable URLs

---

## 📁 Project Structure

```
/app        → Next.js App Router structure
/components → Reusable UI components
/data       → Static sample fish, plants, equipment, etc.
/lib        → Compatibility logic & utilities
/store      → Zustand store for build state
/types      → Aquarium entity TypeScript interfaces
```

---

## 🤖 GitHub Copilot Agent Setup

This project includes a custom configuration for GitHub Copilot Agents.

### 📌 Setup

1. Copy `.copilot/config.json` to your project root.
2. Paste the content into VS Code Copilot Chat “Project Context” if using Copilot Chat.

### 🔍 Copilot Instructions

- Use **Tailwind CSS utility classes** and reusable design tokens
- Build **modular, accessible components** with ARIA support
- Store app state with Zustand in `/store`
- Place all compatibility logic in pure functions under `/lib/compatibility`
- Use **TypeScript interfaces** defined in `/types`
- Avoid prop drilling: lift shared state to context or store

---

## 🚀 Getting Started

```bash
pnpm install
pnpm dev
```

Then visit `http://localhost:3000`

---

## 🔒 Accessibility & Performance

- Fully keyboard navigable
- ARIA labels on interactive components
- Fast load via optimized images and virtualized lists
- Light theme with colorblind-safe status indicators

---

## 📄 License

MIT
