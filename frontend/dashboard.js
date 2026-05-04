// LANGUAGE TOGGLE FUNCTIONALITY
let currentLanguage = localStorage.getItem("language") || "sw";

// Language translations
const translations = {
    sw: {
        welcome: "Karibu",
        dashboard: "Dashibodi",
        farms: "Mashamba",
        sensorData: "Data ya Vihisi",
        aiAdvice: "Usauri wa AI",
        irrigation: "Mashambulizi",
        weather: "Hali ya Hewa",
        market: "Soko",
        notifications: "Arifa",
        profile: "Wasifu",
        logout: "Toka",
        // Farm page translations
        myFarms: "Mashamba Yangu",
        addFarm: "Ongeza Shamba",
        farmName: "Jina la Shamba",
        location: "Mahali",
        farmType: "Aina ya Shamba",
        addFarmBtn: "Ongeza Shamba",
        noFarms: "Hakuna mashamba yaliyopatikana. Ongeza shamba lako la kwanza hapo juu!",
        serverError: "Hitilafu ya seva. Tafadhali jaribu tena.",
        // AI page translations
        aiSmartAdvice: "Usauri Mkuu wa AI",
        irrigationAdvice: "Ushauri wa Umwagiliaji",
        plantingGuide: "Mwongozo wa Upandaji",
        fertilizerTips: "Mashauri ya Mbolea",
        pestControl: "Kudhibiti Wadudu",
        aiPlantScanner: "Kichunguzi cha Mmea cha AI",
        startCamera: "Anza Kamera",
        scanPlant: "Chambua Mmea",
        reset: "Rejesha",
        chatWithAI: "Zungumza na AI",
        typeMessage: "Andika ujumbe wako hapa...",
        send: "Tuma",
        // Profile page translations
        userProfile: "Wasifu wa Mtumiaji",
        editProfile: "Hariri Wasifu",
        changePassword: "Badilisha Neno la Siri",
        accountSettings: "Mipangilio ya Akaunti",
        dangerZone: "Eneo la Hatari",
        fullName: "Jina Kamili",
        emailAddress: "Anwani ya Barua pepe",
        phoneNumber: "Namba ya Simu",
        currentPassword: "Neno la Siri la Sasa",
        newPassword: "Neno la Siri Mpya",
        confirmPassword: "Thibitisha Neno la Siri Mpya",
        updateProfile: "Sasisha Wasifu",
        changePasswordBtn: "Badilisha Neno la Siri",
        saveSettings: "Hifadhi Mipangilio",
        exportData: "Toa Data Yangu",
        deleteAccount: "Futa Akaunti"
    },
    en: {
        welcome: "Welcome",
        dashboard: "Dashboard", 
        farms: "Farms",
        sensorData: "Sensor Data",
        aiAdvice: "AI Advice",
        irrigation: "Irrigation",
        weather: "Weather",
        market: "Market",
        notifications: "Notifications",
        profile: "Profile",
        logout: "Logout",
        // Farm page translations
        myFarms: "My Farms",
        addFarm: "Add Farm",
        farmName: "Farm Name",
        location: "Location",
        farmType: "Farm Type",
        addFarmBtn: "Add Farm",
        noFarms: "No farms found. Add your first farm above!",
        serverError: "Server error. Please try again.",
        // AI page translations
        aiSmartAdvice: "AI Smart Advice",
        irrigationAdvice: "Irrigation Advice",
        plantingGuide: "Planting Guide",
        fertilizerTips: "Fertilizer Tips",
        pestControl: "Pest Control",
        aiPlantScanner: "AI Plant Scanner",
        startCamera: "Start Camera",
        scanPlant: "Scan Plant",
        reset: "Reset",
        chatWithAI: "Chat with AI Assistant",
        typeMessage: "Type your message here...",
        send: "Send",
        // Profile page translations
        userProfile: "User Profile",
        editProfile: "Edit Profile Information",
        changePassword: "Change Password",
        accountSettings: "Account Settings",
        dangerZone: "Danger Zone",
        fullName: "Full Name",
        emailAddress: "Email Address",
        phoneNumber: "Phone Number",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        updateProfile: "Update Profile",
        changePasswordBtn: "Change Password",
        saveSettings: "Save Settings",
        exportData: "Export My Data",
        deleteAccount: "Delete Account"
    }
};

