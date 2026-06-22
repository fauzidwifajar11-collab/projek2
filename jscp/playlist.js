/**
 * Ani's Playlist Logic
 */

class PlaylistManager {
    constructor() {
        this.playlistContainer = document.getElementById('playlist-page');
        this.audio = document.getElementById('playlist-audio');
        this.playBtn = document.getElementById('btn-play');
        this.prevBtn = document.getElementById('btn-prev');
        this.nextBtn = document.getElementById('btn-next');
        this.playIcon = document.getElementById('play-icon');
        this.pauseIcon = document.getElementById('pause-icon');
        this.progressBar = document.getElementById('progress-bar');
        this.progressContainer = document.getElementById('progress-container');
        this.currentTimeEl = document.getElementById('current-time');
        this.durationEl = document.getElementById('duration');
        this.coverImg = document.getElementById('current-cover');
        this.titleEl = document.getElementById('current-title');
        this.artistEl = document.getElementById('current-artist');
        this.trackListEl = document.getElementById('track-list');
        this.closeBtn = document.getElementById('btn-close-playlist');
        this.musicPlayer = document.querySelector('.music-player');

        // Main background music reference to pause it when playlist plays
        this.mainAudio = document.getElementById('birthdayAudio');

        this.currentTrackIndex = 0;
        this.isPlaying = false;

        // Tracks for Iyan & Anis's Playlist
        this.tracks = [
            {
                title: 'Menua Bersama',
                artist: 'Anggis Devaki — Iyan dan Anis ❤️',
                src: './music/menua_bersama.mp3',
                cover: './image/WhatsApp Image 2026-05-28 at 17.22.20.jpeg',
                duration: '4:15'
            },
            {
                title: 'Teman Bahagia',
                artist: 'Jaz — Iyan dan Anis ❤️',
                src: './music/Jaz - Teman Bahagia (Lirik_Lyrics) (128).mp3',
                cover: './image/WhatsApp Image 2026-05-28 at 17.22.21.jpeg',
                duration: '3:34'
            },
            {
                title: 'All of Me',
                artist: 'John Legend — Iyan dan Anis ❤️',
                src: './music/John Legend - All of Me (Lyrics) (128).mp3',
                cover: './image/WhatsApp Image 2026-05-28 at 17.22.22.jpeg',
                duration: '4:29'
            },
            {
                title: 'My Love',
                artist: 'Westlife — Iyan dan Anis ❤️',
                src: './music/Westlife - My Love (Lyrics) (128).mp3',
                cover: './image/WhatsApp Image 2026-05-28 at 17.22.23.jpeg',
                duration: '3:53'
            },
            {
                title: 'Heaven',
                artist: 'Bryan Adams — Iyan dan Anis ❤️',
                src: './music/Bryan Adams - Heaven (Classic Version).mp4',
                cover: './image/WhatsApp Image 2026-05-28 at 17.22.24.jpeg',
                duration: '4:03'
            }
        ];
    }

    init() {
        this.renderTrackList();
        this.loadTrack(this.currentTrackIndex);
        this.addEventListeners();
    }

    renderTrackList() {
        this.trackListEl.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = `track-item ${index === this.currentTrackIndex ? 'active' : ''}`;
            li.innerHTML = `
                <img src="${track.cover}" class="track-item-img" alt="cover">
                <div class="track-item-info">
                    <h4 class="track-item-title">${track.title}</h4>
                    <p class="track-item-artist">${track.artist}</p>
                </div>
                <span class="track-item-duration">${track.duration}</span>
            `;
            li.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(index);
                this.playTrack();
            });
            this.trackListEl.appendChild(li);
        });
    }

    updateTrackListUI() {
        const items = this.trackListEl.querySelectorAll('.track-item');
        items.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    loadTrack(index) {
        const track = this.tracks[index];
        this.audio.src = track.src;
        this.titleEl.textContent = track.title;
        this.artistEl.textContent = track.artist;
        this.coverImg.src = track.cover;
        this.durationEl.textContent = track.duration;
        this.updateTrackListUI();
    }

    playTrack() {
        // Pause main audio if playing
        if (this.mainAudio && !this.mainAudio.paused) {
            this.mainAudio.pause();
        }

        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
            this.musicPlayer.classList.add('playing');
        }).catch(err => console.error("Error playing audio:", err));
    }

    pauseTrack() {
        this.audio.pause();
        this.isPlaying = false;
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        this.musicPlayer.classList.remove('playing');
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    }

    prevTrack() {
        this.currentTrackIndex--;
        if (this.currentTrackIndex < 0) {
            this.currentTrackIndex = this.tracks.length - 1;
        }
        this.loadTrack(this.currentTrackIndex);
        this.playTrack();
    }

    nextTrack() {
        this.currentTrackIndex++;
        if (this.currentTrackIndex > this.tracks.length - 1) {
            this.currentTrackIndex = 0;
        }
        this.loadTrack(this.currentTrackIndex);
        this.playTrack();
    }

    updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (isNaN(duration)) return;
        const progressPercent = (currentTime / duration) * 100;
        this.progressBar.style.width = `${progressPercent}%`;

        // Update current time display
        let currentMins = Math.floor(currentTime / 60);
        let currentSecs = Math.floor(currentTime % 60);
        if (currentSecs < 10) currentSecs = '0' + currentSecs;
        this.currentTimeEl.textContent = `${currentMins}:${currentSecs}`;
    }

    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    openPlaylist() {
        this.playlistContainer.style.display = 'flex';
        // Small delay for CSS transition
        setTimeout(() => {
            this.playlistContainer.classList.add('show');
        }, 50);
    }

    closePlaylist() {
        this.pauseTrack();
        this.playlistContainer.classList.remove('show');
        setTimeout(() => {
            this.playlistContainer.style.display = 'none';
        }, 1000);
    }

    addEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.audio.addEventListener('timeupdate', (e) => this.updateProgress(e));
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        this.audio.addEventListener('ended', () => this.nextTrack());
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closePlaylist());
        }
    }
}

// Global instance
let aniPlaylist;

document.addEventListener('DOMContentLoaded', () => {
    aniPlaylist = new PlaylistManager();
    aniPlaylist.init();
});
