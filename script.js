// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';        // ඔබේ Supabase Project URL එක මෙතැනට යොදන්න
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; // ඔබේ Supabase Anon Key එක මෙතැනට යොදන්න

let _supabase = null;
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && window.supabase) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// DEFAULT INITIAL STORE DATA
const DEFAULT_SETTINGS = {
    storeName: "Francy China Item Online Shop",
    storeTagline: "චයිනා ඉම්පෝටඩ් ඇඳුම්, ක්‍රීම් සහ ෆැන්සි භාණ්ඩ",
    logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
    whatsappNumber: "94770000000",
    currency: "Rs."
};

const DEFAULT_PRODUCTS = [
    {
        id: "p1",
        code: "#FC-101",
        title: "China Luxury Silk Evening Dress",
        category: "Clothes",
        price: 4850,
        oldPrice: 6200,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
        description: "චීනයෙන් සෘජුවම ආනයනය කරන ලද උසස්ම තත්වයේ සිල්ක් සාද ඇඳුම. ඉතා මෘදු නිමාවකින් යුක්තයි."
    },
    {
        id: "p2",
        code: "#FC-102",
        title: "China Herbal Whitening & Glow Cream",
        category: "Creams",
        price: 2450,
        oldPrice: 3200,
        image: "https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=600&q=80",
        description: "100% ඔරිජිනල් චයිනා හර්බල් ක්‍රීම් එක. මුහුණ පැහැපත් කර දිලිසෙන සුමුදු සමක් ලබා දෙයි."
    },
    {
        id: "p3",
        code: "#FC-103",
        title: "Mini Smart Facial Massager Device",
        category: "China Imported Items",
        price: 3100,
        oldPrice: 4200,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        description: "චාජ් කළ හැකි මුහුණ මසාජ් යන්ත්‍රය. සම තද කර ලස්සන නිමාවක් ලබාදීමට උපකාරී වේ."
    },
    {
        id: "p4",
        code: "#FC-104",
        title: "Trendy Floral Summer Casual Dress",
        category: "Clothes",
        price: 3750,
        oldPrice: 4500,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
        description: "ගුවැන්ෂු වලින් සෘජුවම ගෙනෙන ලද සැහැල්ලු සහ අලංකාර ගවුම."
    },
    {
        id: "p5",
        code: "#FC-105",
        title: "Pearl Collagen Glass Skin Night Cream",
        category: "Creams",
        price: 2900,
        oldPrice: 3800,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
        description: "රාත්‍රී කාලයේ සම පෝෂණය කර දීප්තිමත් බවක් ලබාදෙන නයිට් ක්‍රීම් එක."
    }
];

// GLOBAL APP STATE
let settings = JSON.parse(localStorage.getItem('fc_settings_v2')) || DEFAULT_SETTINGS;
let products = JSON.parse(localStorage.getItem('fc_products_v2')) || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem('fc_cart_v2')) || [];
let currentUser = null;

let currentCategory = "All";
let currentSearchQuery = "";
let checkoutSource = null;
let singleCheckoutProduct = null;

// INITIALIZE APP
window.onload = async function() {
    applyStoreSettings();
    renderCategories();

    if (_supabase) {
        // Check active session
        const { data: { session } } = await _supabase.auth.getSession();
        if (session && session.user) {
            currentUser = session.user;
            updateAdminUIState(true);
        }
        await fetchProductsFromSupabase();
    } else {
        renderProducts();
    }

    updateCartUI();
};

function persistState() {
    localStorage.setItem('fc_settings_v2', JSON.stringify(settings));
    localStorage.setItem('fc_products_v2', JSON.stringify(products));
    localStorage.setItem('fc_cart_v2', JSON.stringify(cart));
}

// FETCH PRODUCTS FROM SUPABASE
async function fetchProductsFromSupabase() {
    try {
        const { data, error } = await _supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            products = data.map(item => ({
                id: item.id,
                code: item.code,
                title: item.title,
                category: item.category,
                price: Number(item.price),
                oldPrice: item.old_price ? Number(item.old_price) : null,
                image: item.image,
                description: item.desc || item.description
            }));
            persistState();
        }
        renderProducts();
    } catch (err) {
        console.error("Supabase load error:", err.message);
        renderProducts();
    }
}

