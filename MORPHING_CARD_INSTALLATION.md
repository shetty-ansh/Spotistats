# Morphing Card Stack - Angular Installation Guide

## 📦 Required Packages

Install the following package for Lucide icons:

```bash
npm install lucide-angular
```

## 🔧 Setup Instructions

### 1. Enable Animations Module

If not already enabled, add `BrowserAnimationsModule` to your `app.config.ts` or `main.ts`:

**For Standalone Apps (app.config.ts):**
```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // ... other providers
  ]
};
```

**Or for Module-based Apps (app.module.ts):**
```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    // ... other imports
  ]
})
```

### 2. Setup Lucide Icons

Add the Lucide icon script to your `index.html` (in the `<head>` or before closing `</body>`):

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>
  // Initialize Lucide icons after page load
  document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
  });
  
  // Re-initialize after Angular renders new content
  setInterval(() => {
    lucide.createIcons();
  }, 100);
</script>
```

**Alternative: Use lucide-angular package (Recommended)**

In your component, you can also import and use specific icons:

```typescript
import { LucideAngularModule, Layers, Grid3x3, LayoutList, Palette, Clock, Sparkles } from 'lucide-angular';

@Component({
  // ...
  imports: [LucideAngularModule],
})
```

### 3. Add Missing TrackBy Function

Add this method to `morphing-card-stack.component.ts`:

```typescript
trackByCardId(index: number, card: CardData & { stackPosition: number }): string {
  return card.id;
}
```

## 🎨 Usage

### Import in Your Component

```typescript
import { Component } from '@angular/core';
import { MorphingCardStackComponent, CardData } from './components/morphing-card-stack/morphing-card-stack.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [MorphingCardStackComponent],
  template: `
    <app-morphing-card-stack 
      [cards]="myCards"
      [defaultLayout]="'stack'"
      (cardClick)="handleCardClick($event)">
    </app-morphing-card-stack>
  `
})
export class MyPageComponent {
  myCards: CardData[] = [
    {
      id: "1",
      title: "Card Title",
      description: "Card description goes here",
      icon: "layers", // Lucide icon name
      color: "#f0f0f0" // Optional background color
    },
    // ... more cards
  ];

  handleCardClick(card: CardData) {
    console.log('Card clicked:', card);
  }
}
```

### Available Lucide Icon Names

Use these icon names in the `icon` property:
- `layers`
- `grid-3x3`
- `layout-list`
- `palette`
- `clock`
- `sparkles`
- And many more from [Lucide Icons](https://lucide.dev/icons/)

## 🎯 Component API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `cards` | `CardData[]` | `[]` | Array of card data to display |
| `defaultLayout` | `'stack' \| 'grid' \| 'list'` | `'stack'` | Initial layout mode |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `cardClick` | `EventEmitter<CardData>` | Emitted when a card is clicked |

### CardData Interface

```typescript
interface CardData {
  id: string;           // Unique identifier
  title: string;        // Card title
  description: string;  // Card description
  icon?: string;        // Lucide icon name (optional)
  color?: string;       // Background color (optional)
}
```

## ✨ Features

- ✅ Three layout modes: Stack, Grid, List
- ✅ Smooth animations using Angular's animation system
- ✅ Swipeable cards in stack mode
- ✅ Click to expand cards
- ✅ Pagination dots for stack mode
- ✅ Touch and mouse drag support
- ✅ Dark mode support
- ✅ Fully responsive

## 🎨 Customization

### Change Primary Color

Edit `morphing-card-stack.component.css` and replace `#1db954` (Spotify green) with your brand color:

```css
.layout-button.active {
  background-color: #your-color;
}

.dot.active {
  background-color: #your-color;
}
```

### Adjust Card Sizes

In the CSS file, modify:
- `.stack-container` for stack mode dimensions
- `.card-stack` for individual card sizes
- Grid/list spacing in `.grid-container` and `.list-container`

## 🐛 Troubleshooting

### Icons not showing?
- Make sure Lucide script is loaded in `index.html`
- Check browser console for errors
- Verify icon names match Lucide icon library

### Animations not working?
- Ensure `provideAnimations()` or `BrowserAnimationsModule` is imported
- Check that `@angular/animations` is installed

### Drag not working?
- Clear browser cache
- Check console for JavaScript errors
- Ensure you're using a modern browser

## 📱 Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

Enjoy your morphing card stack! 🎉
