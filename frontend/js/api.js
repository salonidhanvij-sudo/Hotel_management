/* =========================================
   GRANDVISTA API CLIENT
   Fail-safe: if the backend is down, slow or
   errors, every call resolves to null and the
   website keeps working exactly as before
   (localStorage flow is untouched).
========================================= */

(function () {

    const API_BASE = window.GV_API_BASE || "http://127.0.0.1:8000";
    const TIMEOUT_MS = 4000;

    async function request(path, options) {

        const controller = new AbortController();
        const timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

        try {

            const response = await fetch(API_BASE + path, Object.assign({
                headers: { "Content-Type": "application/json" },
                signal: controller.signal
            }, options || {}));

            if (!response.ok) {
                throw new Error("API " + response.status);
            }

            return await response.json();

        } catch (error) {

            console.warn("[GrandVista API]", path, error.message);
            return null;

        } finally {

            clearTimeout(timer);
        }
    }

    window.GVApi = {

        health: function () {
            return request("/health");
        },

        dashboard: function () {
            return request("/analytics/dashboard");
        },

        createBooking: function (booking) {
            return request("/bookings", {
                method: "POST",
                body: JSON.stringify(booking)
            });
        }
    };

})();