// Toggle language function
function toggleLanguage() {
    currentLanguage = currentLanguage === "sw" ? "en" : "sw";
    localStorage.setItem("language", currentLanguage);
    updateAllPageTexts();
    updateLanguageToggle();
}

// Update all page texts
function updateAllPageTexts() {
    const t = translations[currentLanguage];
    
    // Update welcome text
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) {
        const userName = localStorage.getItem("user_name") || (currentLanguage === 'sw' ? 'Mkulima' : 'Farmer');
        welcomeText.innerText = t.welcome + " " + userName + " 👨‍🌾";
    }
    
    // Update sidebar menu items
    const sidebarItems = document.querySelectorAll('.sidebar li');
    const menuTexts = ["dashboard", "farms", "sensorData", "aiAdvice", "irrigation", "weather", "market", "notifications", "profile", "logout"];
    
    sidebarItems.forEach((item, index) => {
        if (index < menuTexts.length) {
            const textKey = menuTexts[index];
            if (t[textKey]) {
                const textNode = Array.from(item.childNodes).find(node => 
                    node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.textContent)
                );
                if (textNode) {
                    textNode.textContent = t[textKey];
                }
            }
        }
    });
    
    // Update page titles and content
    updatePageContent(t);
}

// Update page-specific content
function updatePageContent(t) {
    // Farm page updates
    const farmsTitle = document.querySelector('h1');
    if (farmsTitle && (farmsTitle.textContent.includes('Mashamba') || farmsTitle.textContent.includes('My Farms'))) {
        farmsTitle.textContent = t.myFarms;
    }
    
    const addFarmTitle = document.querySelector('.form-box h2');
    if (addFarmTitle && (addFarmTitle.textContent.includes('Add Farm') || addFarmTitle.textContent.includes('Ongeza Shamba'))) {
        addFarmTitle.textContent = t.addFarm;
    }
    
    const farmNameInput = document.getElementById('name');
    if (farmNameInput) {
        farmNameInput.placeholder = t.farmName;
    }
    
    const locationInput = document.getElementById('location');
    if (locationInput) {
        locationInput.placeholder = t.location;
    }
    
    const typeInput = document.getElementById('type');
    if (typeInput) {
        typeInput.placeholder = t.farmType;
    }
    
    const addFarmBtn = document.querySelector('button[onclick="addFarm()"]');
    if (addFarmBtn) {
        addFarmBtn.textContent = t.addFarmBtn;
    }
    
    // AI page updates
    const aiTitle = document.querySelector('h1');
    if (aiTitle && (aiTitle.textContent.includes('AI Smart Advice') || aiTitle.textContent.includes('AI Advice'))) {
        aiTitle.textContent = t.aiSmartAdvice;
    }
    
    const aiScannerTitle = document.querySelector('.ai-scanner h2');
    if (aiScannerTitle) {
        aiScannerTitle.textContent = t.aiPlantScanner;
    }
    
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.textContent = t.startCamera;
    }
    
    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) {
        captureBtn.textContent = t.scanPlant;
    }
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.textContent = t.reset;
    }
    
    const chatTitle = document.querySelector('.chat-container h2');
    if (chatTitle) {
        chatTitle.textContent = t.chatWithAI;
    }
    
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.placeholder = t.typeMessage;
    }
    
    const sendBtn = document.querySelector('button[onclick="sendMessage()"]');
    if (sendBtn) {
        sendBtn.textContent = t.send;
    }
    
    // Profile page updates
    const profileTitle = document.querySelector('h1');
    if (profileTitle && (profileTitle.textContent.includes('User Profile') || profileTitle.textContent.includes('Wasifu'))) {
        profileTitle.textContent = t.userProfile;
    }
    
    const editProfileTitle = document.querySelector('h3');
    if (editProfileTitle && (editProfileTitle.textContent.includes('Edit Profile') || editProfileTitle.textContent.includes('Hariri'))) {
        editProfileTitle.textContent = t.editProfile;
    }
    
    const changePasswordTitle = document.querySelectorAll('h3')[1];
    if (changePasswordTitle && (changePasswordTitle.textContent.includes('Change Password') || changePasswordTitle.textContent.includes('Badilisha'))) {
        changePasswordTitle.textContent = t.changePassword;
    }
    
    const accountSettingsTitle = document.querySelectorAll('h3')[2];
    if (accountSettingsTitle && (accountSettingsTitle.textContent.includes('Account Settings') || accountSettingsTitle.textContent.includes('Mipangilio'))) {
        accountSettingsTitle.textContent = t.accountSettings;
    }
    
    const dangerZoneTitle = document.querySelectorAll('h3')[3];
    if (dangerZoneTitle && (dangerZoneTitle.textContent.includes('Danger Zone') || dangerZoneTitle.textContent.includes('Eneo la Hatari'))) {
        dangerZoneTitle.textContent = t.dangerZone;
    }
    
    // Update form labels
    updateFormLabels(t);
}

