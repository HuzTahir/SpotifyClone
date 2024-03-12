let currentSong = new Audio()
let audioSlider = document.getElementById("audioSlider");
let currentTimeSpan = document.querySelector("#currentTime");
let totalTimeSpan = document.querySelector("#totalTime");
audioSlider.style.width = "60vw";
let playbutton = document.querySelector(".PlayButton");
let prev = document.querySelector(".previousbutton");
let next = document.querySelector(".nextbutton");
let volumebutton=document.querySelector(".volume")
playbutton.disabled = true;
let hamburgercount = 1;
let currfolder;
let songs;
let count;

async function getSongs(folder) {
    try {
        currfolder=folder;
        let a = await fetch(`/SpotifyClone/${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith("mp3")) {
                songs.push(element.href);
            }
        }
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const timeCalculation = (audio, audioSlider, currentTimeSpan, totalTimeSpan) => {
    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        audioSlider.max = duration;
        updateTotalTime(audio, totalTimeSpan);
    });

    audio.addEventListener("timeupdate", () => {
        audioSlider.value = audio.currentTime;
        updateCurrentTime(audio, currentTimeSpan);
    });

    audioSlider.addEventListener("input", () => {
        audio.currentTime = audioSlider.value;
        updateCurrentTime(audio, currentTimeSpan);
    });
}

const playMusic = (track, pause = false) => {
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
    }
    document.querySelector(".songinfo").innerHTML = track.split(`/${currfolder}/`)[1].split(".mp3")[0].replaceAll("%20", " ")

}

function updateSongList() {
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li data-src="${song}"> 
                        <img class="invert" src=${"img/Music.svg"} alt="">
                        <div class="info">
                            <div class="songname"> ${song.split(`/${currfolder}/`)[1].split(".mp3")[0].replaceAll("%20", " ").split("By")[0]}</div>
                            <div class="artist">${song.split(`/${currfolder}/`)[1].split(".mp3")[0].replaceAll("%20", " ").split("By")[1]}</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert playsong"  src=${"img/Playbutton.svg"} alt="">
                        </div>
                    </li>`;
    }
}

async function displayAlbums()
{
    let a = await fetch(`/SpotifyClone/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardContainer=document.querySelector(".cardcontainer");
    let anchors=div.getElementsByTagName("a");
    let array=Array.from(anchors)
        for(let index=0;index<array.length;index++)
        {
            const e=array[index];
        
        if(e.href.includes("/songs/"))
        {
            let folder=e.href.split("/").slice(-2)[1]
            let a = await fetch(`/SpotifyClone/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML= cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <button><img src="https://alfred.app/workflows/vdesabou/spotify-mini-player/icon.png" alt=""></button>
            <img src="/SpotifyClone/songs/${folder}/cover.jpg">
            <h3>${response.title}</h3>
            <h5>${response.description}</h5>
        </div>`;

        }
    }
    Array.from(document.querySelectorAll(".card")).forEach(e=>
        {
            e.addEventListener("click",async item=>
            {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                updateSongList();
                playMusic(songs[0]);
                playbutton.src = "img/PauseButton.svg";
                timeCalculation(currentSong, audioSlider, currentTimeSpan, totalTimeSpan);
                count = 0;
                playlist();
            })
        })
       
}

async function playlist()
{
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playbutton.src = "img/Pausebutton.svg";
            count = 1;
            playMusic(e.getAttribute("data-src"));
        });
    });
}
async function main() {
    try {

        songs = await getSongs("songs/cs");
        // currentSong.src=songs[0];
        // playMusic(songs[0], true);

        //Display all the albums
        displayAlbums();


        let index = 0
        count = 0;
        
        if (songs.length > 0) {
            let audio = currentSong

            playbutton.addEventListener("click", () => {
                if (count === 0) {
                    count = 1;

                    playbutton.src = "img/Pausebutton.svg";
                    audio.play();
                } else if (count === 1) {
                    count = 0;
                    playbutton.src = "img/Playbutton.svg";
                    audio.pause();
                }
                timeCalculation(audio, audioSlider, currentTimeSpan, totalTimeSpan);
            });


           if (currentTimeSpan === totalTimeSpan) {
                playbutton.src = "img/Playbutton.svg";
                count = 0;
            }

            //    timeCalculation(audio,audioSlider,currentTimeSpan,totalTimeSpan)
            document.querySelector(".hamburger").addEventListener("click", () => {
                // if(hamburgercount==1){
                document.querySelector(".left").style.left = "-5%";
                // hamburgercount=0;
                document.querySelector(".hamburger").style.opacity = "0";
                document.querySelector(".close").style.opacity = "100%"
                // }
                // else if(hamburgercount==0)
                // {
                //     document.querySelector(".left").style.left="-100%";
                //     hamburgercount=1;

                // }  
            });
            document.querySelector(".close").addEventListener("click", () => {
                document.querySelector(".left").style.left = "-120%";
                document.querySelector(".hamburger").style.opacity = "100%";
                document.querySelector(".close").style.opacity = "0"
            });
            // ...

            let index = 0; // Move the index variable outside of the main function

            next.addEventListener("click", () => {
                index++;
                if (index < songs.length) {
                    playMusic(songs[index]);
                    playbutton.src = "img/Pausebutton.svg";
                    count = 1;
                } else {
                    // If the end of the playlist is reached, go back to the first song
                    index = 0;
                    playMusic(songs[index]);
                    playbutton.src = "img/Pausebutton.svg";
                    count = 1;
                }
            });

            prev.addEventListener("click", () => {
                index--;
                if (index >= 0) {
                    playMusic(songs[index]);
                    playbutton.src = "img/Pausebutton.svg";
                    count = 1;
                } else {
                    // If at the beginning of the playlist, go to the last song
                    index = songs.length - 1;
                    playMusic(songs[index]);
                    playbutton.src = "img/Pausebutton.svg";
                    count = 1;
                }
            });
            document.querySelector(".songvol").getElementsByTagName("input")[0].addEventListener("change",(e)=>
            {
                currentSong.volume=parseInt(e.target.value)/100
                if(currentSong.volume===0)
                {
                    volumebutton.src="img/mute.svg";
                }
                else
                {
                    
                    volumebutton.src="img/volume.svg";
                }
            });
            let currentVolume=currentSong.volume;
            volumebutton.addEventListener("click",()=>
            {
                if(currentSong.volume !== 0)
                {
                    currentSong.volume=0;
                    volumebutton.src="img/mute.svg";
                    document.querySelector(".songvol").getElementsByTagName("input")[0].value=0;
                }
                else{
                    currentSong.volume=currentVolume;
                    volumebutton.src="img/volume.svg";
                    document.querySelector(".songvol").getElementsByTagName("input")[0].value=currentVolume*30;
                }
            })
          

        } else {
            console.error("No songs found.");
        }
    } catch (error) {
        console.error("Error in main function:", error);
    }
}




function updateCurrentTime(audio, currentTimeSpan) {
    var minutes = Math.floor(audio.currentTime / 60);
    var seconds = Math.floor(audio.currentTime % 60);
    currentTimeSpan.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function updateTotalTime(audio, totalTimeSpan) {
    var minutes = Math.floor(audio.duration / 60);
    var seconds = Math.floor(audio.duration % 60);
    totalTimeSpan.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

main();