// APPLY SETTINGS TO UI
function applyStoreSettings() {
    document.getElementById('store-name').innerText = settings.storeName;
    document.getElementById('store-tagline').innerText = settings.storeTagline;
    document.getElementById('store-logo').src = settings.logoUrl;

    document.getElementById('footer-logo').src = settings.logoUrl;
    document.getElementById('footer-store-name').innerText = settings.storeName;
    document.getElementById('footer-copyright').innerText = settings.storeName;
    document.getElementById('footer-phone').innerText = settings.whatsappNumber;

    document.getElementById('hero-whatsapp-direct').href = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('හලෝ! මට භාණ්ඩ පිළිබඳ විස්තර දැනගැනීමට අවශ්‍යයි.')}`;

    document.getElementById('admin-setting-whatsapp').value = settings.whatsappNumber;
    document.getElementById('admin-setting-name').value = settings.storeName;
    document.getElementById('admin-setting-logo').value = settings.logoUrl;
}

// CATEGORIES
function renderCategories() {
    const categories = ["All", "Clothes", "Creams", "China Imported Items"];
    const pillsContainer = document.getElementById('category-pills');
    
    pillsContainer.innerHTML = categories.map(cat => {
        const isActive = currentCategory === cat;
        let displayCatName = cat;
        if (cat === 'All') displayCatName = 'සියල්ල (All)';
        if (cat === 'Clothes') displayCatName = 'ඇඳුම් පැළඳුම් (Clothes)';
        if (cat === 'Creams') displayCatName = 'ක්‍රීම් (Creams)';

        return `
            <button onclick="filterProducts('${cat}')" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${isActive ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'bg-white text-slate-600 hover:bg-rose-50 border border-slate-200'}">
                ${displayCatName}
            </button>
        `;
    }).join('');
}

function filterProducts(category) {
    currentCategory = category;
    renderCategories();
    renderProducts();
}

function scrollToCategory(category) {
    filterProducts(category);
    document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleSearch(query) {
    currentSearchQuery = query.toLowerCase().trim();
    renderProducts();
}

// RENDER PRODUCTS
function renderProducts() {
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('no-products');

    const filtered = products.filter(p => {
        const matchesCat = (currentCategory === "All") || (p.category === currentCategory);
        const matchesSearch = p.title.toLowerCase().includes(currentSearchQuery) || 
                              p.code.toLowerCase().includes(currentSearchQuery) ||
                              (p.description && p.description.toLowerCase().includes(currentSearchQuery));
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = "";
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-3xl border border-slate-100 product-card overflow-hidden flex flex-col justify-between">
            <div>
                <div class="relative bg-slate-50 h-56 sm:h-60 flex items-center justify-center p-4">
                    <span class="absolute top-3 left-3 bg-slate-900/90 text-amber-400 text-[11px] font-mono font-black px-2.5 py-1 rounded-lg shadow-sm border border-slate-700">
                        ${p.code}
                    </span>
                    <img src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain" onerror="this.src='https://placehold.co/400x400/f1f5f9/94a3b8?text=Image'">
                </div>

                <div class="p-5 space-y-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">${p.category}</span>
                    <h4 class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">${p.title}</h4>
                    <p class="text-xs text-slate-500 line-clamp-2">${p.description || ''}</p>
                    
                    <div class="flex items-baseline space-x-2 pt-2">
                        <span class="text-base sm:text-lg font-black text-rose-600">Rs. ${Number(p.price).toLocaleString()}</span>
                        ${p.oldPrice ? `<span class="text-xs text-slate-400 line-through">Rs. ${Number(p.oldPrice).toLocaleString()}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="p-5 pt-0 grid grid-cols-2 gap-2">
                <button onclick="addToCart('${p.id}')" class="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1">
                    <i class="fa-solid fa-cart-plus"></i> කාට් එකට
                </button>
                <button onclick="buyNowSingle('${p.id}')" class="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-md">
                    <i class="fa-brands fa-whatsapp"></i> මිලදී ගන්න
                </button>
            </div>
        </div>
    `).join('');
}

// CART LOGIC
function addToCart(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...p, qty: 1 });
    }

    persistState();
    updateCartUI();
    showToast(`'${p.code}' කාට් එකට එකතු කළා!`);
}

function updateCartQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    persistState();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    persistState();
    updateCartUI();
    showToast("භාණ්ඩය ඉවත් කළා");
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cart-count-badge').innerText = totalItems;

    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('cart-subtotal').innerText = `Rs. ${subtotal.toLocaleString()}`;

    const container = document.getElementById('cart-items-container');
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-400 space-y-2">
                <i class="fa-solid fa-bag-shopping text-4xl"></i>
                <p class="text-xs font-bold">ඔබගේ කාට් එක හිස්ව පවතී.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="pt-3 flex items-center space-x-3">
            <img src="${item.image}" class="w-12 h-12 object-contain rounded-xl bg-slate-50 border border-slate-100" alt="">
            <div class="flex-grow space-y-0.5">
                <div class="flex items-center space-x-2">
                    <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">${item.code}</span>
                    <h5 class="font-bold text-slate-800 text-xs line-clamp-1">${item.title}</h5>
                </div>
                <p class="text-xs font-bold text-rose-600">Rs. ${(item.price * item.qty).toLocaleString()}</p>
                <div class="flex items-center space-x-2">
                    <button onclick="updateCartQty('${item.id}', -1)" class="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold">-</button>
                    <span class="text-xs font-bold">${item.qty}</span>
                    <button onclick="updateCartQty('${item.id}', 1)" class="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-slate-300 hover:text-rose-600 p-2">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}

function toggleCartDrawer() {
    document.getElementById('cart-drawer').classList.toggle('translate-x-full');
    document.getElementById('cart-drawer-overlay').classList.toggle('hidden');
}

// BUY NOW / WHATSAPP ORDER LOGIC
function buyNowSingle(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    checkoutSource = 'single';
    singleCheckoutProduct = p;
    openBuyerDetailsModal();
}

function openBuyerDetailsModal(source = 'single') {
    if (source === 'cart') {
        if (cart.length === 0) {
            showToast("ඔබගේ කාට් එක හිස්ව පවතී!");
            return;
        }
        checkoutSource = 'cart';
        toggleCartDrawer();
    }

    const summaryBox = document.getElementById('buyer-order-summary');
    if (checkoutSource === 'single' && singleCheckoutProduct) {
        summaryBox.innerHTML = `
            <p class="font-bold text-rose-900">තෝරාගත් භාණ්ඩය:</p>
            <p><b>කේතය:</b> ${singleCheckoutProduct.code} | <b>නම:</b> ${singleCheckoutProduct.title}</p>
            <p><b>මිල:</b> Rs. ${Number(singleCheckoutProduct.price).toLocaleString()}</p>
        `;
    } else {
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        summaryBox.innerHTML = `
            <p class="font-bold text-rose-900">කාට් එකේ එකතුව (${cart.length} අයිටම්):</p>
            <p>${cart.map(i => `${i.code} (x${i.qty})`).join(', ')}</p>
            <p><b>මුළු මුදල:</b> Rs. ${total.toLocaleString()}</p>
        `;
    }

    document.getElementById('buyer-modal').classList.remove('hidden');
}

function closeBuyerDetailsModal() {
    document.getElementById('buyer-modal').classList.add('hidden');
}

function processWhatsAppOrder(e) {
    e.preventDefault();

    const name = document.getElementById('buyer-name').value.trim();
    const phone = document.getElementById('buyer-phone').value.trim();
    const address = document.getElementById('buyer-address').value.trim();
    const city = document.getElementById('buyer-city').value.trim();
    const notes = document.getElementById('buyer-notes').value.trim();

    let message = `🛒 *NEW ORDER - ${settings.storeName}*\n\n`;
    message += `👤 *මිලදී ගන්නාගේ විස්තර (Buyer Details):*\n`;
    message += `• නම: ${name}\n`;
    message += `• දුරකථන: ${phone}\n`;
    message += `• ලිපිනය: ${address}\n`;
    message += `• නගරය: ${city}\n`;
    if (notes) message += `• විශේෂ සටහන්: ${notes}\n`;

    message += `\n📦 *ඇණවුම් කළ භාණ්ඩ (Order Items):*\n`;

    let grandTotal = 0;

    if (checkoutSource === 'single' && singleCheckoutProduct) {
        grandTotal = singleCheckoutProduct.price;
        message += `1. [${singleCheckoutProduct.code}] ${singleCheckoutProduct.title} (x1) = Rs. ${Number(singleCheckoutProduct.price).toLocaleString()}\n`;
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            grandTotal += itemTotal;
            message += `${index + 1}. [${item.code}] ${item.title} (x${item.qty}) = Rs. ${itemTotal.toLocaleString()}\n`;
        });
    }

    message += `\n💰 *මුළු එකතුව (Total Amount): Rs. ${grandTotal.toLocaleString()}*\n\n`;
    message += `කරුණාකර මෙම ඇණවුම තහවුරු කරන්න. ස්තූතියි!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;

    closeBuyerDetailsModal();
    window.open(whatsappUrl, '_blank');
}

