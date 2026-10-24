async function populateAdminForm() {
    try {
        const { data, error } = await _supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching for admin:', error);
            return;
        }

        if (data) {
            document.getElementById('adm-brandName').value = data.brand_name || '';
            document.getElementById('adm-brandTagline').value = data.brand_tagline || '';
            document.getElementById('adm-logoType').value = data.logo_type || 'icon';
            document.getElementById('adm-logoIcon').value = data.logo_icon || '';
            document.getElementById('adm-logoImgUrl').value = data.logo_img_url || '';
            document.getElementById('adm-topNotice').value = data.top_notice || '';
            document.getElementById('adm-phoneDisplay').value = data.phone_display || '';
            document.getElementById('adm-waNumber').value = data.wa_number || '';
            document.getElementById('adm-heroBadge').value = data.hero_badge || '';
            document.getElementById('adm-heroHeading').value = data.hero_heading || '';
            document.getElementById('adm-heroSubtext').value = data.hero_subtext || '';
            document.getElementById('adm-heroBgUrl').value = data.hero_bg_url || '';
            document.getElementById('adm-price1').value = data.price1 || '';
            document.getElementById('adm-price2').value = data.price2 || '';
            document.getElementById('adm-price3').value = data.price3 || '';
            document.getElementById('adm-srvTitle1').value = data.srv_title1 || '';
            document.getElementById('adm-srvDesc1').value = data.srv_desc1 || '';
            document.getElementById('adm-srvImg1').value = data.srv_img1 || '';
            document.getElementById('adm-srvTitle2').value = data.srv_title2 || '';
            document.getElementById('adm-srvDesc2').value = data.srv_desc2 || '';
            document.getElementById('adm-srvImg2').value = data.srv_img2 || '';
            document.getElementById('adm-srvTitle3').value = data.srv_title3 || '';
            document.getElementById('adm-srvDesc3').value = data.srv_desc3 || '';
            document.getElementById('adm-srvImg3').value = data.srv_img3 || '';
        }

        const credsStored = localStorage.getItem('mekron_admin_creds');
        const creds = credsStored ? JSON.parse(credsStored) : { username: "admin", password: "admin123" };
        document.getElementById('adm-newUsername').value = creds.username;
        document.getElementById('adm-newPassword').value = creds.password;

    } catch (err) {
        console.error('Error loading admin form:', err);
    }
}

function switchTab(tabKey) {
    const tabs = ['branding', 'hero', 'pricing', 'services', 'contact', 'security'];
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

document.getElementById('admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    saveBtn.innerText = "Saving to Supabase...";

    const updatedData = {
        brand_name: document.getElementById('adm-brandName').value,
        brand_tagline: document.getElementById('adm-brandTagline').value,
        logo_type: document.getElementById('adm-logoType').value,
        logo_icon: document.getElementById('adm-logoIcon').value,
        logo_img_url: document.getElementById('adm-logoImgUrl').value,
        top_notice: document.getElementById('adm-topNotice').value,
        phone_display: document.getElementById('adm-phoneDisplay').value,
        wa_number: document.getElementById('adm-waNumber').value,
        hero_badge: document.getElementById('adm-heroBadge').value,
        hero_heading: document.getElementById('adm-heroHeading').value,
        hero_subtext: document.getElementById('adm-heroSubtext').value,
        hero_bg_url: document.getElementById('adm-heroBgUrl').value,
        price1: document.getElementById('adm-price1').value,
        price2: document.getElementById('adm-price2').value,
        price3: document.getElementById('adm-price3').value,
        srv_title1: document.getElementById('adm-srvTitle1').value,
        srv_desc1: document.getElementById('adm-srvDesc1').value,
        srv_img1: document.getElementById('adm-srvImg1').value,
        srv_title2: document.getElementById('adm-srvTitle2').value,
        srv_desc2: document.getElementById('adm-srvDesc2').value,
        srv_img2: document.getElementById('adm-srvImg2').value,
        srv_title3: document.getElementById('adm-srvTitle3').value,
        srv_desc3: document.getElementById('adm-srvDesc3').value,
        srv_img3: document.getElementById('adm-srvImg3').value
    };

    const { error } = await _supabase
        .from('site_settings')
        .update(updatedData)
        .eq('id', 1);

    saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk text-lg"></i><span>Save to Supabase Database</span>';

    if (error) {
        alert('Save කිරීමටදී දෝෂයක් සිදු විය: ' + error.message);
        return;
    }

    const newU = document.getElementById('adm-newUsername').value.trim();
    const newP = document.getElementById('adm-newPassword').value.trim();
    if (newU && newP) {
        localStorage.setItem('mekron_admin_creds', JSON.stringify({ username: newU, password: newP }));
    }

    const alertBox = document.getElementById('save-alert');
    alertBox.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 4000);
});

document.addEventListener('DOMContentLoaded', () => {
    populateAdminForm();
});