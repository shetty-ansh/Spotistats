import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

export type LayoutMode = 'stack' | 'grid' | 'list';

export interface CardData {
    id: string;
    title: string;
    description: string;
    icon?: string;
    color?: string;
}

@Component({
    selector: 'app-morphing-card-stack',
    standalone: false,
    templateUrl: './morphing-card-stack.component.html',
    styleUrls: ['./morphing-card-stack.component.css'],
    animations: [
        trigger('cardAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.8)' }),
                animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            transition(':leave', [
                animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0, transform: 'scale(0.8) translateX(-200px)' }))
            ])
        ]),
        trigger('expandAnimation', [
            state('collapsed', style({ transform: 'scale(1)' })),
            state('expanded', style({ transform: 'scale(1.05)' })),
            transition('collapsed <=> expanded', animate('200ms ease-out'))
        ])
    ]
})
export class MorphingCardStackComponent {
    @Input() cards: CardData[] = [];
    @Input() defaultLayout: LayoutMode = 'stack';
    @Output() cardClick = new EventEmitter<CardData>();

    layout: LayoutMode = 'stack';
    expandedCard: string | null = null;
    activeIndex: number = 0;
    isDragging: boolean = false;

    dragStartX: number = 0;
    dragCurrentX: number = 0;
    dragStartTime: number = 0;

    private readonly SWIPE_THRESHOLD = 50;

    layoutIcons = {
        stack: 'layers',
        grid: 'grid-3x3',
        list: 'layout-list'
    };

    layoutModes: LayoutMode[] = ['stack', 'grid', 'list'];

    ngOnInit() {
        this.layout = this.defaultLayout;
    }

    setLayout(mode: LayoutMode) {
        this.layout = mode;
        this.expandedCard = null;
    }

    getStackOrder(): (CardData & { stackPosition: number })[] {
        if (this.layout !== 'stack') {
            return this.cards.map((c, i) => ({ ...c, stackPosition: i }));
        }

        const reordered = [];
        for (let i = 0; i < this.cards.length; i++) {
            const index = (this.activeIndex + i) % this.cards.length;
            reordered.push({ ...this.cards[index], stackPosition: i });
        }
        return reordered.reverse();
    }

    getCardStyle(stackPosition: number): any {
        switch (this.layout) {
            case 'stack':
                return {
                    top: `${stackPosition * 8}px`,
                    left: `${stackPosition * 8}px`,
                    zIndex: this.cards.length - stackPosition,
                    transform: `rotate(${(stackPosition - 1) * 2}deg)`
                };
            case 'grid':
            case 'list':
                return {
                    top: '0',
                    left: '0',
                    zIndex: 1,
                    transform: 'rotate(0deg)'
                };
        }
    }

    getContainerClass(): string {
        switch (this.layout) {
            case 'stack':
                return 'stack-container';
            case 'grid':
                return 'grid-container';
            case 'list':
                return 'list-container';
        }
    }

    onCardClick(card: CardData & { stackPosition: number }) {
        if (this.isDragging) return;

        this.expandedCard = this.expandedCard === card.id ? null : card.id;
        this.cardClick.emit(card);
    }

    isTopCard(stackPosition: number): boolean {
        return this.layout === 'stack' && stackPosition === 0;
    }

    isExpanded(cardId: string): boolean {
        return this.expandedCard === cardId;
    }

    onDragStart(event: MouseEvent | TouchEvent, card: CardData & { stackPosition: number }) {
        if (!this.isTopCard(card.stackPosition)) return;

        this.isDragging = true;
        this.dragStartTime = Date.now();

        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        this.dragStartX = clientX;
        this.dragCurrentX = clientX;

        event.preventDefault();
    }

    onDragMove(event: MouseEvent | TouchEvent) {
        if (!this.isDragging) return;

        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        this.dragCurrentX = clientX;
    }

    onDragEnd(event: MouseEvent | TouchEvent) {
        if (!this.isDragging) return;

        const offsetX = this.dragCurrentX - this.dragStartX;
        const duration = Date.now() - this.dragStartTime;
        const velocityX = offsetX / duration;
        const swipe = Math.abs(offsetX) * velocityX;

        if (offsetX < -this.SWIPE_THRESHOLD || swipe < -1000) {
            this.activeIndex = (this.activeIndex + 1) % this.cards.length;
        } else if (offsetX > this.SWIPE_THRESHOLD || swipe > 1000) {
            this.activeIndex = (this.activeIndex - 1 + this.cards.length) % this.cards.length;
        }

        this.isDragging = false;
        this.dragStartX = 0;
        this.dragCurrentX = 0;
    }

    getDragTransform(card: CardData & { stackPosition: number }): string {
        if (!this.isDragging || !this.isTopCard(card.stackPosition)) {
            return '';
        }

        const offset = this.dragCurrentX - this.dragStartX;
        return `translateX(${offset}px) scale(1.02)`;
    }

    goToCard(index: number) {
        this.activeIndex = index;
    }

    getDescriptionClass(): string {
        switch (this.layout) {
            case 'stack':
                return 'line-clamp-3';
            case 'grid':
                return 'line-clamp-2';
            case 'list':
                return 'line-clamp-1';
            default:
                return '';
        }
    }

    trackByCardId(index: number, card: CardData & { stackPosition: number }): string {
        return card.id;
    }

    getLayoutIcon(mode: LayoutMode): string {
        return this.layoutIcons[mode];
    }

    getCardStyleWithDrag(card: CardData & { stackPosition: number }): any {
        const baseStyle = this.getCardStyle(card.stackPosition);
        const dragTransform = this.getDragTransform(card);

        return {
            ...baseStyle,
            backgroundColor: card.color || undefined,
            transform: dragTransform || baseStyle.transform
        };
    }
}