// SECURE SUPABASE ADMIN AUTHENTICATION (EMAIL & PASSWORD)
function handleAdminHeaderBtn() {
    if (currentUser) {
        showAdminPortal();
    } else {
        openAdminLoginModal();
    }
}

function openAdminLoginModal() {
    document.getElementById('admin-login-modal').classList.remove('hidden');
}

function closeAdminLoginModal() {
    document.getElementById('admin-login-modal').classList.add('hidden');
}

async function verifyAdminAuth(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email-input').value.trim();
    const password = document.getElementById('admin-password-input').value;
    const btn = document.getElementById('admin-login-submit-btn');

    btn.innerText = "Verifying...";
    btn.disabled = true;

    if (_supabase) {
        try {
            const { data, error } = await _supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            currentUser = data.user;
            closeAdminLoginModal();
            updateAdminUIState(true);
            showAdminPortal();
            showToast("ඇඩ්මින් ලෙස සාර්ථකව පිවිසුනා!");
        } catch (err) {
            showToast("Login අසාර්ථකයි: " + err.message);
        } finally {
            btn.innerText = "Login";
            btn.disabled = false;
        }
    } else {
        // Fallback for offline local dev mode if Supabase keys not set yet
        if (email === "admin@francy.com" && password === "admin1289") {
            currentUser = { email: email };
            closeAdminLoginModal();
            updateAdminUIState(true);
            showAdminPortal();
            showToast("Local Admin ලෙස පිවිසුනා!");
        } else {
            showToast("වැරදි Email හෝ Password එකකි!");
        }
        btn.innerText = "Login";
        btn.disabled = false;
    }
}

