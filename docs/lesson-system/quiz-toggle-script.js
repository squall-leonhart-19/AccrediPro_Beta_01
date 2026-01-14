/**
 * Quiz Toggle Script for AccrediPro Lessons
 * Used in "Check Your Understanding" sections
 */
function toggleAnswer(btn) {
    const answer = btn.nextElementSibling;
    const isHidden = answer.style.display === 'none' || !answer.style.display;
    answer.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? 'Hide Answer' : 'Reveal Answer';
}
