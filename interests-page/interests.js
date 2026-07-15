document.addEventListener('DOMContentLoaded', () => {
  let currentLanguage = document.documentElement.lang === 'zh-CN' ? 'zh' : 'en';

  function setLanguage(language) {
    currentLanguage = language === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    document.title = currentLanguage === 'zh' ? '兴趣' : 'Interests';
    document.querySelectorAll('[data-en][data-zh]').forEach((element) => {
      const value = element.dataset[currentLanguage];
      if (value.includes('<br>')) element.innerHTML = value;
      else element.textContent = value;
    });
    if (activeAlbumKey && albums[activeAlbumKey]) {
      const total = albums[activeAlbumKey].files.length;
      albumModalCount.textContent = currentLanguage === 'zh' ? `${total} 帧` : `${total} FRAMES`;
    }
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'set-language') setLanguage(event.data.language);
  });

  const playlistItems = Array.from(document.querySelectorAll('.playlist-item'));

  function closePlaylist(item) {
    const summary = item.querySelector('.playlist-summary');
    const detail = item.querySelector('.playlist-detail');
    item.classList.remove('is-open');
    summary.setAttribute('aria-expanded', 'false');
    detail.hidden = true;
  }

  function openPlaylist(item) {
    playlistItems.forEach((otherItem) => {
      if (otherItem !== item) closePlaylist(otherItem);
    });
    const summary = item.querySelector('.playlist-summary');
    const detail = item.querySelector('.playlist-detail');
    item.classList.add('is-open');
    summary.setAttribute('aria-expanded', 'true');
    detail.hidden = false;
  }

  playlistItems.forEach((item) => {
    const summary = item.querySelector('.playlist-summary');
    const detail = item.querySelector('.playlist-detail');
    summary.addEventListener('click', () => {
      if (item.classList.contains('is-open')) closePlaylist(item);
      else openPlaylist(item);
    });
    detail.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      closePlaylist(item);
      summary.focus();
    });
    closePlaylist(item);
  });

  const albums = {
    brazil: {
      title: 'BRAZIL',
      files: [
        '20240511_013141.jpg', '20240519_201640.jpg', '20240520_145847.jpg',
        '20251121_202745.jpg', '20251122_214340.jpg', '20251122_224035.jpg',
        '20251224_201609.jpg', '20251225_184217.jpg', '20251226_111310.jpg',
        '20251226_140223.jpg', '20251226_173643.jpg', '20251226_185553.jpg',
        '20251231_142913.jpg'
      ]
    },
    australia: {
      title: 'AUSTRALIA',
      files: [
        '20260524_133336.jpg', '20260527_204616.jpg', '20260529_143530.jpg',
        '20260529_200904.jpg', '20260606_155503.jpg', '20260612_134305.jpg',
        '20260618_123851.jpg', '20260619_151422.jpg', '20260627_132918.jpg',
        '20260627_170921.jpg', '20260628_104837.jpg', '20260710_170907.jpg'
      ]
    },
    china: {
      title: 'CHINA',
      files: [
        '20260116_174019.jpg', '20260116_175403.jpg', '20260125_130036.jpg',
        '20260125_135718.jpg', '20260202_181233.jpg', '20260220_170459.jpg',
        '20260220_170510.jpg', '20260220_170724.jpg', '20260223_114439.jpg',
        '20260226_184339.jpg'
      ]
    },
    indonesia: {
      title: 'INDONESIA',
      files: [
        '20260406_162745.jpg', '20260406_180522.jpg', '20260406_193823.jpg',
        '20260408_111856.jpg', '20260408_112715.jpg', '20260408_132757.jpg',
        '20260409_163645.jpg', '20260410_115023.jpg', '20260410_125038.jpg',
        '20260410_133811.jpg'
      ]
    }
  };

  const pageRoot = document.querySelector('.interests-page');
  const albumModal = document.querySelector('.album-modal');
  const albumModalTitle = document.querySelector('.album-modal-title');
  const albumModalCount = document.querySelector('.album-modal-count');
  const albumModalClose = document.querySelector('.album-modal-close');
  const albumGallery = document.querySelector('.album-gallery');
  const photoLightbox = document.querySelector('.photo-lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const photographyAssetRoot = document.baseURI.includes('/interests-page/')
    ? 'assets/photography'
    : './interests-page/assets/photography';
  let activeAlbumKey = null;
  let activePhotoIndex = 0;
  let activeAlbumTrigger = null;

  function photoPath(albumKey, filename) {
    return `${photographyAssetRoot}/${albumKey}/${filename}`;
  }

  function showLightboxPhoto(index) {
    const album = albums[activeAlbumKey];
    if (!album) return;
    activePhotoIndex = (index + album.files.length) % album.files.length;
    const filename = album.files[activePhotoIndex];
    lightboxImage.src = photoPath(activeAlbumKey, filename);
    lightboxImage.alt = `${album.title} photograph ${activePhotoIndex + 1}`;
    lightboxCaption.textContent = `${album.title} · ${String(activePhotoIndex + 1).padStart(2, '0')} / ${String(album.files.length).padStart(2, '0')}`;
  }

  function openLightbox(index) {
    showLightboxPhoto(index);
    photoLightbox.hidden = false;
    lightboxClose.focus();
  }

  function closeLightbox({ restoreFocus = true } = {}) {
    if (photoLightbox.hidden) return;
    photoLightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    if (restoreFocus) albumGallery.querySelectorAll('.album-gallery-item')[activePhotoIndex]?.focus();
  }

  function openAlbum(albumKey) {
    const album = albums[albumKey];
    if (!album) return;
    activeAlbumKey = albumKey;
    activePhotoIndex = 0;
    activeAlbumTrigger = document.querySelector(`.album-cover[data-album="${albumKey}"]`);
    albumModalTitle.textContent = album.title;
    albumModalCount.textContent = currentLanguage === 'zh' ? `${album.files.length} 帧` : `${album.files.length} FRAMES`;
    albumGallery.replaceChildren();
    album.files.forEach((filename, index) => {
      const button = document.createElement('button');
      button.className = 'album-gallery-item';
      button.type = 'button';
      button.setAttribute('role', 'listitem');
      button.setAttribute('aria-label', `${album.title} photograph ${index + 1}`);
      button.dataset.index = String(index + 1).padStart(2, '0');
      const image = document.createElement('img');
      image.src = photoPath(albumKey, filename);
      image.alt = '';
      image.loading = 'eager';
      button.append(image);
      button.addEventListener('click', () => openLightbox(index));
      albumGallery.append(button);
    });
    albumModal.hidden = false;
    pageRoot.inert = true;
    document.body.classList.add('modal-open');
    albumModalClose.focus();
  }

  function closeAlbum() {
    if (!activeAlbumKey) return;
    closeLightbox({ restoreFocus: false });
    const trigger = activeAlbumTrigger;
    activeAlbumKey = null;
    activeAlbumTrigger = null;
    albumModal.hidden = true;
    albumGallery.replaceChildren();
    pageRoot.inert = false;
    document.body.classList.remove('modal-open');
    if (trigger) trigger.focus();
  }

  document.querySelectorAll('.album-cover').forEach((cover) => {
    cover.addEventListener('click', () => openAlbum(cover.dataset.album));
  });
  albumModalClose.addEventListener('click', closeAlbum);
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showLightboxPhoto(activePhotoIndex - 1));
  lightboxNext.addEventListener('click', () => showLightboxPhoto(activePhotoIndex + 1));
  albumModal.addEventListener('click', (event) => {
    if (event.target === albumModal) closeAlbum();
  });
  photoLightbox.addEventListener('click', (event) => {
    if (event.target === photoLightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (activeAlbumKey) {
      if (!photoLightbox.hidden && event.key === 'ArrowLeft') showLightboxPhoto(activePhotoIndex - 1);
      if (!photoLightbox.hidden && event.key === 'ArrowRight') showLightboxPhoto(activePhotoIndex + 1);
      if (event.key === 'Escape') {
        if (!photoLightbox.hidden) closeLightbox();
        else closeAlbum();
      }
      return;
    }
    if (event.key !== 'Escape') return;
    const openItem = document.querySelector('.playlist-item.is-open');
    if (!openItem) return;
    const summary = openItem.querySelector('.playlist-summary');
    closePlaylist(openItem);
    summary.focus();
  });

  setLanguage(currentLanguage);
});
