import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, arrayUnion, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7AD1enBMv3mu2rBHM19GhBMRl2s6MOuU",
  authDomain: "apex-agency-4f177.firebaseapp.com",
  projectId: "apex-agency-4f177",
  storageBucket: "apex-agency-4f177.firebasestorage.app",
  messagingSenderId: "804675786581",
  appId: "1:804675786581:web:1948fcfda4e49ff09841dc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- የተጨመረ: ፓስወርድን ሃሽ (Hash) ማድረጊያ ፈንክሽን ---
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// --------------------------------------------------------

const packagesData = {
    1: { id: "Ascent", priceValue: 9000, 
        en: { title: "Package 1: Ascent (The Foundation)", items: ["<b>Branding Foundation:</b> Custom Logo Design, Brand Color Palette, and Typography.", "<b>Page Authority:</b> Setup and Optimization of Facebook, Instagram, and TikTok profiles.", "<b>Strategic Content:</b> 10 High-quality Professional Posts per month.", "<b>Community Engagement:</b> Basic Comment and DM management to keep your audience active.", "<b>Growth Consultation:</b> Monthly expert advice to align your digital strategy."] }, 
        am: { title: "ጥቅል 1: Ascent (መሰረቱ)", items: ["<b>የብራንድ መሰረት:</b> የሎጎ ዲዛይን፣ የብራንድ ቀለማት እና ፎንት (Typography)።", "<b>የገጽ የበላይነት:</b> የ Facebook፣ Instagram እና TikTok ገጾችን ማዋቀር እና ማስተካከል።", "<b>ስትራቴጂካዊ ይዘት:</b> በወር 10 ከፍተኛ ጥራት ያላቸው ፖስቶች።", "<b>የማህበረሰብ ተሳትፎ:</b> አድማጭዎን ንቁ ለማድረግ ኮመንት እና መልዕክቶችን ማስተዳደር።", "<b>የዕድገት ምክክር:</b> የዲጂታል ስትራቴጂዎን ለማስተካከል ወርሃዊ ምክክር።"] } 
    },
    2: { id: "Apex", priceValue: 18500, 
        en: { title: "Package 2: Apex (The Growth Accelerator)", items: ["<b>Conversion Copywriting:</b> Compelling Hooks, Stories, and CTAs designed to sell.", "<b>Vantage Ad Management:</b> 5 Targeted Ad Campaigns focused on Traffic and Lead Generation.", "<b>Google Authority (GMB):</b> Full Google Maps setup and Review management for local search dominance.", "<b>Daily Dominance:</b> Daily Story updates and consistent feed activity to stay top-of-mind.", "<b>Performance Tracking:</b> Monthly reports on reach and lead quality.", "<b>Growth Consultation:</b> Strategy sessions included."] }, 
        am: { title: "ጥቅል 2: Apex (የዕድገት ማጣደፊያ)", items: ["<b>የልወጣ ኮፒራይቲንግ:</b> አሳማኝ ፅሁፎች፣ ታሪኮች እና ማዘዣዎች (CTAs)።", "<b>የማስታወቂያ አስተዳደር:</b> 5 ትራፊክ እና ሊድ ላይ ያተኮሩ የማስታወቂያ ዘመቻዎች።", "<b>የ Google የበላይነት:</b> የ Google Maps ሙሉ ትስስር እና ሪቪው አስተዳደር።", "<b>ዕለታዊ የበላይነት:</b> ዕለታዊ የስቶሪ እንቅስቃሴዎች እና ቋሚ ፖስቶች።", "<b>የአፈጻጸም ክትትል:</b> የተደራሽነት እና ጥራት ወርሃዊ ሪፖርቶች።", "<b>የዕድገት ምክክር:</b> የስትራቴጂ ውይይቶችን ያካትታል።"] } 
    },
    3: { id: "Zenith", priceValue: 50000, 
        en: { title: "Package 3: Zenith (The Empire Builder)", items: ["<b>Full-Spectrum Content:</b> 20+ Posts/Reels per month covering all platforms.", "<b>Automated Sales Funnel:</b> Custom Business Website + Interactive Telegram Bot.", "<b>Data Intelligence:</b> Meta Pixel setup and Retargeting ads to win back lost customers.", "<b>SEO & Digital PR:</b> Search Engine Optimization and online brand mentions.", "<b>SOP Development:</b> Standardized Operating Procedures for your internal team.", "<b>Founder Support:</b> Direct 1-on-1 strategic consulting from the founder."] }, 
        am: { title: "ጥቅል 3: Zenith (የግዛት ገንቢው)", items: ["<b>ሙሉ-ስፔክትረም ይዘት:</b> 20+ ፖስቶች/Reels በወር ለሁሉም ፕላትፎርሞች።", "<b>አውቶማቲክ የሽያጭ ስርዓት:</b> ፕሪሚየም ዌብሳይት + የቴሌግራም ቦት።", "<b>የዳታ ኢንተለጀንስ:</b> Meta Pixel ትስስር እና የጠፉ ደንበኞችን መመለሻ (Retargeting)።", "<b>SEO እና ዲጂታል PR:</b> የፍለጋ ሞተር ማመቻቸት እና የብራንድ እውቅና።", "<b>የስራ አሰራር (SOP):</b> ለቡድንዎ መደበኛ የአሰራር ሂደቶች ማዘጋጀት።", "<b>የመስራች ድጋፍ:</b> ከድርጅቱ መስራች ጋር ቀጥተኛ የ1-ለ-1 ምክክር።"] } 
    },
    4: { id: "Addons", priceValue: null, 
        en: { title: "Individual Services (Add-ons)", items: ["Choose specific standalone services tailored to your exact needs. Click on a service below to see its exact fixed pricing and proceed to payment."] }, 
        am: { title: "ተጨማሪ የግል አገልግሎቶች", items: ["ለእርስዎ ፍላጎት ብቻ የሚሆኑ የተናጠል አገልግሎቶችን ይምረጡ። የተወሰነውን ዋጋ ለማየት እና ለመክፈል ከታች ካሉት አማራጮች ውስጥ አንዱን ይጫኑ።"] } 
    },
};

