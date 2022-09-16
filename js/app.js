console.log("Coded By MKZ");

var tag = document.createElement('script');
tag.id = 'iframe';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const volumeLevelText = document.querySelector("#volumeLevel");
const navigator = document.querySelector("#navigator");
const minimize_maximize = document.querySelector("#minimizeButton img");
const cityBox = document.querySelector("#selectBox");
const titleBox = document.querySelector("#titleTextBox");
const spinner = document.querySelector("#spinner");
const welcomePage = document.querySelector("#welcome");
const welcomeInfoSpan = document.querySelector("#welcomeInfo span");
const welcomeButton = document.querySelector("#welcomeOkeyButton");
const welcomeButtonSpinner = document.querySelector("#welcomeButtonLoading");
const videoSource = document.getElementById("videoSource");

let player;
let volume = 100;
let currentCity;
let welcome = false;

randomizeACity();
fillCityList();
fillTitleBox();
fillWelcomeInfo();
changeVideoSource();

function randomizeACity()
{
    currentCity = cities[Math.floor(Math.random() * (cities.length))];
}

function onYouTubeIframeAPIReady()
{
    player = new YT.Player("player",
    {
        height: "100%",
        width: "100%",
        videoId: currentCity.videoId,
        playerVars:
        {
            rel: 0,
            playsinline: 1,
            mute: 1,
            controls: 0,
            fullscreen: 1,
            start: Math.floor(Math.random() * (330)) + 240,
            showinfo: 0,
            iv_load_policy: 3,
            autohide: 1,
            disablekb: 1,
            enablejsapi: 1,
            modestbranding: 1,
            hl: "en",
            origin: "citywalkz.herokuapp.com"
        },
        events:
        {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function onPlayerReady(event)
{
    welcomeButtonSpinner.style.display = "none";
    welcomeButton.style.display = "block";
    event.target.playVideo();
}

function onPlayerStateChange(event)
{
    player.unloadModule("captions");
    player.unloadModule("cc");

    // -1 = unstarted, 0 = ended, 1 = playing, 2 = stopped , 3 = downloading , 5 = video cued
    if (event.data === 1)
    {
        spinnerControl("none");
    }
    else if (event.data === 0)
    {
        spinnerControl("block");
        randomizeACity();
        fillTitleBox();
        changeVideoSource();
        player.destroy();
        onYouTubeIframeAPIReady();
    }
    else
    {
        spinnerControl("block");
    }
}

function spinnerControl(displayType)
{
    if (displayType === "none")
    {
        setTimeout(() =>
        {
            spinner.style.display = displayType;

            if (player.isMuted() && welcome === true)
            {
                player.unMute();
                changeVolumeText();
            }
        }, 3500);
    }
    else
    {
        spinner.style.display = displayType;
        player.mute();
        changeVolumeText();
    }
}

function welcomeController()
{
    welcome = true;
    if (player.isMuted() && spinner.style.display === "none")
    {
        player.unMute();
    }
    else
    {
        player.unMute();
        player.mute();
    }
    changeVolumeText();
    welcomePage.style.display = "none";
}

function minimize()
{
    var doc = document.documentElement;
    if (navigator.style.display === "none")
    {
        navigator.style.display = "flex";
        let address = "./images/minimize.svg";
        minimize_maximize.src = address;

        if (document.exitFullscreen)
        {
            document.exitFullscreen();
        }
        else if (document.webkitExitFullscreen)
        {
            /* Safari */
            document.webkitExitFullscreen();
        }
        else if (document.msExitFullscreen)
        {
            /* IE11 */
            document.msExitFullscreen();
        }

    }
    else
    {
        navigator.style.display = "none";
        let address = "./images/maximize.svg";
        minimize_maximize.src = address;

        if (doc.requestFullscreen)
        {
            doc.requestFullscreen();
        }
        else if (doc.webkitRequestFullscreen)
        {
            /* Safari */
            doc.webkitRequestFullscreen();
        }
        else if (doc.msRequestFullscreen)
        {
            /* IE11 */
            doc.msRequestFullscreen();
        }
    }
}

function sound()
{
    if (player.isMuted())
    {
        player.unMute();
        changeVolumeText();
    }
    else
    {
        player.mute();
        changeVolumeTextMuted();
    }
}

function increaseVolume()
{
    if (player.isMuted())
    {
        player.unMute();
    }

    if (volume < 100)
    {
        volume += 10;
        player.setVolume(volume);
        changeVolumeText();
    }
}

function decreaseVolume()
{
    if (player.isMuted())
    {
        player.unMute();
    }

    if (volume >= 10)
    {
        volume -= 10;
        player.setVolume(volume);
        changeVolumeText();
    }
}

function changeVolumeText()
{
    if (volume === 0)
    {
        changeVolumeTextMuted();
    }
    else
    {
        newText = volume + "%";
        volumeLevelText.textContent = newText;
    }
}

function changeVolumeTextMuted()
{
    newText = "MUTED";
    volumeLevelText.textContent = newText;
}

function fillCityList()
{
    cities.forEach(c =>
    {
        let newElement = document.createElement("li");
        newElement.setAttribute("onclick", "mkz(" + "\"" + c.videoId + "\"" + ")")
        newElement.textContent = c.title;
        cityBox.appendChild(newElement);
    });
}

function fillTitleBox()
{
    titleBox.textContent = currentCity.title;
}

function fillWelcomeInfo()
{
    welcomeInfoSpan.textContent = currentCity.title;
}

function changeVideoSource()
{
    videoSource.href = "https://www.youtube.com/watch?v=" + currentCity.videoId;
}

function mkz(ID)
{
    spinnerControl("block");
    cities.forEach(c =>
    {
        if (c.videoId === ID)
        {
            currentCity = c;
        }
    });

    fillTitleBox();
    changeVideoSource();
    player.destroy();
    onYouTubeIframeAPIReady();
}