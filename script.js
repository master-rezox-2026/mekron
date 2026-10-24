async function loadSiteConfigFromSupabase() {
    try {
        const { data, error } = await _supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching settings:', error);
            return;
        }

        if (data) {
            if (document.getElementById('brand-name')) document.getElementById('brand-name').innerText = data.brand_name;
            if (document.getElementById('brand-tagline')) document.getElementById('brand-tagline').innerText = data.brand_tagline;
            if (document.getElementById('footer-brand')) document.getElementById('footer-brand').innerText = data.brand_name + " " + data.brand_tagline;
            if (document.getElementById('footer-copy-brand')) document.getElementById('footer-copy-brand').innerText = data.brand_name + " " + data.brand_tagline;
            
            if (document.getElementById('logo-icon')) {
                document.getElementById('logo-icon').className = `${data.logo_icon} text-lg text-cyan-400 animate-pulse`;
            }

            if (document.getElementById('top-bar-notice')) {
                document.getElementById('top-bar-notice').innerHTML = `<i class="fa-solid fa-clock text-cyan-400"></i> ${data.top_notice}`;
            }

            if (document.getElementById('hero-badge')) document.getElementById('hero-badge').innerText = data.hero_badge;
            if (document.getElementById('hero-heading')) document.getElementById('hero-heading').innerText = data.hero_heading;
            if (document.getElementById('hero-subtext')) document.getElementById('hero-subtext').innerText = data.hero_subtext;

            if (document.getElementById('hero-bg')) {
                document.getElementById('hero-bg').style.backgroundImage = `url('${data.hero_bg_url}')`;
            }

            if (document.getElementById('top-bar-phone')) {
                document.getElementById('top-bar-phone').href = `tel:${data.phone_display.replace(/\s+/g, '')}`;
                document.getElementById('top-bar-phone').querySelector('span').innerText = data.phone_display;
            }
            if (document.getElementById('top-bar-wa')) {
                document.getElementById('top-bar-wa').href = `https://wa.me/${data.wa_number}`;
            }
            if (document.getElementById('hero-wa-btn')) {
                document.getElementById('hero-wa-btn').href = `https://wa.me/${data.wa_number}`;
            }
            if (document.getElementById('card-call-btn')) {
                document.getElementById('card-call-btn').href = `tel:${data.phone_display.replace(/\s+/g, '')}`;
            }
            if (document.getElementById('card-phone-num')) {
                document.getElementById('card-phone-num').innerText = data.phone_display;
            }
            if (document.getElementById('footer-phone')) {
                document.getElementById('footer-phone').innerText = data.phone_display;
            }

            if (document.getElementById('price-plan-1')) document.getElementById('price-plan-1').innerText = data.price1;
            if (document.getElementById('price-plan-2')) document.getElementById('price-plan-2').innerText = data.price2;
            if (document.getElementById('price-plan-3')) document.getElementById('price-plan-3').innerText = data.price3;

            if (document.getElementById('service-title-1')) document.getElementById('service-title-1').innerText = data.srv_title1;
            if (document.getElementById('service-desc-1')) document.getElementById('service-desc-1').innerText = data.srv_desc1;
            if (document.getElementById('service-img-1')) document.getElementById('service-img-1').src = data.srv_img1;

            if (document.getElementById('service-title-2')) document.getElementById('service-title-2').innerText = data.srv_title2;
            if (document.getElementById('service-desc-2')) document.getElementById('service-desc-2').innerText = data.srv_desc2;
            if (document.getElementById('service-img-2')) document.getElementById('service-img-2').src = data.srv_img2;

            if (document.getElementById('service-title-3')) document.getElementById('service-title-3').innerText = data.srv_title3;
            if (document.getElementById('service-desc-3')) document.getElementById('service-desc-3').innerText = data.srv_desc3;
            if (document.getElementById('service-img-3')) document.getElementById('service-img-3').src = data.srv_img3;

            window.siteConfig = data;
        }
    } catch (err) {
        console.error('Failed to load site config:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSiteConfigFromSupabase();
});

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

    const waNum = (window.siteConfig && window.siteConfig.wa_number) ? window.siteConfig.wa_number : "94771234567";

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