import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

declare var gsap: any;

@Component({
    selector: 'app-dna',
    templateUrl: './dna.html',
    styleUrls: ['./dna.css'],
    standalone: false
})
export class DnaComponent implements OnInit, AfterViewInit, OnDestroy {
    private container: HTMLElement | null = null;
    private statsSide: HTMLElement | null = null;
    private currentFocusedCard: number = 0;
    private totalCards: number = 5;
    private scrollListener: any;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        // Get reference to the DNA container
        this.container = document.querySelector('.dna-container');
        this.statsSide = document.querySelector('.stats-side');

        // Set initial focus on first card
        this.updateFocusedCard(0);

        // Attach scroll listener to the stats-side element (the scrollable container)
        if (this.statsSide) {
            this.scrollListener = this.onStatsScroll.bind(this);
            this.statsSide.addEventListener('scroll', this.scrollListener);
        }
    }

    private onStatsScroll(event: Event): void {
        if (!this.statsSide || !this.container) return;

        // CONTINUOUS ROTATION: Map scroll position directly to rotation
        const scrollTop = this.statsSide.scrollTop;
        const maxScroll = this.statsSide.scrollHeight - this.statsSide.clientHeight;
        const scrollPercent = scrollTop / maxScroll;

        // Convert scroll percentage to rotation degrees
        // 0% scroll = 0°, 100% scroll = 720° (two full rotations)
        const rotationDegrees = scrollPercent * 720;

        // Smoothly update DNA rotation based on scroll position
        gsap.to(this.container, {
            rotationY: rotationDegrees,
            duration: 0.3,        // Very fast response
            ease: 'power1.out'    // Gentle easing
        });

        // CARD FOCUS: Still track which card is in center for highlighting
        const viewportHeight = window.innerHeight;
        const cards = document.querySelectorAll('.stat-card');
        let focusedIndex = 0;

        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;

            // Check if card center is near viewport center
            if (Math.abs(cardCenter - viewportCenter) < viewportHeight / 3) {
                focusedIndex = index;
            }
        });

        // Update focused card if changed (for visual highlighting only)
        if (focusedIndex !== this.currentFocusedCard) {
            this.updateFocusedCard(focusedIndex);
        }
    }

    private updateFocusedCard(index: number): void {
        this.currentFocusedCard = index;

        // Remove focus from all cards
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach(card => card.classList.remove('focused'));

        // Add focus to current card
        if (cards[index]) {
            cards[index].classList.add('focused');
        }

        // Note: DNA rotation is now handled continuously in onStatsScroll(),
        // not in discrete jumps here
    }

    ngOnDestroy(): void {
        // Clean up scroll listener to prevent memory leaks
        if (this.statsSide && this.scrollListener) {
            this.statsSide.removeEventListener('scroll', this.scrollListener);
        }
    }
}
