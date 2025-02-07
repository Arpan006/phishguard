const apiKey = 'your api key'; // Replace with your API key

chrome.runtime.onInstalled.addListener(() => {
    console.log('Phish Guard extension installed');
    initializeMockData();
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const url = details.url;
        return new Promise((resolve) => {
            checkUrlSafety(url).then(isSafe => {
                if (!isSafe) {
                    resolve({ cancel: true });
                } else {
                    resolve({ cancel: false });
                }
            }).catch(error => {
                console.error('Error checking URL safety:', error);
                resolve({ cancel: false }); // Assume URL is safe if there's an error
            });
        });
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

async function checkUrlSafety(url) {
    const requestBody = {
        client: {
            clientId: "yourcompanyname",
            clientVersion: "1.5.2"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["WINDOWS"],
            threatEntryTypes: ["URL"],
            threatEntries: [
                { url: url }
            ]
        }
    };

    try {
        console.log('Sending request to Google Safe Browsing API for URL:', url);
        const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Response from Google Safe Browsing API:', data);
        return !data.matches;
    } catch (error) {
        console.error('Error checking URL safety:', error);
        return true; // Assume URL is safe if there's an error
    }
}

// Function to report phishing URL and update leaderboard points
async function reportPhish(url, user) {
    try {
        // Simulate reporting phishing URL
        console.log("✅ Report submitted!");

        // Update User Points
        let points = await updatePoints(user);

        // Update leaderboard
        updateLeaderboard();
    } catch (error) {
        console.error("Error reporting phishing URL:", error);
    }
}

// Function to update points
async function updatePoints(user) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['points'], (result) => {
            let points = result.points || {};
            points[user] = (points[user] || 0) + 10; // Add 10 points for reporting
            chrome.storage.local.set({ points: points }, () => {
                console.log("✅ Points updated!");
                resolve(points[user]);
            });
        });
    });
}

// Function to update leaderboard
async function updateLeaderboard() {
    chrome.storage.local.get(['points'], (result) => {
        let points = result.points || {};
        let leaderboardData = Object.keys(points).map(user => ({ user: user, points: points[user] }));
        leaderboardData.sort((a, b) => b.points - a.points); // Sort by points in descending order

        chrome.storage.local.set({ leaderboard: leaderboardData }, () => {
            console.log("Leaderboard updated:", leaderboardData);
        });
    });
}

// Initialize mock data
function initializeMockData() {
    chrome.storage.local.set({ points: {} }, () => {
        console.log("Initialized mock data");
    });
}
