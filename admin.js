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

function populateAdminForm() {
    const saved = localStorage.getItem('mekron_site_config');
    const config = saved ? JSON.parse(saved) : defaultConfig;

    document.getElementById('adm-brandName').value = config.brandName;
    document.getElementById('adm-brandTagline').value = config.brandTagline;
    document.getElementById('adm-logoIcon').value = config.logoIcon;
    document.getElementById('adm-topNotice').value = config.topNotice;
    document.getElementById('adm-phoneDisplay').value = config.phoneDisplay;
    document.getElementById('adm-waNumber').value = config.waNumber;
    document.getElementById('adm-heroBadge').value = config.heroBadge;
    document.getElementById('adm-heroHeading').value = config.heroHeading;
    document.getElementById('adm-heroSubtext').value = config.heroSubtext;
    document.getElementById('adm-heroBgUrl').value = config.heroBgUrl;
    document.getElementById('adm-price1').value = config.price1;
    document.getElementById('adm-price2').value = config.price2;
    document.getElementById('adm-price3').value = config.price3;
    document.getElementById('adm-srvTitle1').value = config.srvTitle1;
    document.getElementById('adm-srvDesc1').value = config.srvDesc1;
    document.getElementById('adm-srvImg1').value = config.srvImg1;
    document.getElementById('adm-srvTitle2').value = config.srvTitle2;
    document.getElementById('adm-srvDesc2').value = config.srvDesc2;
    document.getElementById('adm-srvImg2').value = config.srvImg2;
    document.getElementById('adm-srvTitle3').value = config.srvTitle3;
    document.getElementById('adm-srvDesc3').value = config.srvDesc3;
    document.getElementById('adm-srvImg3').value = config.srvImg3;
}

function switchTab(tabKey) {
    const tabs = ['branding', 'hero', 'pricing', 'services', 'contact'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        const sec = document.getElementById(`sec-${t}`);
        if (t === tabKey) {
            sec.classList.remove('hidden');
            btn.className = "w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2.5 transition-all";
        } else {
            sec.classList.add('hidden');
            btn.className = "w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-all";
        }
    });
}

document.getElementById('admin-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const config = {
        brandName: document.getElementById('adm-brandName').value,
        brandTagline: document.getElementById('adm-brandTagline').value,
        logoIcon: document.getElementById('adm-logoIcon').value,
        topNotice: document.getElementById('adm-topNotice').value,
        phoneDisplay: document.getElementById('adm-phoneDisplay').value,
        waNumber: document.getElementById('adm-waNumber').value,
        heroBadge: document.getElementById('adm-heroBadge').value,
        heroHeading: document.getElementById('adm-heroHeading').value,
        heroSubtext: document.getElementById('adm-heroSubtext').value,
        heroBgUrl: document.getElementById('adm-heroBgUrl').value,
        price1: document.getElementById('adm-price1').value,
        price2: document.getElementById('adm-price2').value,
        price3: document.getElementById('adm-price3').value,
        srvTitle1: document.getElementById('adm-srvTitle1').value,
        srvDesc1: document.getElementById('adm-srvDesc1').value,
        srvImg1: document.getElementById('adm-srvImg1').value,
        srvTitle2: document.getElementById('adm-srvTitle2').value,
        srvDesc2: document.getElementById('adm-srvDesc2').value,
        srvImg2: document.getElementById('adm-srvImg2').value,
        srvTitle3: document.getElementById('adm-srvTitle3').value,
        srvDesc3: document.getElementById('adm-srvDesc3').value,
        srvImg3: document.getElementById('adm-srvImg3').value
    };

    localStorage.setItem('mekron_site_config', JSON.stringify(config));

    const alertBox = document.getElementById('save-alert');
    alertBox.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 4000);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('ඔබට සියලුම තොරතුරු මුල් පැවති තත්ත්වයට (Default) පත් කිරීමට අවශ්‍යද?')) {
        localStorage.removeItem('mekron_site_config');
        populateAdminForm();
        alert('Reset කරන ලදී!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    populateAdminForm();
});