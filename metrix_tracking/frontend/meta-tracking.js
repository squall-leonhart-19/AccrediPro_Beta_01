/**
 * ============================================
 * META TRACKING - VANILLA JS VERSION
 * ============================================
 * Add this script to your landing pages:
 * <script src="meta-tracking.js"></script>
 * 
 * Features:
 * - Captures fbclid from URL
 * - Stores fbclid in first-party cookie (90 days)
 * - Reads _fbc and _fbp from Meta Pixel
 * - Falls back gracefully when blocked
 * ============================================
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'meta_tracking';
    var FBCLID_COOKIE_NAME = '_fbclid_fp'; // First-party fbclid cookie
    var COOKIE_DAYS = 90; // How long to keep the cookie

    /**
     * Get a cookie value by name
     */
    function getCookie(name) {
        var match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return match ? match.pop() : null;
    }

    /**
     * Set a first-party cookie
     */
    function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        // SameSite=Lax for cross-site compatibility, Secure if on HTTPS
        var secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax' + secure;
    }

    /**
     * Get URL parameter by name
     */
    function getUrlParam(name) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Store data in localStorage
     */
    function storeData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[MetaTracking] Could not store data:', e);
        }
    }

    /**
     * Get stored data from localStorage
     */
    function getStoredData() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.warn('[MetaTracking] Could not read stored data:', e);
            return {};
        }
    }

    /**
     * Initialize tracking - captures fbclid and cookies
     * Stores fbclid in first-party cookie as fallback
     */
    function init() {
        var fbclid = getUrlParam('fbclid');
        var fbc = getCookie('_fbc');
        var fbp = getCookie('_fbp');
        var storedFbclid = getCookie(FBCLID_COOKIE_NAME); // Check first-party cookie

        // If we got fbclid from URL, store it in first-party cookie (survives blockers)
        if (fbclid) {
            setCookie(FBCLID_COOKIE_NAME, fbclid, COOKIE_DAYS);
            console.log('[MetaTracking] Stored fbclid in first-party cookie');
        }

        // Use URL fbclid, or fall back to cookie
        var finalFbclid = fbclid || storedFbclid;

        var existing = getStoredData();
        var merged = {
            fbclid: finalFbclid || existing.fbclid,
            fbc: fbc || existing.fbc,
            fbp: fbp || existing.fbp,
            captured_at: new Date().toISOString()
        };

        storeData(merged);
        console.log('[MetaTracking] Initialized:', merged);
    }

    /**
     * Get all tracking data for API calls
     * Checks multiple sources for fbclid (URL param, first-party cookie, localStorage)
     */
    function getTrackingData() {
        var stored = getStoredData();
        var fbc = getCookie('_fbc');
        var fbp = getCookie('_fbp');
        var cookieFbclid = getCookie(FBCLID_COOKIE_NAME); // First-party cookie fallback

        return {
            fbclid: stored.fbclid || cookieFbclid || null,
            fbc: fbc || stored.fbc || null,
            fbp: fbp || stored.fbp || null,
            event_source_url: window.location.href,
            user_agent: navigator.userAgent
        };
    }

    /**
     * Inject hidden fields into a form
     */
    function injectIntoForm(formSelector) {
        var form = document.querySelector(formSelector);
        if (!form) {
            console.warn('[MetaTracking] Form not found:', formSelector);
            return;
        }

        var data = getTrackingData();
        var fields = ['fbclid', 'fbc', 'fbp', 'event_source_url', 'user_agent'];

        fields.forEach(function (name) {
            if (!data[name]) return;

            // Remove existing field if present
            var existing = form.querySelector('input[name="' + name + '"]');
            if (existing) existing.remove();

            // Add hidden field
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = data[name];
            form.appendChild(input);
        });

        console.log('[MetaTracking] Injected fields into form');
    }

    // Expose to global scope
    window.MetaTracking = {
        init: init,
        getTrackingData: getTrackingData,
        getStoredData: getStoredData,
        injectIntoForm: injectIntoForm
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
