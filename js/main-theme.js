const documentBody = document.body;
const themeButton = document.getElementById("themeSwitch");

const isPreferColorSchemeSupported = (window.matchMedia && window.matchMedia("(prefers-color-scheme)").matches !== "not all");
const LOCAL_STORAGE_THEME_KEY = "theme";
const LIGHT_MODE = "light";
const DARK_MODE = "dark";

/*
NOTE TO SELF ON TESTING:
----------------------------------
1) enable dark mode using button and refresh page to see if it sticks
2) enable light mode using button and refresh page to see if it sticks
3) check if theme is saved between index.html and detail.html pages
4) clear localstorage, refresh page, toggle light/dark mode from system mac/windows should auto change theme

THEME MODE CONTROL BUTTON:
----------------------------------
- Default theme is LIGHT MODE
- Button aria-pressed=true means DARK MODE ON
- Button aria-pressed=false means LIGHT MODE ON
*/



/*******************************************
 * EVENT LISTENERS
 * *****************************************/

// Desc: enable or disable dark theme using custom button
themeButton.addEventListener("click", function() {
    // Pass true as argument to create item in localstorage
    toggleTheme(true);
});

// Add listener to matchMedia only if "prefers-color-schema" media is supoorted
if (isPreferColorSchemeSupported) {
    // Listen to system color mode change
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {

        let latestSavedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

        // Change theme mode only if localStorage preference isn't set
        if (latestSavedTheme === null || latestSavedTheme === '') {

            console.log(`Changed to ${e.matches ? "dark" : "light"} mode`);

            // Make function and pass arg window.matchMedia("(prefers-color-scheme: dark)").matches to changedModeDark
            let currentModeDark = themeButton.getAttribute("aria-pressed") === "true";
            let changedModeDark = e.matches;

            // Change theme mode only if from (dark to light || light to dark)
            if ( (currentModeDark && !changedModeDark) || (!currentModeDark && changedModeDark)) {
                toggleTheme();
            }
            //

        } else {
            console.log("No change because localstorage takes priority");
        }
    });
}


/*******************************************
 * SUPPORTING FUNCTIONS
 * *****************************************/

function toggleTheme(storeThemeInLocalStorage = false) {
    let currentPressedStatus = themeButton.getAttribute("aria-pressed") === "true";
    let newPressedStatus = !currentPressedStatus;

    if (newPressedStatus) {
        documentBody.classList.add(DARK_MODE);
        themeButton.setAttribute("aria-pressed", newPressedStatus);
        themeButton.setAttribute("title", "Switch to Light Mode");
        // themeButton.textContent = "Light Mode";

        if (storeThemeInLocalStorage) {
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, DARK_MODE);
            console.log("Set localstorage to dark");
        }
    } else {
        documentBody.classList.remove(DARK_MODE);
        themeButton.setAttribute("aria-pressed", newPressedStatus);
        themeButton.setAttribute("title", "Switch to Dark Mode");
        // themeButton.textContent = "Dark Mode";

        if (storeThemeInLocalStorage) {
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, LIGHT_MODE);
            console.log("Set localstorage to light");
        }
    }
}

// Desc: Determines theme mode priority from localstorage then to system if localstorage doesn't exist
function setThemeModeOnLoad() {
    // Get saved preferenced from localstorage
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

    if (savedTheme !== null) { // Localstorage theme key exists

        if (savedTheme === DARK_MODE) {
            console.log("Setting dark mode from localstorage");
            toggleTheme();
            return;
        }

        // Default theme is light mode
        console.log("Setting light mode from localstorage");

    } else if (isPreferColorSchemeSupported) { // color scheme media supported

        if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
            console.log("System is black theme");
            toggleTheme();
            return;
        }

        // Default theme is light theme
        console.log("System is white theme");
    }
}


/*******************************************
 * RUN WHEN PAGE IS FULLY LOADED
 * *****************************************/

window.addEventListener('load', (event) => {
    setThemeModeOnLoad();
});