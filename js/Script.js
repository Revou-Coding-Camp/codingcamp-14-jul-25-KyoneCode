// Popup untuk minta nama pengguna
document.addEventListener('DOMContentLoaded', function() {
    let userName = localStorage.getItem('userName');
    
    if (!userName) {
        showNamePopup();
    } else {
        updateGreeting(userName);
    }
    
    setupContactForm();
});

function showNamePopup() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    
    const popup = document.createElement('div');
    popup.className = 'bg-[#0f0000] text-white p-8 rounded-lg shadow-lg max-w-md mx-4 border border-red-900';
    
    popup.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-bold mb-4 text-red-300">Welcome to PortoHub 2.0!</h3>
            <p class="mb-4">Hello My glorious friend! may i Know Your Name?</p>
            <input type="text" id="nameInput" placeholder="Enter your name..." 
                   class="w-full p-3 rounded bg-red-900/30 border border-red-700 text-white placeholder-gray-300 focus:outline-none focus:border-red-500 mb-2">
            <div id="errorMessage" class="text-red-400 text-sm mb-4 h-5"></div>
            <div class="flex gap-3">
                <button onclick="saveUserName()" 
                        class="flex-1 bg-red-700 hover:bg-red-600 px-4 py-2 rounded transition-colors">
                    Continue
                </button>
                <button onclick="skipName()" 
                        class="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors">
                    Skip
                </button>
            </div>
        </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        document.getElementById('nameInput').focus();
    }, 100);
    
    document.getElementById('nameInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveUserName();
        }
    });
    
    document.getElementById('nameInput').addEventListener('input', function() {
        clearError();
    });
}

function saveUserName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    clearError();
    
    if (!name) {
        showError('Please enter your name!');
        return;
    }
    
    if (name.length > 50) {
        showError('Name too long! Maximum 50 characters allowed.');
        return;
    }
    
    if (name.length < 2) {
        showError('Name too short! Minimum 2 characters required.');
        return;
    }
    
    localStorage.setItem('userName', name);
    updateGreeting(name);
    removePopup();
    
    autoFillContactName();
}

function skipName() {
    localStorage.setItem('userName', 'Guest');
    updateGreeting('Guest');
    removePopup();
}

function updateGreeting(name) {
    const greetingElements = document.querySelectorAll('h2');
    greetingElements.forEach(element => {
        if (element.textContent.includes('Hi Guest')) {
            element.innerHTML = `Hi <span class="text-red-300">${name}</span>, Welcome to PortoHub 2.0`;
        }
    });
    
    autoFillContactName();
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const nameInput = document.getElementById('nameInput');
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.className = 'text-red-400 text-sm mb-4 h-5 animate-pulse';
    }
    
    nameInput.style.borderColor = '#ef4444';
    nameInput.style.animation = 'shake 0.3s';
    
    setTimeout(() => {
        nameInput.style.animation = '';
    }, 300);
}

function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    const nameInput = document.getElementById('nameInput');
    
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.className = 'text-red-400 text-sm mb-4 h-5';
    }
    
    nameInput.style.borderColor = '#dc2626';
}

function removePopup() {
    const overlay = document.querySelector('.fixed.inset-0');
    if (overlay) {
        overlay.remove();
    }
}

function resetUserName() {
    localStorage.removeItem('userName');
    location.reload();
}

// ======================= CONTACT FORM =======================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    // Auto-fill nama dari localStorage
    autoFillContactName();
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit();
        });
    }
}

function autoFillContactName() {
    const contactNameInput = document.getElementById('contactName');
    const userName = localStorage.getItem('userName');
    
    if (contactNameInput && userName && userName !== 'Guest') {
        contactNameInput.value = userName;
        contactNameInput.style.backgroundColor = 'rgba(185, 28, 28, 0.2)';
        contactNameInput.style.borderColor = '#22c55e';
    }
}

function handleContactSubmit() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="button"]');
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value
    };
    
    if (!formData.name || !formData.email || !formData.message) {
        showContactError('Please fill in all required fields.');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showContactError('Please enter a valid email address.');
        return;
    }
    
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showContactDataPopup(formData);
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
    }, 1000);
}

function resetContactForm() {
    const inputs = ['contactName', 'contactEmail', 'contactMessage'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
            element.style.backgroundColor = 'rgba(185, 28, 28, 0.3)';
            element.style.borderColor = '#dc2626';
        }
    });
    
    setTimeout(() => {
        autoFillContactName();
    }, 100);
}

function showContactDataPopup(formData) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4';
    
    const popup = document.createElement('div');
    popup.className = 'bg-[#0f0000] text-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4 border border-red-900';
    
    popup.innerHTML = `
        <div class="text-center">
            <div class="mb-6">
                <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold mb-2 text-green-400">Message Preview</h3>
                <p class="text-gray-300 mb-2">Here's what would be sent:</p>
                <p class="text-gray-400 text-sm mb-4">(This is just a preview - no actual email is sent)</p>
            </div>
            
            <div class="bg-red-900/20 rounded-lg p-6 mb-6 text-left">
                <div class="space-y-4">
                    <div>
                        <span class="text-red-400 font-semibold">From:</span>
                        <span class="text-white ml-2">${formData.name}</span>
                    </div>
                    <div>
                        <span class="text-red-400 font-semibold">Email:</span>
                        <span class="text-white ml-2">${formData.email}</span>
                    </div>
                    <div>
                        <span class="text-red-400 font-semibold">Message:</span>
                        <div class="text-white mt-2 p-3 bg-red-900/30 rounded border-l-4 border-red-500">
                            ${formData.message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                </div>
            </div>
            
            <button onclick="closeContactPopupAndReset()" 
                    class="w-full bg-red-700 hover:bg-red-600 px-6 py-3 rounded transition-colors font-semibold">
                Got it, thanks!
            </button>
        </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeContactPopupAndReset();
        }
    });
}

function showContactError(message) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
    
    const popup = document.createElement('div');
    popup.className = 'bg-[#0f0000] text-white p-6 rounded-lg shadow-lg max-w-md mx-4 border border-red-900';
    
    popup.innerHTML = `
        <div class="text-center">
            <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
            <h3 class="text-xl font-bold mb-2 text-red-400">Error</h3>
            <p class="text-gray-300 mb-4">${message}</p>
            <button onclick="closeContactPopup()" 
                    class="bg-red-700 hover:bg-red-600 px-6 py-2 rounded transition-colors">
                OK
            </button>
        </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        closeContactPopup();
    }, 3000);
}

function closeContactPopupAndReset() {
    resetContactForm();
    closeContactPopup();
}

function closeContactPopup() {
    const popups = document.querySelectorAll('.fixed.inset-0');
    popups.forEach(popup => {
        if (popup.classList.contains('z-50')) {
            popup.remove();
        }
    });
}
