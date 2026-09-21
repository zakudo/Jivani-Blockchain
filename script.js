// ==========================================
// MEDCHAIN CORE LOGIC & DATA PERSISTENCE
// ==========================================

// Default initial dataset
const DEFAULT_MEDICINES = {
    "PCM500-001": {
        name: "Paracetamol 500mg",
        batch: "PCM500-001",
        manufacturer: "MedPharma Laboratories",
        manufactured: "10 September 2026",
        expiry: "09 September 2028",
        txHash: "0x8f2a9b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"
    },
    "AMX250-002": {
        name: "Amoxicillin 250mg",
        batch: "AMX250-002",
        manufacturer: "HealthCare Pharma",
        manufactured: "12 September 2026",
        expiry: "11 September 2028",
        txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
    },
    "AZT500-003": {
        name: "Azithromycin 500mg",
        batch: "AZT500-003",
        manufacturer: "LifeMed Pharmaceuticals",
        manufactured: "14 September 2026",
        expiry: "13 September 2028",
        txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d"
    }
};

// Dummy Manufacturer Credentials
const AUTH_CREDENTIALS = {
    "admin": "admin123",
    "pharma_med": "med2026"
};

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const errorMsg = document.getElementById("loginError");

    if (AUTH_CREDENTIALS[user] && AUTH_CREDENTIALS[user] === pass) {
        localStorage.setItem("medchain_auth", JSON.stringify({
            user: user,
            loggedInAt: new Date().getTime()
        }));
        window.location.href = "manufacturer.html";
    } else {
        if (errorMsg) errorMsg.style.display = "block";
    }
}

function checkManufacturerAuth() {
    if (window.location.pathname.includes("manufacturer.html")) {
        const authData = localStorage.getItem("medchain_auth");
        if (!authData) {
            window.location.href = "login.html";
        }
    }
}

function logoutManufacturer() {
    localStorage.removeItem("medchain_auth");
    window.location.href = "login.html";
}

function getDatabase() {
    const stored = localStorage.getItem("medchain_db");
    if (!stored) {
        localStorage.setItem("medchain_db", JSON.stringify(DEFAULT_MEDICINES));
        return DEFAULT_MEDICINES;
    }
    return JSON.parse(stored);
}

function saveDatabase(data) {
    localStorage.setItem("medchain_db", JSON.stringify(data));
}

