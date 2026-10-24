let cropperObj = null;
let activeTargetInputId = null;

async function populateAdminData() {
    try {
        const { data: settings, error } = await _supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (settings) {
            document.getElementById('adm-brandName').value = settings.brand_name || '';
            document.getElementById('adm-brandTagline').value = settings.brand_tagline || '';
            document.getElementById('adm-logoType').value = settings.logo_type || 'icon';
            document.getElementById('adm-logoIcon').value = settings.logo_icon || '';
            document.getElementById('adm-logoImgUrl').value = settings.logo_img_url || '';
            document.getElementById('adm-topNotice').value = settings.top_notice || '';
            document.getElementById('adm-phoneDisplay').value = settings.phone_display || '';
            document.getElementById('adm-waNumber').value = settings.wa_number || '';
            document.getElementById('adm-heroBadge').value = settings.hero_badge || '';
            document.getElementById('adm-heroHeading').value = settings.hero_heading || '';
            document.getElementById('adm-heroSubtext').value = settings.hero_subtext || '';
            document.getElementById('adm-heroBgUrl').value = settings.hero_bg_url || '';
            document.getElementById('adm-price1').value = settings.price1 || '';
            document.getElementById('adm-price2').value = settings.price2 || '';
            document.getElementById('adm-price3').value = settings.price3 || '';
        }

        const credsStored = localStorage.getItem('mekron_admin_creds');
        const creds = credsStored ? JSON.parse(credsStored) : { username: "admin", password: "admin123" };
        document.getElementById('adm-newUsername').value = creds.username;
        document.getElementById('adm-newPassword').value = creds.password;

        loadAdminServicesTable();

    } catch (err) {
        console.error('Error loading admin data:', err);
    }
}

