// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the results page
    if (document.getElementById('resultsContainer')) {
        loadSurveyResults();
    }
});

async function loadSurveyResults() {
    try {
        // Retrieve all surveys from Firestore collection 
        const querySnapshot = await db.collection('users').get();
        
        if (querySnapshot.empty) {
            // No surveys available
            document.getElementById('noSurveys').classList.remove('hidden');
            document.getElementById('resultsTable').classList.add('hidden');
            return;
        }
        
        // Show results table and hide "no surveys" message
        document.getElementById('noSurveys').classList.add('hidden');
        document.getElementById('resultsTable').classList.remove('hidden');
        
        // Initialization of variables for calculations
        let totalSurveys = 0;
        let ageSum = 0;
        let maxAge = 0;
        let minAge = Infinity;
        let pizzaCount = 0;
        let pastaCount = 0;
        let papWorsCount = 0;
        let moviesSum = 0;
        let radioSum = 0;
        let eatOutSum = 0;
        let tvSum = 0;
        
        // Process each survey
        querySnapshot.forEach(doc => {
            const data = doc.data();
            totalSurveys++;
            
            // Age calculations
            const age = data.age || 0; // Default to 0 if age is missing
            ageSum += age;
            if (age > maxAge) maxAge = age;
            if (age < minAge) minAge = age;
            
            // Favorite food counts - safely handle missing or undefined favoriteFoods
            const favoriteFoods = data.favoriteFoods || [];
            if (favoriteFoods.includes('Pizza')) pizzaCount++;
            if (favoriteFoods.includes('Pasta')) pastaCount++;
            if (favoriteFoods.includes('Pap and Wors')) papWorsCount++;
            
            // Rating sums (lower number = more agreement)
            moviesSum += data.moviesRating || 3; // Default to neutral (3) if missing
            radioSum += data.radioRating || 3;
            eatOutSum += data.eatOutRating || 3;
            tvSum += data.tvRating || 3;
        });
        
        // Calculate averages and percentages
        const avgAge = totalSurveys > 0 ? (ageSum / totalSurveys).toFixed(1) : 0;
        const pizzaPct = totalSurveys > 0 ? ((pizzaCount / totalSurveys) * 100).toFixed(1) : 0;
        const pastaPct = totalSurveys > 0 ? ((pastaCount / totalSurveys) * 100).toFixed(1) : 0;
        const papWorsPct = totalSurveys > 0 ? ((papWorsCount / totalSurveys) * 100).toFixed(1) : 0;
        //const papWorsPct = totalSurveys > 0 ? ((papWorsCount / totalSurveys) * 100).toFixed(1) : 0;

        
        // For ratings, we want to show the average (1-5 scale) but invert it for display
        // to show "agreement" (higher number = more agreement)
        const moviesAvg = totalSurveys > 0 ? (6 - (moviesSum / totalSurveys)).toFixed(1) : 0;
        const radioAvg = totalSurveys > 0 ? (6 - (radioSum / totalSurveys)).toFixed(1) : 0;
        const eatOutAvg = totalSurveys > 0 ? (6 - (eatOutSum / totalSurveys)).toFixed(1) : 0;
        const tvAvg = totalSurveys > 0 ? (6 - (tvSum / totalSurveys)).toFixed(1) : 0;
        
        // Update the UI with calculated values
        document.getElementById('totalSurveys').textContent = totalSurveys;
        document.getElementById('avgAge').textContent = avgAge;
        document.getElementById('maxAge').textContent = maxAge;
        document.getElementById('minAge').textContent = minAge === Infinity ? 0 : minAge;
        document.getElementById('pizzaPct').textContent = `${pizzaPct}%`;
        document.getElementById('pastaPct').textContent = `${pastaPct}%`;
        document.getElementById('papWorsPct').textContent = `${papWorsPct}%`;
        document.getElementById('moviesAvg').textContent = moviesAvg;
        document.getElementById('radioAvg').textContent = radioAvg;
        document.getElementById('eatOutAvg').textContent = eatOutAvg;
        document.getElementById('tvAvg').textContent = tvAvg;
        
    } catch (error) {
        console.error('Error loading survey results:', error);
        document.getElementById('noSurveys').textContent = 'Error loading survey results. Please try again.';
        document.getElementById('noSurveys').classList.remove('hidden');
        document.getElementById('resultsTable').classList.add('hidden');
    }
}