const addOnServices = [
    { id: 'logo', nameEn: 'Professional Logo Design', nameAm: 'ፕሮፌሽናል የሎጎ ዲዛይን', price: 1500, days: 5 },
    { id: 'bot', nameEn: 'Custom Telegram Bot', nameAm: 'የቴሌግራም ቦት ማበልጸግ', price: 6000, days: 15 },
    { id: 'web', nameEn: 'Premium Website Design', nameAm: 'ፕሪሚየም ዌብሳይት ዲዛይን', price: 16000, days: 20 },
    { id: 'audit', nameEn: 'Social Media Audit & Setup', nameAm: 'የሶሻል ሚዲያ ኦዲት እና ማስተካከል', price: 2500, days: 5 },
    { id: 'card', nameEn: 'Modern Business Card Design', nameAm: 'ዘመናዊ የቢዝነስ ካርድ ዲዛይን', price: 750, days: 5 }
];

let currentLang = 'en';
let currentOpenDetail = null;
let currentSelectedAddonPrice = 0;
let currentSelectedAddonName = "";
let currentSelectedAddonDays = 0;

let isLoggedIn = false;
let userProfile = { email: '', fullName: '', businessName: '', location: '', niche: '', phone: '', password: '', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', activePackage: null, payments: [], contactMethod: 'Telegram', apexId: '' };

const homePage = document.getElementById('page-home'); const packagesPage = document.getElementById('page-packages'); const detailsPage = document.getElementById('page-details'); const profilePage = document.getElementById('page-profile');
const typedTextSpan = homePage.querySelector(".typed-text"); const typingContainer = homePage.querySelector(".typing-container");
const exploreBtn = document.getElementById('explore-btn'); const themeToggle = document.getElementById('theme-toggle'); const langToggle = document.getElementById('lang-toggle'); const detailsContainer = document.getElementById('details-container');

// Basic Modals
const aboutNavBtn = document.getElementById('about-nav-btn'), aboutModal = document.getElementById('about-modal'), closeAboutBtn = document.getElementById('close-about');
const faqNavBtn = document.getElementById('faq-nav-btn'), faqModal = document.getElementById('faq-modal'), closeFaqBtn = document.getElementById('close-faq');
const contactBtn = document.getElementById('contact-btn'), contactModal = document.getElementById('contact-modal'), closeContactBtn = document.getElementById('close-contact');

// Profile Modals
const supportModal = document.getElementById('support-modal'), closeSupportBtn = document.getElementById('close-support'), btnOpenSupport = document.getElementById('btn-open-support');
const historyModal = document.getElementById('history-modal'), closeHistoryBtn = document.getElementById('close-history'), btnOpenHistory = document.getElementById('btn-open-history'), historyList = document.getElementById('history-list');
const settingsModal = document.getElementById('settings-modal'), closeSettingsBtn = document.getElementById('close-settings'), btnOpenSettings = document.getElementById('btn-open-settings');
const contractsModal = document.getElementById('contracts-modal'), closeContractsBtn = document.getElementById('close-contracts'), btnOpenContracts = document.getElementById('btn-open-contracts');

// Social & Iframe Modals
const socialChoiceModal = document.getElementById('social-choice-modal'), closeSocialChoice = document.getElementById('close-social-choice');
const socialInApp = document.getElementById('social-in-app'), socialExternal = document.getElementById('social-external');
const socialIframeModal = document.getElementById('social-iframe-modal'), closeSocialIframe = document.getElementById('close-social-iframe'), socialIframe = document.getElementById('social-iframe');
let tempSocialUrl = "";

// Auth & Success Modals
const profileTriggerBtn = document.getElementById('profile-trigger-btn'), authModal = document.getElementById('auth-modal'), closeAuthBtn = document.getElementById('close-auth');
const authStep0 = document.getElementById('auth-step-0'), authStepLogin = document.getElementById('auth-step-login'), authStepRegister = document.getElementById('auth-step-register'), authStep2 = document.getElementById('auth-step-2'), authStep3 = document.getElementById('auth-step-3');
const chooseLoginBtn = document.getElementById('choose-login-btn'), chooseRegisterBtn = document.getElementById('choose-register-btn');
const backToAuth1 = document.getElementById('back-to-auth-1'), backToAuth2 = document.getElementById('back-to-auth-2');
const loginForm = document.getElementById('login-form'), registerEmailForm = document.getElementById('register-email-form'), completeProfileForm = document.getElementById('complete-profile-form');
const logoutBtn = document.getElementById('logout-btn');
const regSuccessModal = document.getElementById('reg-success-modal'), closeRegSuccess = document.getElementById('close-reg-success'), continueFromReg = document.getElementById('continue-from-reg');
const contractSuccessModal = document.getElementById('contract-success-modal'), closeContractSuccessBtn = document.getElementById('close-contract-success'), downloadPdfBtn = document.getElementById('download-pdf-btn');

// Terms Additions
const inlineTermsContent = document.getElementById('inline-terms-content'), openTermsLink = document.getElementById('open-terms-link'), termsCheckbox = document.getElementById('terms-checkbox'), finishRegBtn = document.getElementById('finish-reg-btn');

window.goToHome = goToHome; window.goToPackages = goToPackages; window.showDetails = showDetails;

// Terms Interaction
openTermsLink.addEventListener('click', (e) => { e.preventDefault(); inlineTermsContent.classList.toggle('hidden'); });
termsCheckbox.addEventListener('change', (e) => { 
    finishRegBtn.disabled = !e.target.checked; 
    finishRegBtn.style.opacity = e.target.checked ? "1" : "0.5";
    finishRegBtn.style.cursor = e.target.checked ? "pointer" : "not-allowed";
});

// Typing Animation
let textToType = "";
let charIndex = 0;
let typingTimeout;

function type() { 
    if (charIndex < textToType.length) {
        typedTextSpan.textContent += textToType.charAt(charIndex);
        charIndex++; 
        typingTimeout = setTimeout(type, 100); 
    }
}

function startTyping() { 
    clearTimeout(typingTimeout);
    textToType = typingContainer.getAttribute(`data-${currentLang}`);
    typedTextSpan.textContent = ""; 
    charIndex = 0; 
    typingTimeout = setTimeout(type, 500); 
}

function hideAllPages() { document.querySelectorAll('.page').forEach(page => page.classList.remove('active')); document.querySelectorAll('#page-packages .sequential, #page-packages .packages-title').forEach(el => { el.style.animation = 'none'; el.style.opacity = '0'; }); }
function goToHome() { hideAllPages(); homePage.classList.add('active'); startTyping(); }
function goToPackages() { hideAllPages(); packagesPage.classList.add('active'); document.querySelectorAll('#page-packages .sequential, #page-packages .packages-title').forEach((el, index) => { el.style.setProperty('--card-order', index); el.style.animation = 'popUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'; }); }
function showDetails(id) { currentOpenDetail = id; currentSelectedAddonPrice = 0; currentSelectedAddonName = ""; currentSelectedAddonDays = 0; hideAllPages(); detailsPage.classList.add('active'); renderDetails(); }

function showAuthModal() { authModal.classList.remove('hidden'); authStep0.classList.remove('hidden'); authStepLogin.classList.add('hidden'); authStepRegister.classList.add('hidden'); authStep2.classList.add('hidden'); authStep3.classList.add('hidden'); }

profileTriggerBtn.addEventListener('click', () => { if (isLoggedIn) { hideAllPages(); profilePage.classList.add('active'); updateLanguage(); } else { showAuthModal(); } });
closeAuthBtn.addEventListener('click', () => { authModal.classList.add('hidden'); }); chooseLoginBtn.addEventListener('click', () => { authStep0.classList.add('hidden'); authStepLogin.classList.remove('hidden'); }); chooseRegisterBtn.addEventListener('click', () => { authStep0.classList.add('hidden'); authStepRegister.classList.remove('hidden'); });
backToAuth1.addEventListener('click', showAuthModal); backToAuth2.addEventListener('click', showAuthModal);

// Login (የፓስወርድ ማመሳከሪያ ተስተካክሏል)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); const email = document.getElementById('login-email').value; const pwd = document.getElementById('login-password').value;
    try {
        const docSnap = await getDoc(doc(db, "users", email));
        if (docSnap.exists()) {
            const data = docSnap.data();
            const hashedInputPwd = await hashPassword(pwd);
            if (data.password && data.password !== hashedInputPwd) { alert("Incorrect Password"); return; }
            userProfile = { email: email, ...data };
            if(!userProfile.payments) userProfile.payments = [];
            if(!userProfile.apexId) userProfile.apexId = "APEX-GUEST";
            isLoggedIn = true; updateProfileUI(); authModal.classList.add('hidden');
            if(detailsPage.classList.contains('active')) renderDetails();
        } else { alert("User not found. Please register."); }
    } catch (err) { console.error(err); }
});