async function loadAdminServicesTable() {
    const { data: services, error } = await _supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

    const tbody = document.getElementById('admin-services-table-body');
    if (tbody && services) {
        tbody.innerHTML = '';
        services.forEach(srv => {
            tbody.innerHTML += `
                <tr class="hover:bg-slate-900/50">
                    <td class="p-3">
                        <img src="${srv.image_url}" alt="" class="w-12 h-10 object-cover rounded-lg border border-slate-800">
                    </td>
                    <td class="p-3 font-medium text-white">${srv.title}</td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded text-xs border border-cyan-500/20">${srv.badge}</span></td>
                    <td class="p-3 text-right space-x-2">
                        <button onclick="editService(${srv.id}, '${srv.title.replace(/'/g, "\\'")}', '${srv.badge.replace(/'/g, "\\'")}', '${srv.image_url}', '${srv.description.replace(/'/g, "\\'")}')" class="text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded bg-slate-800 text-xs"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="deleteService(${srv.id})" class="text-red-400 hover:text-red-300 px-2.5 py-1 rounded bg-slate-800 text-xs"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }
}

function switchTab(tabKey) {
    const tabs = ['branding', 'hero', 'services', 'pricing', 'contact', 'security'];
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

// Image Cropper Logic
function openImageCropper(targetInputId) {
    activeTargetInputId = targetInputId;
    // Trigger file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgEl = document.getElementById('cropper-image');
                imgEl.src = event.target.result;
                document.getElementById('cropper-modal').classList.remove('hidden');
                
                if (cropperObj) {
                    cropperObj.destroy();
                }
                cropperObj = new Cropper(imgEl, {
                    aspectRatio: NaN, // Free or set if needed
                    viewMode: 1,
                    autoCropArea: 0.9,
                });
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function handleFileSelected(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imgEl = document.getElementById('cropper-image');
            imgEl.src = event.target.result;
            if (cropperObj) {
                cropperObj.destroy();
            }
            cropperObj = new Cropper(imgEl, {
                aspectRatio: NaN,
                viewMode: 1,
                autoCropArea: 0.9,
            });
        };
        reader.readAsDataURL(file);
    }
}

function closeCropperModal() {
    document.getElementById('cropper-modal').classList.add('hidden');
    if (cropperObj) {
        cropperObj.destroy();
        cropperObj = null;
    }
}

function saveCroppedImage() {
    if (!cropperObj) return;
    const canvas = cropperObj.getCroppedCanvas({
        maxWidth: 1200,
        maxHeight: 1200,
    });
    const base64Data = canvas.toDataURL('image/jpeg', 0.85);

    if (activeTargetInputId) {
        document.getElementById(activeTargetInputId).value = base64Data;
    }
    closeCropperModal();
}

// Save Settings Forms
async function saveSettings(updatedData, successText) {
    const { error } = await _supabase
        .from('site_settings')
        .update(updatedData)
        .eq('id', 1);

    if (error) {
        alert('දෝෂයක් සිදු විය: ' + error.message);
        return;
    }

    const alertBox = document.getElementById('save-alert');
    document.getElementById('alert-msg').innerText = successText;
    alertBox.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => alertBox.classList.add('hidden'), 4000);
}

document.getElementById('form-branding').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings({
        brand_name: document.getElementById('adm-brandName').value,
        brand_tagline: document.getElementById('adm-brandTagline').value,
        logo_type: document.getElementById('adm-logoType').value,
        logo_icon: document.getElementById('adm-logoIcon').value,
        logo_img_url: document.getElementById('adm-logoImgUrl').value,
        top_notice: document.getElementById('adm-topNotice').value
    }, 'Branding සැකසුම් සාර්ථකව Save විය!');
});

document.getElementById('form-hero').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings({
        hero_badge: document.getElementById('adm-heroBadge').value,
        hero_heading: document.getElementById('adm-heroHeading').value,
        hero_subtext: document.getElementById('adm-heroSubtext').value,
        hero_bg_url: document.getElementById('adm-heroBgUrl').value
    }, 'Hero සැකසුම් සාර්ථකව Save විය!');
});

document.getElementById('form-pricing').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings({
        price1: document.getElementById('adm-price1').value,
        price2: document.getElementById('adm-price2').value,
        price3: document.getElementById('adm-price3').value
    }, 'මිල ගණන් සාර්ථකව Save විය!');
});

document.getElementById('form-contact').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings({
        phone_display: document.getElementById('adm-phoneDisplay').value,
        wa_number: document.getElementById('adm-waNumber').value
    }, 'સම්බන්ධතා අංක සාර්ථකව Save විය!');
});

document.getElementById('form-security').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newU = document.getElementById('adm-newUsername').value.trim();
    const newP = document.getElementById('adm-newPassword').value.trim();
    if (newU && newP) {
        localStorage.setItem('mekron_admin_creds', JSON.stringify({ username: newU, password: newP }));
    }
    const alertBox = document.getElementById('save-alert');
    document.getElementById('alert-msg').innerText = 'Admin අක්තපත්‍ර සාර්ථකව වෙනස් විය!';
    alertBox.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => alertBox.classList.add('hidden'), 4000);
});

// Services Modal
function openAddServiceModal() {
    document.getElementById('modal-title').innerText = "නව සේවාවක් එක් කරන්න";
    document.getElementById('srv-edit-id').value = "";
    document.getElementById('srv-title').value = "";
    document.getElementById('srv-badge').value = "Service";
    document.getElementById('srv-img').value = "";
    document.getElementById('srv-desc').value = "";
    document.getElementById('service-modal').classList.remove('hidden');
}

function editService(id, title, badge, imageUrl, desc) {
    document.getElementById('modal-title').innerText = "සේවාව සංස්කරණය කරන්න";
    document.getElementById('srv-edit-id').value = id;
    document.getElementById('srv-title').value = title;
    document.getElementById('srv-badge').value = badge;
    document.getElementById('srv-img').value = imageUrl;
    document.getElementById('srv-desc').value = desc;
    document.getElementById('service-modal').classList.remove('hidden');
}

function closeServiceModal() {
    document.getElementById('service-modal').classList.add('hidden');
}

document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('srv-edit-id').value;
    const title = document.getElementById('srv-title').value;
    const badge = document.getElementById('srv-badge').value;
    const image_url = document.getElementById('srv-img').value;
    const description = document.getElementById('srv-desc').value;

    if (id) {
        const { error } = await _supabase
            .from('services')
            .update({ title, badge, image_url, description })
            .eq('id', id);
        if (error) alert('Error: ' + error.message);
    } else {
        const { error } = await _supabase
            .from('services')
            .insert([{ title, badge, image_url, description }]);
        if (error) alert('Error: ' + error.message);
    }

    closeServiceModal();
    loadAdminServicesTable();
});

async function deleteService(id) {
    if (confirm('මෙම සේවාව ඉවත් කිරීමට අවශ්‍ය බව තහවුරු කරන්නද?')) {
        const { error } = await _supabase
            .from('services')
            .delete()
            .eq('id', id);
        if (error) alert('Error: ' + error.message);
        loadAdminServicesTable();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateAdminData();
});