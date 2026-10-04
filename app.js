/**
 * UNDANGAN PERNIKAHAN DIGITAL — FEBRIAN & NADYA
 * Core Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GUEST NAME PARSER FROM URL PARAMETER ---
    parseGuestName();

    // --- 2. COVER OVERLAY REVEAL ---
    initCoverOverlay();

    // --- 3. COUNTDOWN TIMER ---
    initCountdown();

    // --- 4. GOOGLE CALENDAR LINK ---
    initCalendarLink();

    // --- 5. SCROLL REVEAL ANIMATIONS ---
    initScrollReveal();

    // --- 6. GALLERY LIGHTBOX MODAL ---
    initGalleryLightbox();

    // --- 7. COPY TO CLIPBOARD ---
    initCopyAccount();

    // --- 8. RSVP & GUESTBOOK (LOCALSTORAGE) ---
    initGuestbook();
});

/* -------------------------------------------------------------------------- */
/* 1. GUEST NAME PARSER                                                       */
/* -------------------------------------------------------------------------- */
function parseGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || urlParams.get('n') || urlParams.get('nama');
    const guestDisplay = document.getElementById('guestNameDisplay');

    if (guestDisplay) {
        if (guestName && guestName.trim() !== '') {
            guestDisplay.textContent = decodeURIComponent(guestName).trim();
        } else {
            guestDisplay.textContent = 'Tamu Undangan';
        }
    }
}

/* -------------------------------------------------------------------------- */
/* 2. COVER OVERLAY REVEAL                                                    */
/* -------------------------------------------------------------------------- */
function initCoverOverlay() {
    const openBtn = document.getElementById('openInvitationBtn');
    const coverOverlay = document.getElementById('coverOverlay');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const audioControlBtn = document.getElementById('audioControlBtn');

    if (openBtn && coverOverlay && mainContent) {
        openBtn.addEventListener('click', () => {
            // Hide overlay with fade effect
            coverOverlay.classList.add('fade-out');
            
            // Show main content & enable scrolling
            mainContent.classList.remove('hidden');
            document.body.classList.remove('no-scroll');

            // Play background music automatically upon clicking Buka Undangan
            if (bgMusic) {
                bgMusic.play().then(() => {
                    if (audioControlBtn) audioControlBtn.classList.add('playing');
                }).catch(err => {
                    console.log('Audio play info:', err);
                });
            }

            // Trigger initial scroll reveal check
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 300);
        });
    }

    // Toggle Play / Pause Background Music
    if (audioControlBtn && bgMusic) {
        audioControlBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    audioControlBtn.classList.add('playing');
                    showToast('Musik diputar');
                });
            } else {
                bgMusic.pause();
                audioControlBtn.classList.remove('playing');
                showToast('Musik dihentikan');
            }
        });
    }
}

/* -------------------------------------------------------------------------- */
/* 3. COUNTDOWN TIMER                                                         */
/* -------------------------------------------------------------------------- */
function initCountdown() {
    // Target Date: Saturday, 12 December 2026 14:00:00 WIB (GMT+7)
    const targetDate = new Date('2026-12-12T14:00:00+07:00').getTime();

    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMinutes = document.getElementById('cdMinutes');
    const cdSeconds = document.getElementById('cdSeconds');

    if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            cdDays.textContent = '00';
            cdHours.textContent = '00';
            cdMinutes.textContent = '00';
            cdSeconds.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        cdDays.textContent = String(days).padStart(2, '0');
        cdHours.textContent = String(hours).padStart(2, '0');
        cdMinutes.textContent = String(minutes).padStart(2, '0');
        cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* -------------------------------------------------------------------------- */
/* 4. GOOGLE CALENDAR LINK                                                    */
/* -------------------------------------------------------------------------- */
function initCalendarLink() {
    const calendarLink = document.getElementById('calendarLink');
    if (!calendarLink) return;

    const title = encodeURIComponent('Pernikahan Febrian & Nadya');
    const details = encodeURIComponent('Acara Resepsi Pernikahan Febrian Indra Suprayogi & Nadya Andreyanto Putri');
    const location = encodeURIComponent('Jl. Demak Jaya III No 65, Surabaya');
    // Start: 2026-12-12 14:00 WIB (07:00 UTC) -> End: 2026-12-12 17:00 WIB (10:00 UTC)
    const dates = '20261212T070000Z/20261212T100000Z';

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    calendarLink.href = gcalUrl;
}

/* -------------------------------------------------------------------------- */
/* 5. SCROLL REVEAL ANIMATIONS                                                */
/* -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }
}

/* -------------------------------------------------------------------------- */
/* 6. GALLERY LIGHTBOX MODAL                                                  */
/* -------------------------------------------------------------------------- */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightbox || !lightboxImg || galleryItems.length === 0) return;

    const imageSources = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return img ? img.getAttribute('src') : '';
    });

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = imageSources[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        // Restore scroll if cover is already opened
        if (!document.getElementById('coverOverlay').classList.contains('fade-out')) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.style.overflow = '';
        }
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        lightboxImg.src = imageSources[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imageSources.length;
        lightboxImg.src = imageSources[currentIndex];
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxImg) {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

/* -------------------------------------------------------------------------- */
/* 7. COPY TO CLIPBOARD                                                       */
/* -------------------------------------------------------------------------- */
function initCopyAccount() {
    const copyBtns = document.querySelectorAll('.btn-copy');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const accountNumber = btn.getAttribute('data-account');
            const bankName = btn.getAttribute('data-bank') || 'Rekening';

            if (!accountNumber) return;

            navigator.clipboard.writeText(accountNumber).then(() => {
                showToast(`Nomor rekening ${bankName} (${accountNumber}) berhasil disalin!`);
            }).catch(() => {
                // Fallback for older devices/browsers
                const textarea = document.createElement('textarea');
                textarea.value = accountNumber;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast(`Nomor rekening ${bankName} (${accountNumber}) berhasil disalin!`);
            });
        });
    });
}

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

