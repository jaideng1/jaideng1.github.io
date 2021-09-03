const socials = document.getElementById("socials");

//Pre-set links because quality issues.
const links = {
    twitter: { 
        link: "https://www.shareicon.net/data/256x256/2017/06/22/887584_logo_512x512.png",
        sizing: {
            w: 256,
            h: 256,
            closestTo32x32: {
                h: 32,
                w: 32
            }
        }
    },
    youtube: {
        link: "https://www.shareicon.net/data/256x256/2016/07/10/119962_youtube_512x512.png",
        sizing: {
            w: 256,
            h: 256,
            closestTo32x32: {
                h: 32,
                w: 32
            }
        }
    }

}

//TODO: Remove `/new-porfolio` when finished with the website
function getSocials() {
    return fetch(isLocal() ? "/info.json" : "/new-porfolio/info.json").then(response => response.json())
}

/**
 * Gets the link for an icon for a webpage. (Not the best solution, but it's fine until I add a domain like 'something.example.com')
 * @param {String} URL 
 * @returns {String}
 */
function getWebpageIcon(URL="https://example.com") {
    URL = URL.replace("www.", "");

    let splitURL = (URL.includes(".com")) ? URL.split(".com") : URL.split(".org");
    
    if (!splitURL[0].startsWith("https://") && !splitURL[0].startsWith("http://")) throw "Not a valid URL.";
    //Assume it's hosted on localhost:XXXX, so return it with the icon location attached.
    if (splitURL.length == 1) return (URL.split('')[URL.split('').length - 1] == "/") ? URL + "favicon.ico" : URL + "/favicon.ico"

    let domain = splitURL[0].replace("https://", "").replace("http://", "");

    if (links[domain] != null) return links[domain];

    if (splitURL[1].includes("/")) {
        let split2ndArgURL = splitURL[1].split('/');
        return splitURL[0] + ".com" + split2ndArgURL[0] + "/favicon.ico"
    } else return URL + "/favicon.ico";
}

window.addEventListener("load", createSocials)

async function createSocials() {
    if (!socials) throw "Error: Missing Element. Element with id \"socials\" were not found.";
    
    let data = await getSocials();
    let links = data.socials;

    for (let link of links) {
        let div = document.createElement("div");
        let img = document.createElement("img");
        let icon = getWebpageIcon(link);
        
        if (typeof icon === "string") {
            img.src = icon;
            img.style = "width: 32px; height: 32px;"
        } else {
            img.src = icon.link;
            img.style = `width: ${icon.sizing.closestTo32x32.w}px; height: ${icon.sizing.closestTo32x32.h}px;`
        }
        
        div.onclick = () => {
            window.open(link,'_blank');
        }

        div.appendChild(img);
        socials.appendChild(div);
    }
}

function isLocal() {
    return document.location.hostname == "localhost";
}