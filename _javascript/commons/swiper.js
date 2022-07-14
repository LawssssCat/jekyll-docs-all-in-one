const lazyload = require('lazyload');
const TOOL = require('tool-box');

lazyload.onload(() => {
  window.document.querySelectorAll('.swiper').forEach(dom => {
    try {
      new Swiper(dom).init();
    } catch(err) {
      TOOL.logger.error('problem dom:', dom, '\n', err);
    }
  });
});

const domFunc = (function() {
  const FUNC = {};
  FUNC.translateX = function(dom, offset) {
    dom.style.transform = `translate(${offset}px, 0)`;
  };
  const disabledClass = 'disabled';
  FUNC.enable = function(dom) {
    dom.classList.remove(disabledClass);
  };
  FUNC.disable = function(dom) {
    dom.classList.add(disabledClass);
  };
  return FUNC;
})();

class Swiper {
  constructor(dom, options={}) {
    this.dom = dom;
    const config = this.config = {};
    config.slideContainerSelector          = options.slideContainerSelector           || '.swiper__slides';
    config.slideContainerAnimationClass    = options.slideContainerAnimationClass     || 'swiper__slides--animation';
    config.slideContainerAnimationSwitch   = options.slideContainerAnimationSwitch    || 'data-swiper-animation';
    config.slideSelector                   = options.slideSelector                    || '.swiper__slide';
    config.slideIndex                      = options.slideIndex                       || 0;
    config.buttonPrevSelector              = options.buttonPrevSelector               || '.swiper__button.swiper__button--prev';
    config.buttonNextSelector              = options.buttonNextSelector               || '.swiper__button.swiper__button--next';
  }
  init() {
    const dom = this.dom;
    const config = this.config;
    const slideContainer = this.slideContainer = dom.querySelector(config.slideContainerSelector);
    this.slideList = slideContainer.querySelectorAll(config.slideSelector);
    this.slideIndexCur = config.slideIndex;
    this.buttonPrev = dom.querySelector(config.buttonPrevSelector);
    this.buttonNext = dom.querySelector(config.buttonNextSelector);
    // animation
    this.isAnimationFlag = 'close' != dom.getAttribute(config.slideContainerAnimationSwitch);
    // init status
    this.moveTo(this.slideIndexCur);
    // listener
    const context = this;
    this.buttonPrev.addEventListener('click', () => {
      context.prev();
    });
    this.buttonNext.addEventListener('click', () => {
      context.next();
    });
    new ResizeObserver(() => {
      context.refresh();
    }).observe(slideContainer);
  }
  isAnimation() {
    return this.isAnimationFlag;
  }
  setAnimation() {
    this.slideContainer.classList.add(this.config.slideContainerAnimationClass);
    let listenerFunc;
    this.slideContainer.addEventListener('transitionend', listenerFunc = () => {
      this.slideContainer.classList.remove(this.config.slideContainerAnimationClass);
      this.slideContainer.removeEventListener('transitionend', listenerFunc);
    });
  }
  moveTo(index, options={}) {
    // index
    let leftIndex=0, rightIndex=this.slideList.length-1;
    if(index<leftIndex) {
      this.slideIndexCur = leftIndex;
    } else if (index>rightIndex) {
      this.slideIndexCur = rightIndex;
    } else {
      this.slideIndexCur = index;
    }
    // animation
    if(this.isAnimation() && options.animation != false) {
      this.setAnimation();
    }
    // offset
    const slideWidth = TOOL.innerWidth(this.slideContainer);
    const offset = this.slideIndexCur * slideWidth;
    domFunc.translateX(this.slideContainer, -offset);
    // button
    if(this.slideIndexCur == leftIndex) {
      domFunc.disable(this.buttonPrev);
    } else {
      domFunc.enable(this.buttonPrev);
    }
    if(this.slideIndexCur == rightIndex) {
      domFunc.disable(this.buttonNext);
    } else {
      domFunc.enable(this.buttonNext);
    }
  }
  refresh() {
    this.moveTo(this.slideIndexCur, {
      animation: false
    });
  }
  prev() {
    const index = this.slideIndexCur-1;
    this.moveTo(index);
  }
  next() {
    const index = this.slideIndexCur+1;
    this.moveTo(index);
  }
}