// የኢሜል ማረጋገጫ (ተስተካክሏል)
let expectedVerifyCode = ""; // ትክክለኛው ኮድ የሚቀመጥበት

registerEmailForm.addEventListener('submit', (e) => { 
    e.preventDefault(); 
    userProfile.email = document.getElementById('register-email').value; 
    
    // Random 6-digit ኮድ ማውጣት
    expectedVerifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    // ሪል የኢሜል ሰርቨር ስለሌለ በ Alert እናሳውቃለን (ለሙከራ)
    alert("System Notification (Mock Email):\nYour verification code is: " + expectedVerifyCode);
    
    authStepRegister.classList.add('hidden'); 
    authStep2.classList.remove('hidden'); 
});

document.getElementById('verify-btn').addEventListener('click', () => { 
    const code = document.getElementById('verify-code-input').value; 
    if(code === expectedVerifyCode) {   // ያስገባው ቁጥር ከወጣው ኮድ ጋር እኩል መሆኑን ያረጋግጣል
        document.getElementById('verify-error').classList.add('hidden'); 
        authStep2.classList.add('hidden'); 
        authStep3.classList.remove('hidden'); 
    } else { 
        document.getElementById('verify-error').classList.remove('hidden'); 
    } 
});

// Dropdowns
document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => { wrapper.addEventListener('click', function() { this.classList.toggle('open'); }); });
document.querySelectorAll('.custom-option').forEach(option => { option.addEventListener('click', function() { const wrapper = this.closest('.custom-select-wrapper'); wrapper.querySelector('.custom-select-trigger').textContent = this.textContent; const hi = wrapper.previousElementSibling; if(hi) hi.value = this.getAttribute('data-value'); }); });
window.addEventListener('click', function(e) { document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => { if (!wrapper.contains(e.target)) wrapper.classList.remove('open'); }); });

