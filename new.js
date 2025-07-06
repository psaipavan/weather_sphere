// AI Diagnosis System
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const analyzeBtn = document.getElementById('analyze-btn');
    const findSpecialistsBtn = document.getElementById('find-specialists-btn');
    const findHospitalsBtn = document.getElementById('find-hospitals-btn');
    const locateMeBtn = document.getElementById('locate-me-btn');
    const symptomsInput = document.getElementById('symptoms-input');
    const conditionsResults = document.getElementById('conditions-results');
    const specialistsResults = document.getElementById('specialists-results');
    const hospitalsResults = document.getElementById('hospitals-results');
    const steps = document.querySelectorAll('.step');
    
    // Medical Knowledge Base
    const medicalConditions = {
        "flu": {
            symptoms: ["fever", "headache", "cough", "sore throat", "fatigue"],
            specialists: ["General Physician", "Internal Medicine"],
            severity: "moderate"
        },
        "migraine": {
            symptoms: ["headache", "nausea", "sensitivity to light", "throbbing pain"],
            specialists: ["Neurologist"],
            severity: "moderate"
        },
        "uti": {
            symptoms: ["burning sensation", "frequent urination", "pelvic pain"],
            specialists: ["Urologist", "Gynecologist"],
            severity: "moderate"
        },
        "allergy": {
            symptoms: ["sneezing", "runny nose", "itchy eyes", "rash"],
            specialists: ["Allergist"],
            severity: "mild"
        },
        "food poisoning": {
            symptoms: ["nausea", "vomiting", "diarrhea", "stomach pain"],
            specialists: ["Gastroenterologist"],
            severity: "moderate"
        }
    };
    
    const specialists = {
        "General Physician": "General care for common illnesses",
        "Neurologist": "Specializes in brain and nervous system disorders",
        "Cardiologist": "Heart and cardiovascular system specialist",
        "Gastroenterologist": "Digestive system specialist",
        "Urologist": "Urinary tract and male reproductive system",
        "Gynecologist": "Female reproductive health",
        "Allergist": "Allergies and immune system reactions",
        "Internal Medicine": "Complex adult diseases"
    };
    
    // Mock Hospitals Data
    let hospitalsData = [];
    let map;
    let markers = [];
    
    // Initialize
    initStepSystem();
    
    function initStepSystem() {
        analyzeBtn.addEventListener('click', analyzeSymptoms);
        findSpecialistsBtn.addEventListener('click', showSpecialists);
        findHospitalsBtn.addEventListener('click', showHospitalFinder);
        locateMeBtn.addEventListener('click', getCurrentLocation);
    }
    
    function goToStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        document.querySelector(`.step${stepNumber}`).classList.add('active'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // AI Symptom Analysis (Simulated)
    function analyzeSymptoms() {
        const symptomsText = symptomsInput.value.toLowerCase();
        
        if (!symptomsText) {
            alert("Please describe your symptoms");
            return;
        }
        
        // Show loading
        conditionsResults.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Analyzing symptoms...</div>';
        
        // Simulate AI processing delay
        setTimeout(() => {
            // Find matching conditions
            const matchedConditions = [];
            
            for (const [condition, data] of Object.entries(medicalConditions)) {
                const symptomMatches = data.symptoms.filter(symptom => 
                    symptomsText.includes(symptom)
                ).length;
                
                if (symptomMatches > 0) {
                    const confidence = Math.min(100, (symptomMatches / data.symptoms.length) * 100).toFixed(0);
                    matchedConditions.push({
                        name: condition.toUpperCase(),
                        confidence: confidence + "% match",
                        specialists: data.specialists,
                        severity: data.severity
                    });
                }
            }
            
            // Sort by confidence
            matchedConditions.sort((a, b) => parseFloat(b.confidence) - parseFloat(a.confidence));
            
            // Display results
            if (matchedConditions.length > 0) {
                conditionsResults.innerHTML = '';
                matchedConditions.forEach(condition => {
                    const conditionCard = document.createElement('div');
                    conditionCard.className = 'condition-card';
                    conditionCard.innerHTML = `
                        <h4>${condition.name}</h4>
                        <p><strong>Confidence:</strong> <span class="confidence">${condition.confidence}</span></p>
                        <p><strong>Severity:</strong> ${condition.severity}</p>
                        <p>${getConditionDescription(condition.name)}</p>
                    `;
                    conditionsResults.appendChild(conditionCard);
                });
                
                // Store the matched conditions in the button for next step
                findSpecialistsBtn.dataset.conditions = JSON.stringify(matchedConditions);
                goToStep(2);
            } else {
                conditionsResults.innerHTML = '<div class="no-results">No specific conditions identified. Please consult a general physician.</div>';
            }
        }, 1500);
    }
    
    function getConditionDescription(condition) {
        const descriptions = {
            "FLU": "Influenza is a viral infection that attacks your respiratory system. Rest and fluids are typically recommended.",
            "MIGRAINE": "A migraine is a headache that can cause severe throbbing pain, often accompanied by nausea and sensitivity to light.",
            "UTI": "A urinary tract infection (UTI) is an infection in any part of your urinary system. Antibiotics are typically needed.",
            "ALLERGY": "Allergies occur when your immune system reacts to a foreign substance such as pollen or certain foods.",
            "FOOD POISONING": "Food poisoning is caused by eating contaminated food. Symptoms often include vomiting and diarrhea."
        };
        return descriptions[condition] || "Consult a healthcare professional for proper diagnosis.";
    }
    
    function showSpecialists() {
        const matchedConditions = JSON.parse(this.dataset.conditions);
        const neededSpecialists = new Set();
        
        // Collect all unique specialists needed
        matchedConditions.forEach(condition => {
            condition.specialists.forEach(spec => neededSpecialists.add(spec));
        });
        
        // Display specialists
        specialistsResults.innerHTML = '';
        neededSpecialists.forEach(specialist => {
            const specialistCard = document.createElement('div');
            specialistCard.className = 'specialist-card';
            specialistCard.innerHTML = `
                <h4>${specialist}</h4>
                <p class="specialty">${specialists[specialist] || "Medical specialist"}</p>
                <p>Recommended for: ${matchedConditions.filter(c => 
                    c.specialists.includes(specialist)).map(c => c.name).join(', ')}</p>
            `;
            specialistsResults.appendChild(specialistCard);
        });
        
        // Store specialists for hospital search
        findHospitalsBtn.dataset.specialists = JSON.stringify(Array.from(neededSpecialists));
        goToStep(3);
    }
    
    function showHospitalFinder() {
        const neededSpecialists = JSON.parse(this.dataset.specialists);
        
        // In a real app, you would:
        // 1. Get user location
        // 2. Query backend API for hospitals with these specialists
        // For demo, we'll use mock data
        
        hospitalsData = generateMockHospitals(neededSpecialists);
        displayHospitals(hospitalsData);
        
        // Initialize map centered on first hospital
        if (hospitalsData.length > 0) {
            initMap(hospitalsData);
        }
        
        goToStep(4);
    }
    
    function generateMockHospitals(specialties) {
        const hospitalNames = [
            "City General Hospital", 
            "Metro Medical Center",
            "University Hospital",
            "Community Health Clinic",
            "Regional Medical Center"
        ];
        
        const facilities = [
            "Emergency", "Pharmacy", "ICU", "X-Ray", "Lab", "Pediatrics", "Surgery"
        ];
        
        return hospitalNames.map((name, i) => {
            // Randomly include some of the needed specialties
            const availableSpecialties = specialties.filter(() => Math.random() > 0.3);
            
            return {
                id: i + 1,
                name: name,
                address: `${100 + i * 50} Medical Dr, Healthcare City`,
                distance: (Math.random() * 15 + 1).toFixed(1) + " km",
                specialties: availableSpecialties.length > 0 ? availableSpecialties : ["General Physician"],
                rating: (Math.random() * 2 + 3).toFixed(1),
                facilities: facilities.slice(0, Math.floor(Math.random() * facilities.length) + 2)
            };
        });
    }
    
    function displayHospitals(hospitals) {
        hospitalsResults.innerHTML = '';
        
        hospitals.forEach(hospital => {
            const hospitalCard = document.createElement('div');
            hospitalCard.className = 'hospital-card';
            hospitalCard.innerHTML = `
                <h4>${hospital.name}</h4>
                <p>${hospital.address}</p>
                <p class="distance"><i class="fas fa-map-marker-alt"></i> ${hospital.distance}</p>
                <p><strong>Rating:</strong> ${hospital.rating} ★</p>
                <div class="specialties">
                    <strong>Available Specialists:</strong>
                    ${hospital.specialties.map(spec => `<span class="facility">${spec}</span>`).join('')}
                </div>
                <div class="facilities">
                    <strong>Facilities:</strong>
                    ${hospital.facilities.map(fac => `<span class="facility">${fac}</span>`).join('')}
                </div>
                <button class="btn-primary" data-id="${hospital.id}">
                    <i class="fas fa-directions"></i> Get Directions
                </button>
            `;
            hospitalsResults.appendChild(hospitalCard);
        });
        
        // Add event listeners to direction buttons
        document.querySelectorAll('.hospital-card button').forEach(btn => {
            btn.addEventListener('click', function() {
                const hospitalId = parseInt(this.dataset.id);
                const hospital = hospitalsData.find(h => h.id === hospitalId);
                alert(`Directions to ${hospital.name} would be displayed here with Google Maps integration.`);
            });
        });
    }
    
    function initMap(hospitals) {
        // Center map on first hospital (in real app, use geocoding)
        const mapCenter = { 
            lat: 40.7128 + (Math.random() * 0.02 - 0.01), 
            lng: -74.0060 + (Math.random() * 0.02 - 0.01) 
        };
        
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: mapCenter
        });
        
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        markers = [];
        
        // Add markers for each hospital
        hospitals.forEach(hospital => {
            const position = {
                lat: mapCenter.lat + (Math.random() * 0.01 - 0.005),
                lng: mapCenter.lng + (Math.random() * 0.01 - 0.005)
            };
            
            const marker = new google.maps.Marker({
                position: position,
                map: map,
                title: hospital.name,
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new google.maps.Size(30, 30)
                }
            });
            
            // Info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <h4 style="margin: 0 0 5px;">${hospital.name}</h4>
                        <p style="margin: 0;">${hospital.address}</p>
                        <p style="margin: 5px 0;">Specialties: ${hospital.specialties.join(', ')}</p>
                    </div>
                `
            });
            
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
            
            markers.push(marker);
        });
    }
    
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Reverse geocode to get address
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            document.getElementById('hospital-location').value = results[0].formatted_address;
                            
                            // Re-fetch hospitals with this location
                            // In a real app, you would send this to your backend
                            alert("Location found! Hospitals would be updated based on your location.");
                        }
                    });
                },
                error => {
                    alert("Error getting location: " + error.message);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }
    
    // Initialize map function for Google Maps callback
    window.initMap = function() {
        // This will be called when the Google Maps API loads
        if (hospitalsData.length > 0) {
            initMap(hospitalsData);
        }
    };
});