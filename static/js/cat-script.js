// *** IMPORTANT: Replace 'YOUR_CAT_API_KEY' with your actual Cat API key ***
// You can get a free API key from https://thecatapi.com/signup
const CAT_API_KEY = 'live_9kbPD7TmErSDJPol1AnxGfhC3FrGA0sMrANmKqJ8myGb2rGJ5gfLSJp1pk3F6zcS';

const breedSelect = document.getElementById('breedSelect');
const showButton = document.getElementById('showButton');
const catImageDiv = document.getElementById('catImage');
const messageBoxOverlay = document.getElementById('messageBoxOverlay');
const messageBoxText = document.getElementById('messageBoxText');
const messageBoxCloseButton = document.getElementById('messageBoxCloseButton');

/**
 * Displays a custom message box instead of alert().
 * @param {string} message The message to display.
 */
function showMessageBox(message) {
    messageBoxText.textContent = message;
    messageBoxOverlay.style.display = 'flex';
}

/**
 * Hides the custom message box.
 */
function hideMessageBox() {
    messageBoxOverlay.style.display = 'none';
}

/**
 * Fetches a list of cat breeds from TheCatAPI and populates the dropdown.
 */
async function fetchCatBreeds() {
    // Display loading state
    breedSelect.innerHTML = '<option value="">Loading breeds...</option>';
    breedSelect.disabled = true;
    showButton.disabled = true;

    try {
        const response = await fetch('https://api.thecatapi.com/v1/breeds', {
            headers: {
                'x-api-key': CAT_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const breeds = await response.json();

        // Clear existing options and add a default
        breedSelect.innerHTML = '<option value="">Select a cat breed</option>';

        // Populate the dropdown with fetched breeds
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });

        breedSelect.disabled = false;
        showButton.disabled = false;

    } catch (error) {
        console.error('Error fetching cat breeds:', error);
        breedSelect.innerHTML = '<option value="">Failed to load breeds</option>';
        showMessageBox('Failed to load cat breeds. Please check your API key and network connection.');
    }
}

/**
 * Fetches and displays an image for the selected cat breed.
 * @param {string} breedId The ID of the selected cat breed.
 */
async function fetchCatImage(breedId) {
    if (!breedId) {
        catImageDiv.style.backgroundImage = 'url("https://placehold.co/480x320/0d0d0d/d4af37?text=Select+a+cat+breed")';
        catImageDiv.innerHTML = 'Select a cat breed to view its image.';
        return;
    }

    // Show loading spinner
    catImageDiv.style.backgroundImage = 'none'; // Remove any previous image
    catImageDiv.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
            headers: {
                'x-api-key': CAT_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.length > 0 && data[0].url) {
            const imageUrl = data[0].url;
            catImageDiv.style.backgroundImage = `url("${imageUrl}")`;
            catImageDiv.innerHTML = ''; // Clear loading spinner or text
        } else {
            catImageDiv.style.backgroundImage = 'url("https://placehold.co/480x320/0d0d0d/d4af37?text=No+image+found")';
            catImageDiv.innerHTML = 'No image found for this breed.';
        }
    } catch (error) {
        console.error('Error fetching cat image:', error);
        catImageDiv.style.backgroundImage = 'url("https://placehold.co/480x320/0d0d0d/d4af37?text=Error+loading+image")';
        catImageDiv.innerHTML = 'Failed to load image.';
        showMessageBox('Failed to load cat image. Please try again later.');
    }
}

// Event Listeners
showButton.addEventListener('click', () => {
    const selectedBreedId = breedSelect.value;
    fetchCatImage(selectedBreedId);
});

messageBoxCloseButton.addEventListener('click', hideMessageBox);

// Initial fetch of cat breeds when the page loads
document.addEventListener('DOMContentLoaded', fetchCatBreeds);
