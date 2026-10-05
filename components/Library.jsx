// Function to handle star click
function setRating(ratingValue) {
  // Update UI stars
  updateStarUI(ratingValue);

  // Save rating to browser storage
  localStorage.setItem('user_star_rating', ratingValue);
}

// Function to restore rating on page load
function loadRating() {
  const savedRating = localStorage.getItem('user_star_rating');
  if (savedRating) {
    updateStarUI(parseInt(savedRating, 10));
  }
}

function updateStarUI(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active'); // CSS style for filled star
    } else {
      star.classList.remove('active');
    }
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadRating);