// Slide deck navigation functionality
class SlidePresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentSlideElement = document.getElementById('current-slide');
        this.totalSlidesElement = document.getElementById('total-slides');
        
        this.init();
    }
    
    init() {
        // Set initial values
        this.currentSlideElement.textContent = this.currentSlide;
        this.totalSlidesElement.textContent = this.totalSlides;
        
        // Bind event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Update initial button states
        this.updateButtonStates();
        
        // Ensure first slide is visible
        this.showSlide(this.currentSlide);
    }
    
    showSlide(slideNumber) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        const targetSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }
        
        // Update counter
        this.currentSlideElement.textContent = slideNumber;
        
        // Update button states
        this.updateButtonStates();
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.showSlide(this.currentSlide);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.showSlide(this.currentSlide);
        }
    }
    
    updateButtonStates() {
        // Update previous button
        if (this.currentSlide === 1) {
            this.prevBtn.disabled = true;
        } else {
            this.prevBtn.disabled = false;
        }
        
        // Update next button
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.disabled = true;
            this.nextBtn.textContent = 'End';
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.textContent = 'Next';
        }
    }
    
    handleKeyNavigation(event) {
        // Arrow key navigation
        switch(event.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
                event.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.currentSlide = slideNumber;
            this.showSlide(this.currentSlide);
        }
    }
}

// Enhanced features for presentation
class PresentationEnhancements {
    constructor(slidePresentation) {
        this.presentation = slidePresentation;
        this.init();
    }
    
    init() {
        // Add smooth scroll behavior for better UX
        this.addSmoothTransitions();
        
        // Add progress indication
        this.addProgressBar();
        
        // Add slide timing (optional - for presentation mode)
        this.initSlideTimers();
        
        // Add fullscreen support
        this.addFullscreenSupport();
    }
    
    addSmoothTransitions() {
        // Enhanced slide transitions are already handled in CSS
        // This method can be extended for more complex animations
        
        // Add entrance animations for slide content
        this.presentation.slides.forEach(slide => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSlideContent(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(slide);
        });
    }
    
    animateSlideContent(slide) {
        // Animate content elements with stagger effect
        const animatableElements = slide.querySelectorAll('h2, h3, .summary-item, .stat-large, .feature, .case, .highlight');
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    addProgressBar() {
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;
        
        // Add styles for progress bar
        const progressStyles = `
            <style>
                .progress-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: rgba(var(--color-border-rgb, 94, 82, 64), 0.3);
                    z-index: 1000;
                }
                .progress-bar {
                    height: 100%;
                    width: 100%;
                    position: relative;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--color-primary);
                    width: 0%;
                    transition: width 0.3s ease;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', progressStyles);
        document.body.appendChild(progressContainer);
        
        // Update progress on slide change
        const updateProgress = () => {
            const progress = (this.presentation.currentSlide / this.presentation.totalSlides) * 100;
            document.querySelector('.progress-fill').style.width = `${progress}%`;
        };
        
        // Initial progress
        updateProgress();
        
        // Update progress when slides change
        const originalShowSlide = this.presentation.showSlide.bind(this.presentation);
        this.presentation.showSlide = function(slideNumber) {
            originalShowSlide(slideNumber);
            updateProgress();
        };
    }
    
    initSlideTimers() {
        // Optional: Add slide timing for auto-advance (disabled by default)
        this.autoAdvanceEnabled = false;
        this.slideInterval = null;
        
        // Method to enable auto-advance (can be called manually)
        this.enableAutoAdvance = (intervalMs = 30000) => {
            this.autoAdvanceEnabled = true;
            this.slideInterval = setInterval(() => {
                if (this.presentation.currentSlide < this.presentation.totalSlides) {
                    this.presentation.nextSlide();
                } else {
                    this.disableAutoAdvance();
                }
            }, intervalMs);
        };
        
        this.disableAutoAdvance = () => {
            this.autoAdvanceEnabled = false;
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
        };
        
        // Disable auto-advance on user interaction
        document.addEventListener('click', () => this.disableAutoAdvance());
        document.addEventListener('keydown', () => this.disableAutoAdvance());
    }
    
    addFullscreenSupport() {
        // Add fullscreen toggle functionality
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'Toggle Fullscreen (F11)';
        
        // Add fullscreen button styles
        const fullscreenStyles = `
            <style>
                .fullscreen-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: var(--color-primary);
                    color: var(--color-btn-primary-text);
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    z-index: 1000;
                    transition: all 0.3s ease;
                    opacity: 0.7;
                }
                .fullscreen-btn:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }
                @media (max-width: 768px) {
                    .fullscreen-btn {
                        display: none;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', fullscreenStyles);
        document.body.appendChild(fullscreenBtn);
        
        // Fullscreen functionality
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
        
        // F11 key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                fullscreenBtn.click();
            }
        });
    }
}

// Analytics and tracking (simplified)
class PresentationAnalytics {
    constructor(slidePresentation) {
        this.presentation = slidePresentation;
        this.slideStartTime = Date.now();
        this.slideViews = {};
        this.totalTime = 0;
        
        this.init();
    }
    
    init() {
        // Track slide views and time spent
        const originalShowSlide = this.presentation.showSlide.bind(this.presentation);
        this.presentation.showSlide = (slideNumber) => {
            this.trackSlideView(this.presentation.currentSlide);
            originalShowSlide(slideNumber);
            this.slideStartTime = Date.now();
        };
        
        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            this.trackSlideView(this.presentation.currentSlide);
            this.logAnalytics();
        });
    }
    
    trackSlideView(slideNumber) {
        const timeSpent = Date.now() - this.slideStartTime;
        
        if (!this.slideViews[slideNumber]) {
            this.slideViews[slideNumber] = 0;
        }
        
        this.slideViews[slideNumber] += timeSpent;
        this.totalTime += timeSpent;
    }
    
    logAnalytics() {
        // In a real application, this would send data to analytics service
        console.log('Presentation Analytics:', {
            totalTime: this.totalTime,
            slideViews: this.slideViews,
            completionRate: (this.presentation.currentSlide / this.presentation.totalSlides) * 100
        });
    }
    
    getEngagementReport() {
        return {
            totalTimeMinutes: Math.round(this.totalTime / 60000),
            mostViewedSlide: Object.keys(this.slideViews).reduce((a, b) => 
                this.slideViews[a] > this.slideViews[b] ? a : b
            ),
            completionRate: (this.presentation.currentSlide / this.presentation.totalSlides) * 100,
            averageTimePerSlide: this.totalTime / Object.keys(this.slideViews).length
        };
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create main presentation instance
    const slidePresentation = new SlidePresentation();
    
    // Add enhancements
    const enhancements = new PresentationEnhancements(slidePresentation);
    
    // Add analytics (optional)
    const analytics = new PresentationAnalytics(slidePresentation);
    
    // Expose to global scope for debugging
    window.presentation = {
        slidePresentation,
        enhancements,
        analytics,
        // Utility methods
        goToSlide: (n) => slidePresentation.goToSlide(n),
        enableAutoAdvance: (ms) => enhancements.enableAutoAdvance(ms),
        getReport: () => analytics.getEngagementReport()
    };
    
    // Add presentation ready event
    document.dispatchEvent(new CustomEvent('presentationReady', {
        detail: { presentation: slidePresentation }
    }));
    
    console.log('LeanFlow Presentation loaded successfully');
    console.log('Use arrow keys or navigation buttons to navigate slides');
    console.log('Press F11 for fullscreen mode');
});