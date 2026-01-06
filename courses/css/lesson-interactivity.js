/* AccrediPro Academy - Lesson Interactivity
 * Shared JavaScript for all course lessons
 * Handles: reveal/hide buttons, smooth scrolling, etc.
 */

// Toggle answer visibility for quiz questions
function toggleAnswer(id) {
    const element = document.getElementById(id);
    if (!element) return;

    if (element.style.display === "block") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}

// Alternative: Show answer and hide button
function showAnswer(button) {
    const answerDiv = button.nextElementSibling;
    if (answerDiv && answerDiv.classList.contains('answer-text')) {
        answerDiv.style.display = 'block';
        button.style.display = 'none';
    }
}

// Smooth scroll to section
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize all reveal buttons on page load
document.addEventListener('DOMContentLoaded', function () {
    // Find all reveal buttons and attach click handlers
    const revealButtons = document.querySelectorAll('.reveal-btn');
    revealButtons.forEach(function (button, index) {
        // Ensure button has proper onclick behavior
        if (!button.onclick) {
            button.onclick = function () {
                showAnswer(this);
            };
        }
    });

    // Smooth scroll for TOC links
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.substring(1));
            }
        });
    });
});
