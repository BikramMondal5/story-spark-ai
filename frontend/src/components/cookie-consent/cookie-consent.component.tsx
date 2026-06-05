import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/theme.context";

const COOKIE_CONSENT_KEY = "storysparkai_cookie_consent";

type CookiePreferences = {
  saved: boolean;
  functional: boolean;
  analytics: boolean;
};

const DEFAULT_PREFERENCES: CookiePreferences = {
  saved: false,
  functional: false,
  analytics: false,
};

const loadCookiePreferences = (): CookiePreferences => {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const updateAppCookieState = (preferences: CookiePreferences) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("cookieConsentChange", { detail: preferences }));
};

const saveCookiePreferences = (preferences: CookiePreferences) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
  updateAppCookieState(preferences);
};

const CookieConsentBanner: FC = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const storedPreferences = loadCookiePreferences();
    setPreferences(storedPreferences);
    setShowBanner(!storedPreferences.saved);
  }, []);

  if (!preferences || !showBanner) {
    return null;
  }

  const handleSave = () => {
    const updated = { ...preferences, saved: true };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  const handleAcceptAll = () => {
    const updated = { saved: true, functional: true, analytics: true };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  const handleRejectNonEssential = () => {
    const updated = { saved: true, functional: false, analytics: false };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  const bannerClasses = isDark
    ? "fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-200/10 dark:border-white/10 py-6 shadow-2xl backdrop-blur-xl text-white transition-colors duration-300 max-h-[85vh] overflow-y-auto sidebar"
    : "fixed inset-x-0 bottom-0 z-50 bg-white/95 border-t border-slate-200 py-6 shadow-2xl backdrop-blur-xl text-slate-900 transition-colors duration-300 max-h-[85vh] overflow-y-auto sidebar";

  const panelClasses = isDark
    ? "rounded-2xl border border-slate-200/10 dark:border-white/5 bg-slate-900/40 p-4 sm:p-5"
    : "rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5";

  const cardClasses = isDark
    ? "rounded-xl border border-slate-200/10 dark:border-white/5 bg-slate-950/60 p-4 flex flex-col justify-between gap-4"
    : "rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-4";

  const primaryText = isDark ? "text-white" : "text-slate-900";
  const secondaryText = isDark ? "text-slate-300" : "text-slate-600";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const subtleLabel = isDark
    ? "font-semibold uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 group-hover:text-white transition-colors"
    : "font-semibold uppercase tracking-wider text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 group-hover:text-slate-900 transition-colors";
  const checkboxClasses = isDark
    ? "h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/30 transition-colors cursor-pointer"
    : "h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500/30 transition-colors cursor-pointer";
  const actionButtonClasses = isDark
    ? "w-full rounded-xl border border-slate-200/10 dark:border-white/10 bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-all duration-150 hover:bg-slate-800 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
    : "w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-900 transition-all duration-150 hover:bg-slate-100 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider";

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-[85vh] overflow-y-auto w-[calc(100vw-32px)] sm:w-[400px] bg-slate-950/98 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl text-white scrollbar-thin flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Cookie Preferences</p>
          <button 
            onClick={handleRejectNonEssential}
            className="text-slate-400 hover:text-white transition-colors duration-250"
            aria-label="Close cookie settings"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-white leading-tight">We value your privacy</h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          StorySpark AI uses cookies to keep your experience secure and personalized.
          <Link to="/cookie-policy" className="ml-1 text-blue-400 underline hover:text-blue-300">Learn more</Link>.
        </p>
      </div>

      {showCustomize && (
        <div className="space-y-3 border-t border-slate-900 pt-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs md:text-sm text-white">Essential Cookies</p>
                <p className="text-[10px] md:text-xs text-slate-400 leading-normal">Required for secure login and basic features.</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-400 shrink-0">Required</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs md:text-sm text-white">Functional Cookies</p>
                <p className="text-[10px] md:text-xs text-slate-400 leading-normal">Save preferences & smooth out navigations.</p>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(event) => setPreferences({ ...preferences, functional: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <span>{preferences.functional ? "On" : "Off"}</span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs md:text-sm text-white">Analytics Cookies</p>
                <p className="text-[10px] md:text-xs text-slate-400 leading-normal">Analyze usage stats to help us improve the app.</p>
    <div className={bannerClasses}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between xl:gap-8">
        <div className="max-w-3xl space-y-4">
          <div className="space-y-1.5">
            <p className={`text-xs font-bold uppercase tracking-[0.24em] ${mutedText}`}>Cookie Preferences</p>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${primaryText}`}>Manage your cookie settings</h2>
          </div>
          
          <p className={`text-sm sm:text-base leading-relaxed ${secondaryText}`}>
            StorySpark AI uses cookies to keep the experience secure and smooth. Select which cookie categories you want to allow, or accept all for the best experience.
            <Link to="/cookie-policy" className="ml-1.5 text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Learn more</Link>.
          </p>

          <div className={panelClasses}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={cardClasses}>
                <div className="space-y-1">
                  <p className={`font-bold text-sm ${primaryText}`}>Essential Cookies</p>
                  <p className={`text-xs leading-normal ${mutedText}`}>Always active for secure login and basic app functionality.</p>
                </div>
                <div className="flex justify-start">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">Required</span>
                </div>
              </div>

              <div className={cardClasses}>
                <div className="space-y-1">
                  <p className={`font-bold text-sm ${primaryText}`}>Functional Cookies</p>
                  <p className={`text-xs leading-normal ${mutedText}`}>Enable saved preferences and smoother navigation features.</p>
                </div>
                <div className="flex justify-start">
                  <label className={`inline-flex items-center gap-2.5 text-xs cursor-pointer select-none group ${secondaryText}`}>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(event) => setPreferences({ ...preferences, functional: event.target.checked })}
                      className={checkboxClasses}
                    />
                    <span className={subtleLabel}>
                      {preferences.functional ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>

              <div className={`${cardClasses} sm:col-span-2 flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
                <div className="space-y-1 max-w-xl">
                  <p className={`font-bold text-sm ${primaryText}`}>Analytics Cookies</p>
                  <p className={`text-xs leading-normal ${mutedText}`}>Help us understand interface engagement data to continuously refine the StorySpark AI ecosystem module suite paths.</p>
                </div>
                <div className="flex justify-start shrink-0">
                  <label className={`inline-flex items-center gap-2.5 text-xs cursor-pointer select-none group ${secondaryText}`}>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(event) => setPreferences({ ...preferences, analytics: event.target.checked })}
                      className={checkboxClasses}
                    />
                    <span className={subtleLabel}>
                      {preferences.analytics ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(event) => setPreferences({ ...preferences, analytics: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <span>{preferences.analytics ? "On" : "Off"}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-slate-900 pt-3">
        <button
          onClick={handleAcceptAll}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 py-2.5 text-xs md:text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition hover:from-blue-400 hover:to-indigo-400"
        >
          Accept all cookies
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 py-2 text-[11px] md:text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"

        <div className="flex flex-col gap-2.5 xl:w-[280px] shrink-0 xl:pt-11 w-full">
          <button
            onClick={handleAcceptAll}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/10 transition-all duration-150 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
          >
            Accept all cookies
          </button>
          <button
            onClick={handleSave}
            className={actionButtonClasses}
          >
            Save preferences
          </button>
          <button
            onClick={handleRejectNonEssential}
            className={isDark ? "w-full rounded-xl border border-slate-200/10 dark:border-white/10 bg-slate-950 px-5 py-3 text-xs font-bold text-slate-400 transition-all duration-150 hover:text-white hover:bg-slate-900 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider" : "w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 transition-all duration-150 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"}
          >
            {showCustomize ? "Hide options" : "Customize"}
          </button>
          
          {showCustomize ? (
            <button
              onClick={handleSave}
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-800/80 py-2 text-[11px] md:text-xs font-semibold text-white transition hover:border-slate-600"
            >
              Save settings
            </button>
          ) : (
            <button
              onClick={handleRejectNonEssential}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 py-2 text-[11px] md:text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
            >
              Reject optional
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
