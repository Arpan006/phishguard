document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('reportPhish').addEventListener('click', reportPhish);
    document.getElementById('checkBreach').addEventListener('click', checkBreach);
    document.getElementById('sandboxTest').addEventListener('click', sandboxTest);
    document.getElementById('checkRisk').addEventListener('click', checkRisk);
    updateLeaderboard();
    applyDarkMode();
});

function applyDarkMode() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkScheme) {
        document.body.classList.add("dark-mode");
        document.querySelectorAll("button").forEach(button => button.classList.add("dark-mode"));
        document.querySelectorAll("input[type='email']").forEach(input => input.classList.add("dark-mode"));
    }
}

async function reportPhish() {
    let url = prompt("Enter the phishing URL:");
    if (!url) return;

    const user = 'current_user'; // Replace with actual user identification logic

    try {
        // Simulate reporting phishing URL
        console.log("✅ Report submitted!");

        // Update User Points
        await updatePoints(user);

        // Update leaderboard
        updateLeaderboard();
    } catch (error) {
        console.error("Error reporting phishing URL:", error);
        alert("❌ Error reporting phishing URL.");
    }
}

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

async function checkBreach() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert("❌ Please enter an email.");
        return;
    }

    // Simulate breach check
    alert(`⚠️ Simulated breach check for ${email}. No actual API call made.`);
}

function sandboxTest() {
    let url = prompt("Enter URL to test:");
    if (!url) return;

    window.open(`https://urlscan.io/search/#${url}`, "_blank");
}

async function checkRisk() {
    let url = prompt("Enter the URL to check risk:");
    if (!url) return;

    // Simulate risk check
    const riskMeter = document.getElementById('riskMeter');
    const riskLevel = Math.random() > 0.5 ? "High" : "Low"; // Randomly assign risk level for simulation
    riskMeter.innerText = `Risk Level: ${riskLevel}`;
    riskMeter.className = riskLevel.toLowerCase();
}

async function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    chrome.storage.local.get(['points'], (result) => {
        let points = result.points || {};
        let leaderboardData = Object.keys(points).map(user => ({ user: user, points: points[user] }));
        leaderboardData.sort((a, b) => b.points - a.points); // Sort by points in descending order

        let list = "";
        leaderboardData.forEach(entry => {
            list += `<li>${entry.user}: ${entry.points} points</li>`;
        });

        leaderboard.innerHTML = list;
    });
}