async function logoutAdmin() {
    if (_supabase) {
        await _supabase.auth.signOut();
    }
    currentUser = null;
    updateAdminUIState(false);
    closeAdminPortal();
    showToast("Admin Logout විය!");
}

function updateAdminUIState(isLoggedIn) {
    const btnText = document.getElementById('admin-btn-text');
    const emailDisplay = document.getElementById('admin-email-display');

    if (isLoggedIn && currentUser) {
        btnText.innerText = "ඇඩ්මින් Dashboard";
        if (emailDisplay) emailDisplay.innerText = `Logged as: ${currentUser.email}`;
    } else {
        btnText.innerText = "ඇඩ්මින් ලොගින්";
    }
}

function showAdminPortal() {
    if (!currentUser) {
        openAdminLoginModal();
        return;
    }
    document.getElementById('storefront-view').classList.add('hidden');
    document.getElementById('admin-view').classList.remove('hidden');
    renderAdminTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeAdminPortal() {
    document.getElementById('admin-view').classList.add('hidden');
    document.getElementById('storefront-view').classList.remove('hidden');
}

function switchAdminTab(tab) {
    ['products', 'add', 'settings'].forEach(t => {
        document.getElementById(`admin-tab-${t}`).classList.add('hidden');
        const btn = document.getElementById(`tab-btn-${t}`);
        btn.classList.remove('text-rose-600', 'border-b-2', 'border-rose-600', 'font-bold');
        btn.classList.add('text-slate-600');
    });

    document.getElementById(`admin-tab-${tab}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`tab-btn-${tab}`);
    activeBtn.classList.add('text-rose-600', 'border-b-2', 'border-rose-600', 'font-bold');
    activeBtn.classList.remove('text-slate-600');
}

function renderAdminTable() {
    document.getElementById('admin-product-count').innerText = products.length;
    const tbody = document.getElementById('admin-product-table-body');

    tbody.innerHTML = products.map(p => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4">
                <img src="${p.image}" class="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white" alt="">
            </td>
            <td class="py-3 px-4 font-mono font-bold text-slate-800">${p.code}</td>
            <td class="py-3 px-4 font-bold text-slate-800">${p.title}</td>
            <td class="py-3 px-4"><span class="px-2 py-0.5 bg-slate-100 rounded text-xs">${p.category}</span></td>
            <td class="py-3 px-4 font-bold text-rose-600">Rs. ${Number(p.price).toLocaleString()}</td>
            <td class="py-3 px-4 text-right space-x-2">
                <button onclick="openEditProduct('${p.id}')" class="text-rose-600 hover:text-rose-800 font-bold text-xs"><i class="fa-solid fa-pen"></i> වෙනස් කරන්න</button>
                <button onclick="deleteProduct('${p.id}')" class="text-slate-400 hover:text-rose-600 font-bold text-xs"><i class="fa-solid fa-trash"></i> මකන්න</button>
            </td>
        </tr>
    `).join('');
}

function openAddProductTab() {
    document.getElementById('admin-form-title').innerText = "අලුත් භාණ්ඩයක් එකතු කරන්න";
    document.getElementById('admin-edit-id').value = "";
    document.getElementById('admin-prod-code').value = `#FC-${100 + products.length + 1}`;
    document.getElementById('admin-prod-title').value = "";
    document.getElementById('admin-prod-category').value = "Clothes";
    document.getElementById('admin-prod-price').value = "";
    document.getElementById('admin-prod-oldprice').value = "";
    document.getElementById('admin-prod-img').value = "";
    document.getElementById('admin-prod-desc').value = "";

    switchAdminTab('add');
}

function openEditProduct(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    document.getElementById('admin-form-title').innerText = "භාණ්ඩයේ විස්තර වෙනස් කරන්න";
    document.getElementById('admin-edit-id').value = p.id;
    document.getElementById('admin-prod-code').value = p.code;
    document.getElementById('admin-prod-title').value = p.title;
    document.getElementById('admin-prod-category').value = p.category;
    document.getElementById('admin-prod-price').value = p.price;
    document.getElementById('admin-prod-oldprice').value = p.oldPrice || "";
    document.getElementById('admin-prod-img').value = p.image;
    document.getElementById('admin-prod-desc').value = p.description || "";

    switchAdminTab('add');
}

async function saveProductFromAdmin(e) {
    e.preventDefault();

    if (!currentUser) {
        showToast("කරුණාකර ප්‍රථමයෙන් ඇඩ්මින් ලෙස ලොග් වන්න!");
        return;
    }

    const editId = document.getElementById('admin-edit-id').value;
    const code = document.getElementById('admin-prod-code').value.trim();
    const title = document.getElementById('admin-prod-title').value.trim();
    const category = document.getElementById('admin-prod-category').value;
    const price = parseFloat(document.getElementById('admin-prod-price').value);
    const oldPrice = parseFloat(document.getElementById('admin-prod-oldprice').value) || null;
    const image = document.getElementById('admin-prod-img').value.trim();
    const description = document.getElementById('admin-prod-desc').value.trim();

    const productPayload = {
        id: editId || 'p_' + Date.now(),
        code: code,
        title: title,
        category: category,
        price: price,
        old_price: oldPrice,
        image: image,
        desc: description
    };

    if (_supabase) {
        try {
            const { error } = await _supabase.from('products').upsert([productPayload]);
            if (error) throw error;
            await fetchProductsFromSupabase();
            showToast("Supabase Database එකට සාර්ථකව සුරකින ලදී!");
        } catch (err) {
            showToast("දෝෂයක් සිදු විය: " + err.message);
        }
    } else {
        if (editId) {
            const idx = products.findIndex(p => p.id === editId);
            if (idx !== -1) {
                products[idx] = { id: editId, code, title, category, price, oldPrice, image, description };
            }
        } else {
            products.push({ id: productPayload.id, code, title, category, price, oldPrice, image, description });
        }
        persistState();
        renderProducts();
        showToast("භාණ්ඩය සාර්ථකව සුරකින ලදී!");
    }

    renderAdminTable();
    switchAdminTab('products');
}

async function deleteProduct(productId) {
    if (!currentUser) {
        showToast("කරුණාකර ප්‍රථමයෙන් ඇඩ්මින් ලෙස ලොග් වන්න!");
        return;
    }

    if (confirm("ඔබට මෙම භාණ්ඩය ඉවත් කිරීමට අවශ්‍යද?")) {
        if (_supabase) {
            try {
                const { error } = await _supabase.from('products').delete().eq('id', productId);
                if (error) throw error;
                await fetchProductsFromSupabase();
                showToast("Database එකෙන් ඉවත් කළා!");
            } catch (err) {
                showToast("දෝෂයක්: " + err.message);
            }
        } else {
            products = products.filter(p => p.id !== productId);
            persistState();
            renderProducts();
            showToast("භාණ්ඩය ඉවත් කළා!");
        }
        renderAdminTable();
    }
}

function saveStoreSettings(e) {
    e.preventDefault();

    settings.whatsappNumber = document.getElementById('admin-setting-whatsapp').value.trim();
    settings.storeName = document.getElementById('admin-setting-name').value.trim();
    settings.logoUrl = document.getElementById('admin-setting-logo').value.trim();

    persistState();
    applyStoreSettings();
    showToast("සැකසුම් සාර්ථකව සුරකින ලදී!");
}

function navigateTo(target) {
    if (target === 'home') {
        closeAdminPortal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => { toast.classList.add('translate-y-20', 'opacity-0'); }, 3000);
}
