// Default Configuration
const defaultConfig = {
    brandName: "MEKRON",
    brandTagline: "ENGINEERING",
    logoIcon: "fa-solid fa-snowflake",
    topNotice: "පැය 24 පුරාම හදිසි සේවාව (24/7 Service)",
    phoneDisplay: "077 123 4567",
    waNumber: "94771234567",
    heroBadge: "#1 ISO ප්‍රමිතියෙන් යුත් AC සේවා ආයතනය",
    heroHeading: "ඔබගේ AC යන්ත්‍රය නිවැරදිව හා විශ්වාසනීයව Service කරගන්න",
    heroSubtext: "ඔබේ නිවසේ හෝ කාර්යාලයේ A/C යන්ත්‍රයේ ඕනෑම දෝෂයක් ඉක්මනින්, සාධාරණ මිලකට සහ ඉහළම ප්‍රමිතියෙන් අලුත්වැඩියා කරගැනීමට අදම අප හා සම්බන්ධ වන්න.",
    heroBgUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
    price1: "Rs. 3,500",
    price2: "Rs. 6,500",
    price3: "Rs. 9,500",
    srvTitle1: "General AC Servicing",
    srvDesc1: "A/C යන්ත්‍රයේ ෆිල්ටර්, කොයිල් සහ බ්ලෝවර් පිරිසිදු කර ධාරිතාව උපරිම මට්ටමට ගෙන ඒම.",
    srvImg1: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop",
    srvTitle2: "Chemical Wash",
    srvDesc2: "තදින් තැන්පත් වූ දූවිලි හා පාසි ඉවත් කර සම්පූර්ණ කෙමිකල් ක්ලීනින් සේවාව.",
    srvImg2: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    srvTitle3: "Gas Top-up & Leak Repair",
    srvDesc3: "R22, R32, R410A ගෑස් වර්ග පරීක්ෂා කර කාන්දුවීම් අලුත්වැඩියා කර ගෑස් නැවත පිරවීම.",
    srvImg3: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"
};