// Avatar Selection Logic
const customAvatarUpload = document.getElementById('custom-avatar-upload'); const avatarPreviewImg = document.getElementById('avatar-preview-img');

document.getElementById('avatar-trigger-btn').addEventListener('click', () => customAvatarUpload.click());
customAvatarUpload.addEventListener('change', (e) => {
    if(e.target.files && e.target.files[0]) {
        let r = new FileReader(); r.onload = function(evt) { userProfile.avatarUrl = evt.target.result; avatarPreviewImg.src = evt.target.result; document.getElementById('avatar-preview-container').classList.remove('hidden'); }; r.readAsDataURL(e.target.files[0]);
    }
});
document.getElementById('avatar-zoom-slider').addEventListener('input', (e) => { avatarPreviewImg.style.transform = `scale(${e.target.value})`; });

// Function to generate sequential APEX ID
async function generateApexID() {
    const counterRef = doc(db, "system", "userCounter");
    try {
        let newCount = 1001;
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(counterRef);
            if (!sfDoc.exists()) { transaction.set(counterRef, { count: 1001 }); } 
            else { newCount = sfDoc.data().count + 1; transaction.update(counterRef, { count: newCount }); }
        });
        return `APEX-${newCount}`;
    } catch(e) { console.error("ID Generation error, using fallback", e); return `APEX-${Math.floor(Math.random()*9000)+1000}`; }
}

