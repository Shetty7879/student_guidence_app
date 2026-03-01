// notifications.js - Manages in-app notifications

const NotificationManager = {
    notificationsEnabled: true,
    notifications: [],

    save() {
        localStorage.setItem('sg_notifications', JSON.stringify(this.notifications));
    },

    init() {
        // Load preferences
        const prefs = localStorage.getItem('sg_notif_prefs');
        if (prefs !== null) {
            this.notificationsEnabled = JSON.parse(prefs);
        }

        // Load saved notifications state
        const saved = localStorage.getItem('sg_notifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
        }

        this.checkForUpdates();
        this.renderBadge();
        this.renderDropdown();
        this.attachListeners();
        this.updateToggleButtonText();
    },

    attachListeners() {
        const notifBtn = document.getElementById('notification-btn');
        const notifDropdown = document.getElementById('notification-dropdown');
        const markReadBtn = document.getElementById('notification-mark-read');
        const toggleBtn = document.getElementById('menu-notifications-toggle');

        if (notifBtn) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close profile dropdown if open
                document.getElementById('profile-dropdown')?.classList.add('hidden');
                notifDropdown.classList.toggle('hidden');
            });
        }

        if (markReadBtn) {
            markReadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markAllAsRead();
            });
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleNotifications();
            });
        }

        // We also need to hide the dropdown when clicking outside. 
        // This is handled in initApp in app.js.
    },

    checkForUpdates() {
        if (!this.notificationsEnabled) return;

        // Check central data for updates
        if (typeof AppData !== 'undefined' && AppData.examUpdates) {
            AppData.examUpdates.forEach(update => {
                // Determine if user should see this based on selected stream
                if (AppState.selectedLevel && !AppState.selectedLevel.startsWith('puc_science')) {
                    // Since both KCET and NEET are primarily for science students in this context, skip for commerce/arts
                    return;
                }

                // Create a unique ID for this specific update timestamp
                const notifId = `update_${update.id}_${update.lastUpdated.replace(/\s+/g, '')}`;

                const exists = this.notifications.find(n => n.id === notifId);
                if (!exists) {
                    this.notifications.unshift({
                        id: notifId,
                        examId: update.id,
                        title: {
                            en: `Update for ${update.name}`,
                            hi: `${update.name} के लिए अपडेट`,
                            kn: `${update.name} ಗಾಗಿ ನವೀಕರಣ`
                        },
                        message: {
                            en: `Important dates have been updated. Exam Date: ${update.examDate}`,
                            hi: `महत्वपूर्ण तिथियां अपडेट कर दी गई हैं: ${update.examDate}`,
                            kn: `ಪ್ರಮುಖ ದಿನಾಂಕಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ: ${update.examDate}`
                        },
                        date: new Date().toISOString(),
                        read: false
                    });
                }
            });
        }

        this.save();
    },

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.save();
        this.renderBadge();
        this.renderDropdown();
    },

    toggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled;
        localStorage.setItem('sg_notif_prefs', JSON.stringify(this.notificationsEnabled));
        this.updateToggleButtonText();

        if (this.notificationsEnabled) {
            this.checkForUpdates();
        } else {
            // Clear notifications when disabled
            this.notifications = [];
            this.save();
        }

        this.renderBadge();
        this.renderDropdown();

        document.getElementById('profile-dropdown')?.classList.add('hidden');
    },

    updateToggleButtonText() {
        const textSpan = document.getElementById('text-notif-toggle');
        if (!textSpan) return;

        if (this.notificationsEnabled) {
            textSpan.setAttribute('data-i18n', 'prof_item_notifications_disable');
            const lang = AppState.language || 'en';
            if (typeof Translations !== 'undefined' && Translations[lang] && Translations[lang]['prof_item_notifications_disable']) {
                textSpan.innerText = Translations[lang]['prof_item_notifications_disable'];
            } else {
                textSpan.innerText = 'Disable Notifications';
            }
        } else {
            textSpan.setAttribute('data-i18n', 'prof_item_notifications_enable');
            const lang = AppState.language || 'en';
            if (typeof Translations !== 'undefined' && Translations[lang] && Translations[lang]['prof_item_notifications_enable']) {
                textSpan.innerText = Translations[lang]['prof_item_notifications_enable'];
            } else {
                textSpan.innerText = 'Enable Notifications';
            }
        }
    },

    renderBadge() {
        const badge = document.getElementById('notification-badge');
        if (!badge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (unreadCount > 0 && this.notificationsEnabled) {
            badge.innerText = unreadCount > 9 ? '9+' : unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },

    renderDropdown() {
        const list = document.getElementById('notification-list');
        if (!list) return;

        const lang = AppState.language || 'en';

        if (this.notifications.length === 0 || !this.notificationsEnabled) {
            const noNotifText = (typeof Translations !== 'undefined' && Translations[lang]?.no_notifications) || 'No new notifications';
            list.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;" data-i18n="no_notifications">${noNotifText}</div>`;
            return;
        }

        let html = '';
        this.notifications.forEach(notif => {
            const bg = notif.read ? 'var(--bg-primary)' : 'rgba(79, 70, 229, 0.05)';
            const border = notif.read ? 'transparent' : 'var(--primary-color)';

            const d = new Date(notif.date);
            const dateStr = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-US', { month: 'short', day: 'numeric' });

            html += `
                <div class="notification-item" style="padding: 1rem; border-bottom: 1px solid var(--border-color); background: ${bg}; border-left: 3px solid ${border}; cursor: pointer; transition: all 0.2s;" onclick="NotificationManager.handleNotificationClick('${notif.id}')">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
                        <h5 style="margin: 0; font-size: 0.875rem; color: var(--text-main); font-weight: 600;">${notif.title[lang] || notif.title.en}</h5>
                        <span style="font-size: 0.7rem; color: var(--text-muted);">${dateStr}</span>
                    </div>
                    <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted);">${notif.message[lang] || notif.message.en}</p>
                </div>
            `;
        });

        list.innerHTML = html;
        if (typeof updateTranslations === 'function') {
            updateTranslations();
        }
    },

    handleNotificationClick(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.save();
            this.renderBadge();
            this.renderDropdown();

            document.getElementById('notification-dropdown')?.classList.add('hidden');

            if (typeof renderScreen === 'function') {
                renderScreen('exam_updates');
            }
        }
    }
};