// Load saved configuration from localStorage or default
function loadSiteConfig() {
    const saved = localStorage.getItem('mekron_site_config');
    const config = saved ? JSON.parse(saved) : defaultConfig;

    // Apply to DOM
    if (document.getElementById('brand-name')) document.getElementById('brand-name').innerText = config.brandName;
    if (document.getElementById('brand-tagline')) document.getElementById('brand-tagline').innerText = config.brandTagline;
    if (document.getElementById('footer-brand')) document.getElementById('footer-brand').innerText = config.brandName + " " + config.brandTagline;
    if (document.getElementById('footer-copy-brand')) document.getElementById('footer-copy-brand').innerText = config.brandName + " " + config.brandTagline;
    
    if (document.getElementById('logo-icon')) {
        document.getElementById('logo-icon').className = `${config.logoIcon} text-lg text-cyan-400 animate-pulse`;
    }

    if (document.getElementById('top-bar-notice')) {
        document.getElementById('top-bar-notice').innerHTML = `<i class="fa-solid fa-clock text-cyan-400"></i> ${config.topNotice}`;
    }

    if (document.getElementById('hero-badge')) document.getElementById('hero-badge').innerText = config.heroBadge;
    if (document.getElementById('hero-heading')) document.getElementById('hero-heading').innerText = config.heroHeading;
    if (document.getElementById('hero-subtext')) document.getElementById('hero-subtext').innerText = config.heroSubtext;

    if (document.getElementById('hero-bg')) {
        document.getElementById('hero-bg').style.backgroundImage = `url('${config.heroBgUrl}')`;
    }

    // Phone & WA
    if (document.getElementById('top-bar-phone')) {
        document.getElementById('top-bar-phone').href = `tel:${config.phoneDisplay.replace(/\s+/g, '')}`;
        document.getElementById('top-bar-phone').querySelector('span').innerText = config.phoneDisplay;
    }
    if (document.getElementById('top-bar-wa')) {
        document.getElementById('top-bar-wa').href = `https://wa.me/${config.waNumber}`;
    }
    if (document.getElementById('hero-wa-btn')) {
        document.getElementById('hero-wa-btn').href = `https://wa.me/${config.waNumber}`;
    }
    if (document.getElementById('card-call-btn')) {
        document.getElementById('card-call-btn').href = `tel:${config.phoneDisplay.replace(/\s+/g, '')}`;
    }
    if (document.getElementById('card-phone-num')) {
        document.getElementById('card-phone-num').innerText = config.phoneDisplay;
    }
    if (document.getElementById('footer-phone')) {
        document.getElementById('footer-phone').innerText = config.phoneDisplay;
    }

    // Prices
    if (document.getElementById('price-plan-1')) document.getElementById('price-plan-1').innerText = config.price1;
    if (document.getElementById('price-plan-2')) document.getElementById('price-plan-2').innerText = config.price2;
    if (document.getElementById('price-plan-3')) document.getElementById('price-plan-3').innerText = config.price3;

    // Services
    if (document.getElementById('service-title-1')) document.getElementById('service-title-1').innerText = config.srvTitle1;
    if (document.getElementById('service-desc-1')) document.getElementById('service-desc-1').innerText = config.srvDesc1;
    if (document.getElementById('service-img-1')) document.getElementById('service-img-1').src = config.srvImg1;

    if (document.getElementById('service-title-2')) document.getElementById('service-title-2').innerText = config.srvTitle2;
    if (document.getElementById('service-desc-2')) document.getElementById('service-desc-2').innerText = config.srvDesc2;
    if (document.getElementById('service-img-2')) document.getElementById('service-img-2').src = config.srvImg2;

    if (document.getElementById('service-title-3')) document.getElementById('service-title-3').innerText = config.srvTitle3;
    if (document.getElementById('service-desc-3')) document.getElementById('service-desc-3').innerText = config.srvDesc3;
    if (document.getElementById('service-img-3')) document.getElementById('service-img-3').src = config.srvImg3;

    window.siteConfig = config;
}

document.addEventListener('DOMContentLoaded', () => {
    loadSiteConfig();
});

// Mobile menu toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// BTU Calculator
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

// WhatsApp Booking update
const waLink = document.getElementById('whatsapp-link');
const nameInput = document.getElementById('cust-name');
const phoneInput = document.getElementById('cust-phone');
const serviceSelect = document.getElementById('cust-service');
const addressInput = document.getElementById('cust-address');

function updateWhatsAppLink() {
    if (!waLink) return;
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const service = serviceSelect ? serviceSelect.value : '';
    const address = addressInput ? addressInput.value.trim() : '';

    const waNum = (window.siteConfig && window.siteConfig.waNumber) ? window.siteConfig.waNumber : "94771234567";

    const message = `*Mekron Engineer - AC Service Booking*%0A%0A` +
                    `*නම:* ${encodeURIComponent(name)}%0A` +
                    `*දුරකථන:* ${encodeURIComponent(phone)}%0A` +
                    `*සේවාව:* ${encodeURIComponent(service)}%0A` +
                    `*ලිපිනය:* ${encodeURIComponent(address)}`;

    waLink.href = `https://wa.me/${waNum}?text=${message}`;
}

if (nameInput && phoneInput && serviceSelect && addressInput) {
    [nameInput, phoneInput, serviceSelect, addressInput].forEach(element => {
        element.addEventListener('input', updateWhatsAppLink);
        element.addEventListener('change', updateWhatsAppLink);
    });
}

if (waLink) {
    updateWhatsAppLink();
    waLink.addEventListener('click', (e) => {
        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        if (!name || !phone) {
            e.preventDefault();
            alert('කරුණාකර ඔබගේ නම සහ දුරකථන අංකය ඇතුළත් කරන්න.');
        }
    });
}