// Registration Complete (ፓስወርድ Hash ተደርጎ ሴቭ እንዲሆን ተስተካክሏል)
completeProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!termsCheckbox.checked) return;

    const pwd = document.getElementById('prof-password').value;
    const pwdConfirm = document.getElementById('prof-password-confirm').value;

    if (pwd.length !== 4 || !/^\d{4}$/.test(pwd)) { alert(currentLang === 'en' ? "Password must be exactly 4 digits." : "የይለፍ ቃል 4 ቁጥሮች ብቻ መሆን አለበት።"); return; }
    if (pwd !== pwdConfirm) { alert(currentLang === 'en' ? "Passwords do not match." : "የይለፍ ቃሎቹ አይመሳሰሉም።"); return; }

    userProfile.fullName = document.getElementById('prof-fullname').value; 
    userProfile.phone = document.getElementById('prof-phone').value;
    userProfile.businessName = document.getElementById('prof-business').value || 'N/A';
    userProfile.location = document.getElementById('prof-location').value; 
    userProfile.niche = document.getElementById('prof-niche').value;
    
    userProfile.password = await hashPassword(pwd); // Hash the password

    if(!userProfile.location || !userProfile.niche) { alert('እባክዎ ቦታ እና የስራ ዘርፍ ይምረጡ!'); return; }

    const newApexId = await generateApexID();
    userProfile.apexId = newApexId;

    try {
        await setDoc(doc(db, "users", userProfile.email), {
            fullName: userProfile.fullName, businessName: userProfile.businessName, phone: userProfile.phone, email: userProfile.email, password: userProfile.password,
            location: userProfile.location, niche: userProfile.niche, avatarUrl: userProfile.avatarUrl,
            contactMethod: 'Telegram', payments: [], registeredAt: new Date(), apexId: newApexId
        });
    } catch (error) { console.error("Error writing document: ", error); }

    isLoggedIn = true; updateProfileUI(); authModal.classList.add('hidden');
    
    // Show ID Success Modal
    document.getElementById('generated-user-id').textContent = newApexId;
    regSuccessModal.classList.remove('hidden');
});

closeRegSuccess.addEventListener('click', () => regSuccessModal.classList.add('hidden'));
continueFromReg.addEventListener('click', () => {
    regSuccessModal.classList.add('hidden');
    if(detailsPage.classList.contains('active')) { renderDetails(); } else { hideAllPages(); profilePage.classList.add('active'); updateLanguage(); }
});

