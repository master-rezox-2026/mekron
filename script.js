// --- SUPABASE CONFIGURATION ---
// Paste your Supabase credentials below:
const SUPABASE_URL = 'https://kgjkutouneodzngfsozb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KvTVMUSuUnu9s1dgqcsE3w_Q2KcjUiR';

const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

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

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cust-name').value;
        const phone = document.getElementById('cust-phone').value;
        const service = document.getElementById('cust-service').value;
        const address = document.getElementById('cust-address').value;

        const message = `*Mekron Engineer - AC Service Booking*%0A%0A` +
                        `*නම:* ${encodeURIComponent(name)}%0A` +
                        `*දුරකථන:* ${encodeURIComponent(phone)}%0A` +
                        `*සේවාව:* ${encodeURIComponent(service)}%0A` +
                        `*ලිපිනය:* ${encodeURIComponent(address)}`;

        window.open(`https://wa.me/94771234567?text=${message}`, '_blank');
    });
}
