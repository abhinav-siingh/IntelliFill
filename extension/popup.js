document
.getElementById("profileBtn")
.addEventListener("click",()=>{

    chrome.tabs.create({

        url:chrome.runtime.getURL("profile.html")

    });

});

document
.getElementById("resumeBtn")
.addEventListener("click",()=>{

    chrome.tabs.create({

        url:chrome.runtime.getURL("profile.html#resume")

    });

});

document
.getElementById("autofillBtn")
.addEventListener("click",()=>{

    window.close();

});