function updateProfileUI() {
    if (isLoggedIn) {
        profileTriggerBtn.innerHTML = `<img src="${userProfile.avatarUrl}" alt="Profile">`;
        document.getElementById('display-fullname').textContent = userProfile.fullName;
        document.getElementById('display-location').textContent = userProfile.location;
        document.getElementById('display-phone').textContent = userProfile.phone;
        document.getElementById('display-id').textContent = userProfile.apexId || '';
        document.getElementById('profile-page-avatar').src = userProfile.avatarUrl;
        
        const statusText = document.getElementById('package-status-text'); const statusDot = document.getElementById('status-dot');
        if (userProfile.activePackage) { statusText.textContent = userProfile.activePackage; statusDot.className = 'dot green'; } 
        else { statusText.textContent = currentLang === 'en' ? 'No Active Packages' : 'ምንም ንቁ ጥቅል የለም'; statusDot.className = 'dot red'; }
    } else { 
        profileTriggerBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`; 
    }
}

logoutBtn.addEventListener('click', () => { isLoggedIn = false; userProfile = { email: '', fullName: '', businessName: '', location: '', niche: '', phone: '', password: '', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', activePackage: null, payments: [], apexId: '' }; updateProfileUI(); goToHome(); });

// Universal Social Links Logic
document.querySelectorAll('.social-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        tempSocialUrl = btn.getAttribute('data-url');
        document.getElementById('social-choice-title').textContent = btn.getAttribute('data-name');
        contactModal.classList.add('hidden');
        socialChoiceModal.classList.remove('hidden');
    });
});
closeSocialChoice.addEventListener('click', () => socialChoiceModal.classList.add('hidden'));
socialExternal.addEventListener('click', () => { socialChoiceModal.classList.add('hidden'); window.open(tempSocialUrl, '_blank'); });
socialInApp.addEventListener('click', () => { socialChoiceModal.classList.add('hidden'); socialIframe.src = tempSocialUrl; socialIframeModal.classList.remove('hidden'); });
closeSocialIframe.addEventListener('click', () => { socialIframeModal.classList.add('hidden'); socialIframe.src = ''; });

// Action Modals Event Listeners
btnOpenHistory.addEventListener('click', () => { historyModal.classList.remove('hidden'); historyList.innerHTML = ""; if (userProfile.payments && userProfile.payments.length > 0) { userProfile.payments.forEach(p => { historyList.innerHTML += `<div style="padding: 15px; border: 1px solid var(--glass-border); border-radius: 10px; background: rgba(0,0,0,0.1);"><strong>${p.package}</strong><br><span style="color: var(--accent);">${p.amount} ETB</span> - Status: ${p.status}</div>`; }); } else { historyList.innerHTML = `<p>${currentLang === 'en' ? 'No payment history found.' : 'ምንም የክፍያ ታሪክ አልተገኘም።'}</p>`; } });
closeHistoryBtn.addEventListener('click', () => historyModal.classList.add('hidden'));
btnOpenSettings.addEventListener('click', () => { 
    settingsModal.classList.remove('hidden'); 
    document.getElementById('set-phone').value = userProfile.phone || ''; 
    document.getElementById('set-business').value = userProfile.businessName || '';
    document.getElementById('set-old-password').value = '';
    document.getElementById('set-new-password').value = '';
}); 
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

// Settings Update (የድሮ እና የአዲስ ፓስወርድ ሃሽ ማመሳከሪያ ተስተካክሏል)
document.getElementById('settings-form').addEventListener('submit', async (e) => { 
    e.preventDefault(); 
    const newPhone = document.getElementById('set-phone').value; 
    const newBusiness = document.getElementById('set-business').value;
    const oldPwd = document.getElementById('set-old-password').value;
    const newPwd = document.getElementById('set-new-password').value;

    let updateData = { phone: newPhone, businessName: newBusiness };

    if (oldPwd || newPwd) {
        const hashedOldPwd = await hashPassword(oldPwd);
        if (hashedOldPwd !== userProfile.password) { alert(currentLang === 'en' ? "Old password is incorrect!" : "የቀድሞው የይለፍ ቃል ትክክል አይደለም!"); return; }
        if (newPwd.length !== 4 || !/^\d{4}$/.test(newPwd)) { alert(currentLang === 'en' ? "New Password must be 4 digits!" : "አዲሱ የይለፍ ቃል 4 ቁጥሮች መሆን አለበት!"); return; }
        updateData.password = await hashPassword(newPwd);
    }

    try { 
        await updateDoc(doc(db, "users", userProfile.email), updateData); 
        userProfile.phone = newPhone; 
        userProfile.businessName = newBusiness; 
        if (updateData.password) userProfile.password = updateData.password;
        updateProfileUI(); 
        settingsModal.classList.add('hidden'); 
        alert(currentLang === 'en' ? "Settings Updated!" : "ማስተካከያው ተቀምጧል!"); 
    } catch(err) { console.error(err); } 
});

btnOpenContracts.addEventListener('click', () => { contractsModal.classList.remove('hidden'); const content = document.getElementById('contract-content'); if (userProfile.activePackage) { content.innerHTML = `<h3 style="color: var(--accent); margin-bottom: 10px;">Contract for ${userProfile.activePackage}</h3><p>Your contract has been generated.</p><p><em>You can access your latest contract PDF from the payment confirmation.</em></p>`; } else { content.innerHTML = `<p>${currentLang === 'en' ? 'No active contracts.' : 'ምንም ንቁ ውል የለም።'}</p>`; } }); closeContractsBtn.addEventListener('click', () => contractsModal.classList.add('hidden'));

// Support Chat Logic
let chatState = { pending: false, messages: [] };

function renderSupportChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML = '';
    
    if (chatState.messages.length === 0) {
        chatWindow.innerHTML = `<div class="chat-msg admin-msg bilingual" data-en="Hello! How can we help you today?" data-am="ሰላም! ዛሬ ምን እንርዳዎት?">${currentLang === 'en' ? 'Hello! How can we help you today?' : 'ሰላም! ዛሬ ምን እንርዳዎት?'}</div>`;
    } else {
        chatState.messages.forEach(msg => {
            chatWindow.innerHTML += `<div class="chat-msg ${msg.role === 'admin' ? 'admin-msg' : 'user-msg'}">${msg.text}</div>`;
        });
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;

    document.querySelectorAll('.send-preset-btn').forEach(btn => {
        btn.disabled = chatState.pending;
        btn.style.opacity = chatState.pending ? '0.5' : '1';
        btn.style.cursor = chatState.pending ? 'not-allowed' : 'pointer';
    });
}

btnOpenSupport.addEventListener('click', () => { 
    const stored = localStorage.getItem('apexChatState_' + userProfile.email);
    if(stored) chatState = JSON.parse(stored);
    renderSupportChat();
    supportModal.classList.remove('hidden'); 
}); 
closeSupportBtn.addEventListener('click', () => supportModal.classList.add('hidden'));

document.querySelectorAll('.send-preset-btn').forEach(btn => { 
    btn.addEventListener('click', async function() { 
        if(chatState.pending) return;
        const msgVal = this.getAttribute('data-val'); 
        const displayTxt = this.textContent;
        const dateStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        chatState.messages.push({ role: 'user', text: displayTxt });
        chatState.pending = true;
        localStorage.setItem('apexChatState_' + userProfile.email, JSON.stringify(chatState));
        renderSupportChat();

        try { 
            await addDoc(collection(db, "support_chats"), { 
                Customer: userProfile.fullName, 
                "Issue Type": msgVal, 
                Time: dateStr, 
                Status: "Unread",
                Email: userProfile.email
            }); 
        } catch (e) { console.error(e); } 

        setTimeout(() => { 
            const adminReply = currentLang === 'en' ? 'Received. An agent will check your request and get back to you shortly. You cannot ask another question until this is resolved.' : 'ተቀብለናል! ሪፖርትዎን አይተን በቅርቡ እናገኝዎታለን። ይህ እስኪመለስ ሌላ ጥያቄ መጠየቅ አይችሉም።';
            chatState.messages.push({ role: 'admin', text: adminReply });
            localStorage.setItem('apexChatState_' + userProfile.email, JSON.stringify(chatState));
            renderSupportChat();
        }, 1000); 
    }); 
});

document.getElementById('reset-chat-btn').addEventListener('click', () => {
    chatState = { pending: false, messages: [] };
    localStorage.removeItem('apexChatState_' + userProfile.email);
    renderSupportChat();
});

// General Modal Listeners
aboutNavBtn.addEventListener('click', () => { aboutModal.classList.remove('hidden'); }); closeAboutBtn.addEventListener('click', () => { aboutModal.classList.add('hidden'); });
faqNavBtn.addEventListener('click', () => { faqModal.classList.remove('hidden'); }); closeFaqBtn.addEventListener('click', () => { faqModal.classList.add('hidden'); });
contactBtn.addEventListener('click', () => { contactModal.classList.remove('hidden'); }); closeContactBtn.addEventListener('click', () => { contactModal.classList.add('hidden'); });
[aboutModal, faqModal, contactModal, supportModal, historyModal, settingsModal, contractsModal, socialChoiceModal, socialIframeModal, regSuccessModal, contractSuccessModal].forEach(modal => { modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); }); });

// Theme & Language
themeToggle.addEventListener('click', () => { document.body.classList.toggle('light-mode'); });
langToggle.addEventListener('click', () => { currentLang = currentLang === 'en' ? 'am' : 'en'; updateLanguage(); });

function updateLanguage() {
    document.querySelectorAll('.bilingual').forEach(el => { el.innerHTML = el.getAttribute(`data-${currentLang}`); });
    if (homePage.classList.contains('active')) startTyping();
    if (detailsPage.classList.contains('active') && currentOpenDetail) renderDetails();
    if (profilePage.classList.contains('active')) updateProfileUI();
}

// PDF Download function using html2pdf
downloadPdfBtn.addEventListener('click', () => {
    const element = document.getElementById('printable-contract');
    const opt = {
        margin:       10,
        filename:     `${userProfile.apexId}_Contract.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});