// Update form labels
function updateFormLabels(t) {
    // Profile form labels
    const nameLabel = document.querySelector('label[for="editName"]');
    if (nameLabel) nameLabel.textContent = t.fullName;
    
    const emailLabel = document.querySelector('label[for="editEmail"]');
    if (emailLabel) emailLabel.textContent = t.emailAddress;
    
    const phoneLabel = document.querySelector('label[for="editPhone"]');
    if (phoneLabel) phoneLabel.textContent = t.phoneNumber;
    
    const currentPasswordLabel = document.querySelector('label[for="currentPassword"]');
    if (currentPasswordLabel) currentPasswordLabel.textContent = t.currentPassword;
    
    const newPasswordLabel = document.querySelector('label[for="newPassword"]');
    if (newPasswordLabel) newPasswordLabel.textContent = t.newPassword;
    
    const confirmPasswordLabel = document.querySelector('label[for="confirmPassword"]');
    if (confirmPasswordLabel) confirmPasswordLabel.textContent = t.confirmPassword;
    
    // Update button texts
    const updateProfileBtn = document.querySelector('button[onclick="updateProfile()"]');
    if (updateProfileBtn) updateProfileBtn.textContent = t.updateProfile;
    
    const changePasswordBtn = document.querySelector('button[onclick="changePassword()"]');
    if (changePasswordBtn) changePasswordBtn.textContent = t.changePasswordBtn;
    
    const saveSettingsBtn = document.querySelector('button[onclick="saveSettings()"]');
    if (saveSettingsBtn) saveSettingsBtn.textContent = t.saveSettings;
    
    const exportDataBtn = document.querySelector('button[onclick="exportData()"]');
    if (exportDataBtn) exportDataBtn.textContent = t.exportData;
    
    const deleteAccountBtn = document.querySelector('button[onclick="deleteAccount()"]');
    if (deleteAccountBtn) deleteAccountBtn.textContent = t.deleteAccount;
}

// Update language toggle button
function updateLanguageToggle() {
    const toggleBtn = document.getElementById("languageToggle");
    if (toggleBtn) {
        toggleBtn.textContent = currentLanguage === "sw" ? "EN" : "SW";
        toggleBtn.title = currentLanguage === "sw" ? "Switch to English" : "Badilisha lugha ya Kiswahili";
    }
}

// SIDEBAR TOGGLE FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    updateAllPageTexts();
    updateLanguageToggle();
    
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            // Change icon based on state
            const icon = this.querySelector('i') || this;
            if (sidebar.classList.contains('collapsed')) {
                icon.innerHTML = '☰';
            } else {
                icon.innerHTML = '×';
            }
        });
    }
});

// LOGOUT FUNCTIONALITY
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
    
}

// 1. Anzisha ramani (default iwe Dar es Salaam au popote)
var map = L.map('map').setView([-6.7924, 39.2083], 13);

// 2. Weka picha za ramani (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 3. Weka marker (kigingi) cha kuanzia
var marker = L.marker([-6.7924, 39.2083]).addTo(map);

// 4. Function ya kubadilisha eneo
function updateMap() {
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;

    if (lat && lng) {
        var newLatLng = new L.LatLng(lat, lng);
        map.setView(newLatLng, 15); // Inasogeza ramani
        marker.setLatLng(newLatLng); // Inasogeza kigingi
    } else {
        alert("Tafadhali jaza Latitude na Longitude zote!");
    }
}


// AI CAMERA FUNCTIONALITY - MOVED TO AI.HTML TO PREVENT CONFLICTS
// Camera functions are now handled in ai.html to avoid duplication