/* -------------------------------------------------------------------------- */
/* 8. RSVP & GUESTBOOK (LOCALSTORAGE)                                         */
/* -------------------------------------------------------------------------- */
const STORAGE_KEY = 'wedding_wishes_febrian_nadya_v2';

function initGuestbook() {
    const rsvpForm = document.getElementById('rsvpForm');
    const wishesList = document.getElementById('wishesList');
    const wishesCount = document.getElementById('wishesCount');

    if (!rsvpForm || !wishesList) return;

    // Load existing wishes from localStorage
    renderWishes();

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('rsvpName');
        const guestsInput = document.getElementById('rsvpGuests');
        const statusInput = document.getElementById('rsvpStatus');
        const messageInput = document.getElementById('rsvpMessage');

        if (!nameInput.value.trim() || !messageInput.value.trim()) {
            showToast('Mohon isi nama dan ucapan Anda.');
            return;
        }

        const newWish = {
            id: Date.now(),
            name: nameInput.value.trim(),
            guests: guestsInput ? guestsInput.value : '1 Orang',
            status: statusInput ? statusInput.value : 'Hadir',
            message: messageInput.value.trim(),
            timestamp: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        };

        const existingWishes = getSavedWishes();
        existingWishes.unshift(newWish);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingWishes));
        } catch (err) {
            console.error('LocalStorage save error:', err);
        }

        // Reset form inputs
        messageInput.value = '';

        // Re-render guestbook list
        renderWishes();

        showToast('Terima kasih! Ucapan & konfirmasi kehadiran Anda telah terkirim.');
    });

    // Delete wish listener
    wishesList.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete-wish');
        if (deleteBtn) {
            const wishId = deleteBtn.getAttribute('data-id');
            if (confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) {
                deleteWish(wishId);
            }
        }
    });
}

function deleteWish(id) {
    let wishes = getSavedWishes();
    wishes = wishes.filter(w => String(w.id) !== String(id));
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (err) {
        console.error('LocalStorage save error:', err);
    }
    renderWishes();
    showToast('Ucapan berhasil dihapus.');
}

// Global helper to clear all wishes if needed
window.deleteWish = deleteWish;
window.clearAllWishes = function() {
    localStorage.removeItem(STORAGE_KEY);
    renderWishes();
    showToast('Semua ucapan berhasil dibersihkan.');
};

function getSavedWishes() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (err) {
        return [];
    }
}

function renderWishes() {
    const wishesList = document.getElementById('wishesList');
    const wishesCount = document.getElementById('wishesCount');

    if (!wishesList) return;

    const wishes = getSavedWishes();

    if (wishesCount) {
        wishesCount.textContent = wishes.length;
    }

    if (wishes.length === 0) {
        wishesList.innerHTML = '<p class="wishes-empty">Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</p>';
        return;
    }

    wishesList.innerHTML = wishes.map(wish => {
        let badgeClass = 'badge-hadir';
        if (wish.status === 'Masih Ragu') badgeClass = 'badge-ragu';
        if (wish.status === 'Tidak Hadir') badgeClass = 'badge-tidak';

        return `
            <div class="wish-item">
                <div class="wish-header">
                    <span class="wish-name">${escapeHtml(wish.name)}</span>
                    <div class="wish-header-right">
                        <span class="badge-status ${badgeClass}">${escapeHtml(wish.status)}</span>
                        <button class="btn-delete-wish" data-id="${wish.id}" title="Hapus ucapan">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <p class="wish-text">${escapeHtml(wish.message)}</p>
                <span class="wish-time"><i class="fa-regular fa-clock"></i> ${escapeHtml(wish.timestamp)}</span>
            </div>
        `;
    }).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