// Format Date Helper
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
}

// Payment Integration & Contract Generation
async function initiateChapaPayment(amount, description, daysDuration) {
    if (!isLoggedIn) { showAuthModal(); return; }
    const publicKey = "CHAPUBK_TEST-pmLD19Mp2mTXGP4wYuTo2Mk8V1a63saP"; const txRef = "apex-" + Date.now();
    try {
        let checkout = new ChapaCheckout({
            publicKey: publicKey, amount: amount, currency: "ETB", email: userProfile.email, first_name: userProfile.fullName, tx_ref: txRef,
            onSuccessfulPayment: async function () {
                try {
                    await updateDoc(doc(db, "users", userProfile.email), { activePackage: description, payments: arrayUnion({ amount: amount, package: description, status: "Success", tx_ref: txRef, date: new Date().toISOString() }) });
                    userProfile.activePackage = description; if(!userProfile.payments) userProfile.payments = [];
                    userProfile.payments.push({ amount: amount, package: description, status: "Success", tx_ref: txRef, date: new Date().toISOString() });
                    updateProfileUI();

                    // Generate Auto Contract
                    const startDate = new Date();
                    const endDate = new Date();
                    const totalDays = daysDuration + 2; // +2 Days for sending data
                    endDate.setDate(endDate.getDate() + totalDays);

                    document.getElementById('contract-client-name').textContent = userProfile.fullName;
                    document.getElementById('contract-client-id').textContent = userProfile.apexId;
                    document.getElementById('contract-date').textContent = formatDate(startDate);
                    document.getElementById('contract-package').textContent = description;
                    document.getElementById('contract-start-date').textContent = formatDate(startDate);
                    document.getElementById('contract-end-date').textContent = formatDate(endDate);
                    document.getElementById('contract-duration').textContent = totalDays;
                    document.getElementById('contract-price').textContent = amount.toLocaleString();

                    contractSuccessModal.classList.remove('hidden');

                } catch (error) { console.error("Error saving payment:", error); }
            },
            onPaymentFailure: function () { alert(currentLang === 'en' ? "Payment Failed. Please try again." : "ክፍያዎ አልተሳካም። እባክዎ እንደገና ይሞክሩ።"); },
            customization: { title: "APEX Digital Solution", description: description, logo: "https://image2url.com/r2/default/images/1774855725296-f5bbbe32-49ca-472b-b9cf-ac2b456768e3.png" }
        });
    } catch(err) { console.error("Chapa error:", err); alert("Chapa Checkout JS error."); }
}

