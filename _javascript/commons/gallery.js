const lazyload = require('lazyload');
const TOOL = require('tool-box');
const {Modal} = require('lib/modal');
const {Swiper} = require('lib/swiper');

lazyload.onload(() => {
  const galleryMap = {};
  let galleryDefaultId;
  window.document.querySelectorAll('img[data-toggle=gallery]').forEach(dom => {
    const id = dom.getAttribute('data-gallery-id') || galleryDefaultId || (galleryDefaultId=TOOL.generateId('gallery'));
    const imgDomList = galleryMap[id] || (galleryMap[id]=[]);
    imgDomList.push(dom);
  });
  Object.keys(galleryMap).forEach(key => {
    const imgDomList = galleryMap[key];
    const gallery = new Gallery(imgDomList, {
      id: key
    });
    gallery.init();
  });
});

function generateSwiperDom(imgUrlList) {
  // swiper
  const swiperDOM = window.document.createElement('div');
  swiperDOM.classList.add('swiper');
  swiperDOM.classList.add('gallery');
  // slide container
  const slideListDom = window.document.createElement('div');
  swiperDOM.appendChild(slideListDom);
  slideListDom.classList.add('swiper__slides');
  imgUrlList.forEach(imgUrl => {
    // slide
    const slideDOM = window.document.createElement('div');
    slideListDom.appendChild(slideDOM);
    slideDOM.classList.add('swiper__slide');
    slideDOM.classList.add('gallery__item');
    // img
    const imgDOM = window.document.createElement('img');
    slideDOM.appendChild(imgDOM);
    imgDOM.src = imgUrl;
  });
  // prev/next button
  if(imgUrlList.length > 0){
    const prevButton = window.document.createElement('div');
    prevButton.classList.add('swiper__button', 'swiper__button--prev', 'fas', 'fa-chevron-left');
    const nextButton = window.document.createElement('div');
    nextButton.classList.add('swiper__button', 'swiper__button--next', 'fas', 'fa-chevron-right');
    swiperDOM.append(prevButton);
    swiperDOM.append(nextButton);
  }
  return swiperDOM;
}

class Gallery {
  constructor(imgDomList, options={}) {
    this.imgDomList       = imgDomList;
    this.id               = options.id                || TOOL.generateId('gallery');
  }
  init() {
    const context = this;
    // modal
    this.modal = new Modal();
    this.modal.enableEventEscClose();
    // swiper
    const swiperDOM = generateSwiperDom(
      this.imgDomList.map(imgDom => {
        return imgDom.src;
      })
    );
    const swiperImgDomList = Array.from(swiperDOM.querySelectorAll('.gallery__item img'));
    const buttonDomList = Array.from(swiperDOM.querySelectorAll('.swiper__button'));
    this.modal.appendChild(swiperDOM);
    this.swiper = new Swiper(swiperDOM).init();
    // listener
    this.imgDomList.forEach(imgDom => {
      imgDom.addEventListener('click', (e) => {
        context.show(e);
      });
    });
    this.modal.addEventListener('click', (e) => {
      if(!swiperImgDomList.includes(e.target) && !buttonDomList.includes(e.target)) { // hide when the clicked dom is not img
        context.hide(e);
      }
    });
  }
  show(event) {
    TOOL.logger.isDebug() && TOOL.logger.debug(event);
    this.modal.show();
  }
  hide(event) {
    TOOL.logger.isDebug() && TOOL.logger.debug(event);
    this.modal.hide();
  }
}