function generateMockTxHash() {
    let hash = "0x";
    const chars = "0123456789abcdef";
    for (let i = 0; i < 40; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// ==========================================
// MODAL & TIMELINE VERIFICATION LOGIC
// ==========================================
function verifyBatch(batchId) {
    if (!batchId) return;
    batchId = batchId.trim().toUpperCase();

    const medicines = getDatabase();
    const medicine = medicines[batchId];

    const modal = document.getElementById("resultModal");
    const content = document.getElementById("modalContent");

    if (!modal || !content) return;

    if (medicine) {
        content.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; background: #eef7f0; color: #27704a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 15px;">✓</div>
                <span style="background: rgba(39, 112, 74, 0.1); color: #27704a; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 800;">VERIFIED AUTHENTIC</span>
                <h2 style="margin-top: 10px; color: #12281e; font-size: 22px;">${medicine.name}</h2>
                <p style="font-size: 13px; color: #718077; margin-top: 2px;">Batch ID: <strong>${medicine.batch}</strong></p>
            </div>

            <div class="timeline">
                <div class="timeline-item">
                    <h4>Manufacturer Registration</h4>
                    <p>Recorded by <strong>${medicine.manufacturer}</strong> on ${medicine.manufactured}</p>
                </div>
                <div class="timeline-item">
                    <h4>Quality Check & Certificate</h4>
                    <p>Tamper-evident batch record updated on-chain</p>
                </div>
                <div class="timeline-item">
                    <h4>Tx Hash Verification</h4>
                    <p style="font-family: monospace; font-size: 11px; word-break: break-all; color: #234d3b;">${medicine.txHash || generateMockTxHash()}</p>
                </div>
                <div class="timeline-item">
                    <h4>Expiry & Status</h4>
                    <p>Valid till: <strong>${medicine.expiry}</strong></p>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; background: #fcebeb; color: #dc3545; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 15px;">✕</div>
                <span style="background: rgba(220, 53, 69, 0.1); color: #dc3545; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 800;">WARNING: UNVERIFIED</span>
                <h2 style="margin-top: 10px; color: #12281e; font-size: 22px;">Counterfeit Alert</h2>
                <p style="font-size: 13px; color: #718077; margin-top: 8px;">No immutable ledger record found for Batch ID: <strong>${batchId}</strong>.</p>
                <p style="font-size: 12px; color: #dc3545; margin-top: 10px; font-weight: 600;">⚠️ Do not consume this medicine package.</p>
            </div>
        `;
    }

    modal.classList.add("active");
}

function manualVerify() {
    const input = document.getElementById("batchInput");
    if (!input) return;

    const batchId = input.value;
    if (batchId.trim() === "") {
        alert("Please enter a Batch ID.");
        return;
    }
    verifyBatch(batchId);
}

function closeModal() {
    const modal = document.getElementById("resultModal");
    if (modal) modal.classList.remove("active");
}

// ==========================================
// QR SCANNER LOGIC
// ==========================================
function startScanner() {
    const readerElement = document.getElementById("reader");
    if (!readerElement || typeof Html5Qrcode === "undefined") return;

    const scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
            scanner.stop().then(() => {
                let batchId = decodedText;
                try {
                    const url = new URL(decodedText);
                    const batch = url.searchParams.get("batch");
                    if (batch) batchId = batch;
                } catch (error) {}
                verifyBatch(batchId);
            });
        },
        (errorMessage) => {}
    ).catch((error) => {
        const status = document.getElementById("scannerStatus");
        if (status) status.innerHTML = "Camera permission required or not supported.";
    });
}

// ==========================================
// MANUFACTURER REGISTRATION LOGIC
// ==========================================
function registerMedicine() {
    const name = document.getElementById("medicineNameInput").value.trim();
    const batch = document.getElementById("batchIdInput").value.trim().toUpperCase();
    const manufacturer = document.getElementById("manufacturerInput").value.trim();
    const manufacturingDate = document.getElementById("manufacturingInput").value;
    const expiryDate = document.getElementById("expiryInput").value;

    if (!name || !batch || !manufacturer || !manufacturingDate || !expiryDate) {
        alert("Please fill in all medicine details.");
        return;
    }

    const medicines = getDatabase();

    medicines[batch] = {
        name: name,
        batch: batch,
        manufacturer: manufacturer,
        manufactured: formatDate(manufacturingDate),
        expiry: formatDate(expiryDate),
        txHash: generateMockTxHash()
    };

    saveDatabase(medicines);

    const qrContainer = document.getElementById("qrcode");
    if (qrContainer) {
        qrContainer.innerHTML = "";
        const verificationURL = window.location.origin + window.location.pathname.replace("manufacturer.html", "index.html") + "?batch=" + encodeURIComponent(batch);

        if (typeof QRCode !== "undefined") {
            new QRCode(qrContainer, {
                text: verificationURL,
                width: 220,
                height: 220
            });
        }
    }

    const placeholder = document.getElementById("qrPlaceholder");
    if (placeholder) placeholder.style.display = "none";

    const resultCard = document.getElementById("qrResult");
    if (resultCard) resultCard.style.display = "block";

    if (document.getElementById("qrMedicineName")) document.getElementById("qrMedicineName").innerHTML = name;
    if (document.getElementById("qrBatchId")) document.getElementById("qrBatchId").innerHTML = batch;

    const regStatus = document.getElementById("registrationStatus");
    if (regStatus) {
        regStatus.innerHTML = "✓ Medicine registered on-chain successfully. QR Code active for batch <strong>" + batch + "</strong>.";
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function downloadQR() {
    const canvas = document.querySelector("#qrcode canvas");
    if (!canvas) {
        alert("Please generate a QR code first.");
        return;
    }

    const link = document.createElement("a");
    link.download = "MedChain-Batch-QR.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// ==========================================
// STATS COUNTER ANIMATION ENGINE
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        if (target === 0) return;
        let count = 0;
        const speed = target / 50;
        const updateCount = () => {
            count += speed;
            if (count < target) {
                counter.innerText = Math.ceil(count).toLocaleString();
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });
}

// Check URL Params on Landing Page for Instant Verification
function checkUrlVerification() {
    const params = new URLSearchParams(window.location.search);
    const batchId = params.get("batch");
    if (batchId) {
        verifyBatch(batchId);
    }
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", function () {
    checkManufacturerAuth();
    getDatabase();
    startScanner();
    animateCounters();
    checkUrlVerification();
});

// ==========================================
// DYNAMIC COMBINED MEDICINE CURSOR ENGINE
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const outline = document.createElement("div");
    outline.classList.add("custom-cursor-outline");
    document.body.appendChild(outline);

    const cursorContainer = document.createElement("div");
    cursorContainer.classList.add("medicine-cursor-wrapper");
    cursorContainer.innerHTML = `
        <svg class="medicine-cursor-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-45 16 16)">
                <path d="M11 6C11 3.23858 13.2386 1 16 1C18.7614 1 21 3.23858 21 6V15H11V6Z" fill="#234d3b"/>
                <path d="M11 17H21V26C21 28.7614 18.7614 31 16 31C13.2386 31 11 28.7614 11 26V17Z" fill="#a3d9bc"/>
                <rect x="13" y="4" width="2" height="22" rx="1" fill="white" fill-opacity="0.4"/>
            </g>
        </svg>
    `;
    document.body.appendChild(cursorContainer);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorContainer.style.left = `${mouseX}px`;
        cursorContainer.style.top = `${mouseY}px`;
    });

    function animateOuterRing() {
        outlineX += (mouseX - outlineX) * 0.18;
        outlineY += (mouseY - outlineY) * 0.18;

        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateOuterRing);
    }
    animateOuterRing();

    const interactiveTargets = "a, button, input, .step-card, .verified-box, .logo, .primary-button, .stat-card";

    document.addEventListener("mouseover", function (e) {
        if (e.target.closest(interactiveTargets)) {
            document.body.classList.add("cursor-hover");
        }
    });

    document.addEventListener("mouseout", function (e) {
        if (e.target.closest(interactiveTargets)) {
            document.body.classList.remove("cursor-hover");
        }
    });
});