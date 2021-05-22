function Gallery(gallery) {
    if (!gallery) {
        throw new Error('🔴 No Gallery found!');
    }

    const images = Array.from(gallery.querySelectorAll('img'));
    const modal = document.querySelector('.modal');
    const prevButton = modal.querySelector('.prev');
    const nextButton = modal.querySelector('.next');

    let currentImage;

    function openModal() {
        console.info('Opening modal');
        if (modal.matches('.open')) {
            console.info('Modal already open');
            return;
        }
        modal.classList.add('open');

        window.addEventListener('keyup', handleKeyUp);
        nextButton.addEventListener('click', showNextImage);
        prevButton.addEventListener('click', showPrevImage);
    }
    function closeModal() {
        modal.classList.remove('open');
        window.removeEventListener('keyup', handleKeyUp);
        nextButton.removeEventListener('click', showNextImage);
        prevButton.removeEventListener('click', showPrevImage);
    }
    function handleClickOutside(e) {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }
    function handleKeyUp(e) {
        if (e.key === 'Escape') return closeModal();
        if (e.key === 'ArrowRight') return showNextImage();
        if (e.key === 'ArrowLeft') return showPrevImage();
    }
    function showNextImage() {
        showImage(currentImage.nextElementSibling || gallery.firstElementChild);
    }
    function showPrevImage() {
        showImage(currentImage.previousElementSibling || gallery.lastElementChild);
    }
    function showImage(e) {
        if (!e) {
            console.log('no image to show');
            return;
        }
        console.log(e);
        modal.querySelector('img').src = e.src;
        modal.querySelector('h2').textContent = e.title;
        modal.querySelector('figure p').textContent = e.dataset.description;
        modal.querySelector('h3').textContent = e.dataset.price;
        currentImage = e;
        openModal();
    }
    images.forEach(image =>
        image.addEventListener('click', e => showImage(e.currentTarget))
    );
    images.forEach(image => {
        image.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                showImage(e.currentTarget);
            }
        });
    });
    modal.addEventListener('click', handleClickOutside);
}

const galleryA = Gallery(document.querySelector('.gallery-a'));
const galleryB = Gallery(document.querySelector('.gallery-b'));