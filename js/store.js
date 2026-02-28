// store.js - Manages dynamic data overrides via localStorage for the Admin panel

const AdminStore = {
    init() {
        this.loadOverrides();
    },

    loadOverrides() {
        // Load Exam Updates
        const savedUpdates = localStorage.getItem('sg_admin_exam_updates');
        if (savedUpdates && typeof AppData !== 'undefined' && AppData.examUpdates) {
            try {
                const parsed = JSON.parse(savedUpdates);
                // Replace in-memory data with saved data
                AppData.examUpdates = parsed;
            } catch (e) {
                console.error("Failed to load admin exam updates", e);
            }
        }
    },

    saveExamUpdates(updatesArray) {
        localStorage.setItem('sg_admin_exam_updates', JSON.stringify(updatesArray));
        if (typeof AppData !== 'undefined') {
            AppData.examUpdates = updatesArray;
        }

        // Trigger notifications check if applicable
        if (typeof NotificationManager !== 'undefined') {
            NotificationManager.checkForUpdates();
        }
    }
};

// Initialize immediately so data is ready before app components run
AdminStore.init();