window.handlePayClick = function() {
    const data = packagesData[currentOpenDetail]; let amount = 0; let description = ""; let days = 30; // Default main package
    if (currentOpenDetail === 4) { 
        amount = currentSelectedAddonPrice; 
        description = currentSelectedAddonName; 
        days = currentSelectedAddonDays; 
    } else { 
        amount = data.priceValue; 
        description = data.id + " Package"; 
    }
    initiateChapaPayment(amount, description, days);
};

function selectAddon(id, price, name, days) {
    currentSelectedAddonPrice = price; currentSelectedAddonName = name; currentSelectedAddonDays = days;
    document.querySelectorAll('.addon-card').forEach(card => card.classList.remove('selected'));
    document.getElementById(`addon-${id}`).classList.add('selected');
    const counterElement = document.getElementById('price-counter'); if (counterElement) counterElement.innerText = price.toLocaleString();
    const payBtn = document.getElementById('final-pay-btn'); if (payBtn) payBtn.disabled = false;
}
window.selectAddon = selectAddon;

function renderDetails() {
    const data = packagesData[currentOpenDetail]; const langData = data[currentLang];
    let listItemsHTML = langData.items.map((item, index) => `<li class="staggered-item" style="--item-order: ${index};">${item}</li>`).join('');
    let priceHTML = ''; let selectorHTML = ''; let payBtnDisabled = false;

    if (currentOpenDetail === 4) {
        payBtnDisabled = currentSelectedAddonPrice === 0;
        let gridItems = addOnServices.map(service => {
            const isSelected = currentSelectedAddonName === service.nameEn ? 'selected' : '';
            const dispName = currentLang === 'en' ? service.nameEn : service.nameAm;
            return `<div id="addon-${service.id}" class="addon-card ${isSelected}" onclick="selectAddon('${service.id}', ${service.price}, '${service.nameEn}', ${service.days})">
                        <div class="addon-name">${dispName}</div>
                        <div class="addon-price">${service.price.toLocaleString()} ETB</div>
                    </div>`;
        }).join('');
        selectorHTML = `<div class="addon-selector-grid staggered-item" style="--item-order: ${langData.items.length};">${gridItems}</div>`;
        priceHTML = `<div class="price-tag staggered-item" style="--item-order: ${langData.items.length + 1};"><span id="price-counter">${currentSelectedAddonPrice > 0 ? currentSelectedAddonPrice.toLocaleString() : "0"}</span> ETB</div>`;
    } else { priceHTML = `<div class="price-tag staggered-item" style="--item-order: ${langData.items.length};"><span id="price-counter">0</span> ETB</div>`; }

    let payBtnHTML = `
        <div class="pay-btn-container staggered-item" style="--item-order: 10;">
            <button id="final-pay-btn" class="glass-btn primary-btn bilingual" data-en="Pay Now" data-am="አሁን ክፈል" onclick="handlePayClick()" ${payBtnDisabled ? 'disabled' : ''}>${currentLang === 'en' ? 'Pay Now' : 'አሁን ክፈል'}</button>
        </div>`;

    detailsContainer.innerHTML = `<h2 class="staggered-item" style="--item-order: -1;">${langData.title}</h2><ul>${listItemsHTML}</ul>${selectorHTML}${priceHTML}${payBtnHTML}`;

    if (currentOpenDetail !== 4 && data.priceValue) {
        const counterElement = document.getElementById('price-counter');
        const endValue = data.priceValue; const isPlus = endValue === 50000;
        let startTimestamp = null; const duration = 1500; 

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4); 
            let current = Math.floor(easeOut * endValue);
            counterElement.innerText = current.toLocaleString() + (isPlus && progress === 1 ? "+" : "");
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
}

exploreBtn.addEventListener('click', goToPackages);
updateLanguage(); 
closeContractSuccessBtn.addEventListener('click', () => contractSuccessModal.classList.add('hidden'));