// --- SUPABASE CONFIGURATION ---
// Paste your Supabase credentials below:
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// BTU Calculator Logic
const calcBtn = document.getElementById('calc-btn');
if (calcBtn) {
    calcBtn.addEventListener('click', () => {
        const length = parseFloat(document.getElementById('room-length').value) || 0;
        const width = parseFloat(document.getElementById('room-width').value) || 0;
        const sqft = length * width;
        let btu = sqft * 80;
        
        let outputText = "";
        if (btu <= 9000) {
            outputText = "9,000 BTU (0.75 Ton AC)";
        } else if (btu <= 12000) {
            outputText = "12,000 BTU (1.0 Ton AC)";
        } else if (btu <= 18000) {
            outputText = "18,000 BTU (1.5 Ton AC)";
        } else if (btu <= 24000) {
            outputText = "24,000 BTU (2.0 Ton AC)";
        } else {
            outputText = "30,000+ BTU (2.5 Ton+ commercial AC)";
        }

        document.getElementById('btu-output').innerText = outputText;
    });
}

// Booking Form Handling (Supabase & WhatsApp)
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        const name = document.getElementById('cust-name').value;
        const phone = document.getElementById('cust-phone').value;
        const service = document.getElementById('cust-service').value;
        const address = document.getElementById('cust-address').value;

        // If Supabase is configured, insert booking row
        if (supabaseClient) {
            try {
                await supabaseClient.from('bookings').insert([
                    { name: name, phone: phone, service: service, address: address }
                ]);
            } catch (err) {
                console.log('Supabase Insert Error:', err);
            }
        }

        // WhatsApp Direct Dispatch
        const message = `*Mekron Engineer - AC Service Booking*%0A%0A` +
                        `*නම:* ${encodeURIComponent(name)}%0A` +
                        `*දුරකථන:* ${encodeURIComponent(phone)}%0A` +
                        `*සේවාව:* ${encodeURIComponent(service)}%0A` +
                        `*ලිපිනය:* ${encodeURIComponent(address)}`;

        window.open(`https://wa.me/94771234567?text=${message}`, '_blank');
    });
}
