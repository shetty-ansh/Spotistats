import { Component } from '@angular/core';
import { CardData } from './morphing-card-stack.component';

@Component({
  selector: 'app-morphing-card-demo',
  standalone: false,
  template: `
    <app-morphing-card-stack 
      [cards]="cardData"
      (cardClick)="onCardClick($event)">
    </app-morphing-card-stack>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }
  `]
})
export class MorphingCardDemoComponent {
  cardData: CardData[] = [
    {
      id: "1",
      title: "Magnetic Dock",
      description: "Cursor-responsive scaling with smooth spring animations",
      icon: "layers",
    },
    {
      id: "2",
      title: "Gradient Mesh",
      description: "Dynamic animated gradient backgrounds that follow your cursor",
      icon: "palette",
    },
    {
      id: "3",
      title: "Pulse Timeline",
      description: "Interactive timeline with animated pulse nodes",
      icon: "clock",
    },
    {
      id: "4",
      title: "Command Menu",
      description: "Radial command palette with keyboard navigation",
      icon: "sparkles",
    },
  ];

  onCardClick(card: CardData) {
    console.log('Card clicked:', card);
  }
}
