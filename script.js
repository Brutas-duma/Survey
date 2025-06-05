// Initializing Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA0nKBzWFwRU0SOdeYyVdBs8wdF9uVPN6E",
    projectId: "eventbuddy-43d94",
    appId: "1:191583404156:android:e4f36aa97d5b8c4ece89f9"
};

// Initializing Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Calculate age from date of birth
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Form submission handler
document.getElementById('surveyForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Error messages
    document.getElementById('formError').textContent = '';
    document.getElementById('ageError').textContent = '';
    document.getElementById('successMessage').textContent = '';
    
    // Retrieve form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const dob = document.getElementById('dob').value;
    const contactNumber = document.getElementById('contactNumber').value.trim();
    
    // Validate required fields
    if (!fullName || !email || !dob || !contactNumber) {
        document.getElementById('formError').textContent = 'Please fill in all required fields.';
        return;
    }
    
    // Calculate age and validate
    const age = calculateAge(dob);
    if (age < 5 || age > 120) {
        document.getElementById('ageError').textContent = 'Age must be between 5 and 120 years.';
        return;
    }
    
    // Get favorite foods (can be multiple)
    const foodCheckboxes = document.querySelectorAll('input[name="food"]:checked');
    if (foodCheckboxes.length === 0) {
        document.getElementById('formError').textContent = 'Please select at least one favorite food.';
        return;
    }
    const favoriteFoods = Array.from(foodCheckboxes).map(cb => cb.value);
    
    // Get ratings
    const moviesRating = document.querySelector('input[name="movies"]:checked')?.value;
    const radioRating = document.querySelector('input[name="radio"]:checked')?.value;
    const eatOutRating = document.querySelector('input[name="eatOut"]:checked')?.value;
    const tvRating = document.querySelector('input[name="tv"]:checked')?.value;
    
    if (!moviesRating || !radioRating || !eatOutRating || !tvRating) {
        document.getElementById('formError').textContent = 'Please provide ratings for all questions.';
        return;
    }
    
    // Prepare survey data
    const surveyData = {
        fullName,
        email,
        dob,
        age,
        contactNumber,
        favoriteFoods,
        moviesRating: parseInt(moviesRating),
        radioRating: parseInt(radioRating),
        eatOutRating: parseInt(eatOutRating),
        tvRating: parseInt(tvRating),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        // Save to Firestore
        await db.collection('users').add(surveyData);
        
        // Show success message and reset form
        document.getElementById('successMessage').textContent = 'Survey submitted successfully! Thank you.';
        document.getElementById('surveyForm').reset();
    } catch (error) {
        console.error('Error saving survey:', error);
        document.getElementById('formError').textContent = 'An error occurred while submitting the survey. Please try again.';
    }
});
