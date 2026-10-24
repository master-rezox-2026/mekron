async function loadSiteConfigFromSupabase() {
    try {
        // 1. Load site settings
        const { data: settings, error: errSettings } = await _supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (settings) {
            if (document.getElementById('brand-name')) document.getElementById('brand-name').innerText = settings.brand_name;
            if (document.getElementById('brand-tagline')) document.getElementById('brand-tagline').innerText = settings.brand_tagline;
            if (document.getElementById('footer-brand')) document.getElementById('footer-brand').innerText = settings.brand_name + " " + settings.brand_tagline;
            if (document.getElementById('footer-copy-brand')) document.getElementById('footer-copy-brand').innerText = settings.brand_name + " " + settings.brand_tagline;
            
            const logoWrapper = document.getElementById('logo-wrapper');
            if (logoWrapper) {
                if (settings.logo_type === 'image' && settings.logo_img_url) {
                    logoWrapper.innerHTML = `<img src="${settings.logo_img_url}" alt="Logo" class="w-full h-full object-cover rounded-[10px]">`;
                } else {
                    const iconClass = settings.logo_icon || 'fa-solid fa-snowflake';
                    logoWrapper.innerHTML = `<i class="${iconClass} text-lg text-cyan-400 animate-pulse"></i>`;
                }
            }

            if (document.getElementById('top-bar-notice')) {
                document.getElementById('top-bar-notice').innerHTML = `<i class="fa-solid fa-clock text-cyan-400"></i> ${settings.top_notice}`;
            }

            if (document.getElementById('hero-badge')) document.getElementById('hero-badge').innerText = settings.hero_badge;
            if (document.getElementById('hero-heading')) document.getElementById('hero-heading').innerText = settings.hero_heading;
            if (document.getElementById('hero-subtext')) document.getElementById('hero-subtext').innerText = settings.hero_subtext;

            if (document.getElementById('hero-bg')) {
                document.getElementById('hero-bg').style.backgroundImage = `url('${settings.hero_bg_url}')`;
            }

            if (document.getElementById('top-bar-phone')) {
                document.getElementById('top-bar-phone').href = `tel:${settings.phone_display.replace(/\s+/g, '')}`;
                document.getElementById('top-bar-phone').querySelector('span').innerText = settings.phone_display;
            }
            if (document.getElementById('top-bar-wa')) {
                document.getElementById('top-bar-wa').href = `https://wa.me/${settings.wa_number}`;
            }
            if (document.getElementById('hero-wa-btn')) {
                document.getElementById('hero-wa-btn').href = `https://wa.me/${settings.wa_number}`;
            }
            if (document.getElementById('card-call-btn')) {
                document.getElementById('card-call-btn').href = `tel:${settings.phone_display.replace(/\s+/g, '')}`;
            }
            if (document.getElementById('card-phone-num')) {
                document.getElementById('card-phone-num').innerText = settings.phone_display;
            }
            if (document.getElementById('footer-phone')) {
                document.getElementById('footer-phone').innerText = settings.phone_display;
            }

            if (document.getElementById('price-plan-1')) document.getElementById('price-plan-1').innerText = settings.price1;
            if (document.getElementById('price-plan-2')) document.getElementById('price-plan-2').innerText = settings.price2;
            if (document.getElementById('price-plan-3')) document.getElementById('price-plan-3').innerText = settings.price3;

            window.siteConfig = settings;
        }

        // 2. Load dynamic services
        const { data: services, error: errServices } = await _supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });

        const servicesGrid = document.getElementById('services-grid');
        if (servicesGrid && services) {
            servicesGrid.innerHTML = '';
            services.forEach(srv => {
                const cardHTML = `
                    <div class="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all group hover:-translate-y-1 shadow-xl">
                        <div class="relative h-48 overflow-hidden">
                            <img src="${srv.image_url}" alt="${srv.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            <span class="absolute top-3 left-3 bg-cyan-500/80 backdrop-blur-md text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md">${srv.badge || 'Service'}</span>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">${srv.title}</h3>
                            <p class="text-slate-400 text-sm leading-relaxed mb-4">
                                ${srv.description}
                            </p>
                            <button onclick="selectPackage('${srv.title}')" class="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors border border-slate-700 flex items-center justify-center gap-2">
                                <i class="fa-regular fa-calendar-check"></i> මෙම සේවාව වෙන්කරගන්න
                            </button>
                        </div>
                    </div>
                `;
                servicesGrid.innerHTML += cardHTML;
            });
        }

    } catch (err) {
        console.error('Failed to load config or services:', err);
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