import tmpl from './which-of-these-is-cat.html'
import './which-of-these-is-cat.scss';
import dataService from '../../services/data-service';


class WhichOfTheseIsCat extends HTMLElement{
  constructor(){
    super();
    this.images = [];

    this.setData = this.setData.bind(this);
    this.reset = this.reset.bind(this);

    this._init = this._init.bind(this);
    this._createImageCardNode = this._createImageCardNode.bind(this);
    this._updateContent = this._updateContent.bind(this);
    this._getStatus = this._getStatus.bind(this);
    this._getTwoUntaggedImage = this._getTwoUntaggedImage.bind(this);
    this._nextSet = this._nextSet.bind(this);
    this._setTagged = this._setTagged.bind(this);
    this._showResult = this._showResult.bind(this);
    this._updateDescription = this._updateDescription.bind(this);
    this._updateImages = this._updateImages.bind(this);
  }

  //============= COMPONENT CYCLE ============== //

  connectedCallback(){
    const main = document.createRange().createContextualFragment(tmpl).querySelector('template').content;
    // Get ref
    this.totalCats = main.querySelector('.total-cats');
    this.taggedImages = main.querySelector('.tagged-images');
    this.totalImages = main.querySelector('.total-images');
    this.statusEl = main.querySelector('.status');
    this.imageContainer = main.querySelector('.container__content');
    this.nextBtn = main.querySelector('.next');
    this.resetBtn = main.querySelector('.reset');

    this.appendChild(main);

    this._init();

    this.nextBtn.addEventListener('click', this._nextSet);
    this.resetBtn.addEventListener('click', this.reset);
  }

  disconnectedCallback(){
    this.nextBtn.removeEventListener('click', this._nextSet);
    this.resetBtn.removeEventListener('click', this.reset);
  }

  //============= PUBLIC METHODS ============== //

  setData(data){
    this.images = data;
  }

  reset(){
    this.setData(dataService.initDB());
    this._init()
  }

  //============= PRIVATE METHODS ============== //

  // DOM Methods

  _init(){
    this.imageContainer.innerHTML = '';
    const status = this._getStatus();
    const imgArr = this._getTwoUntaggedImage();
    this._updateDescription(status);
    this._updateContent(imgArr);
  }

  _updateDescription(status){
    this.totalCats.textContent = status.totalCats;
    this.taggedImages.textContent = status.taggedImages;
    this.totalImages.textContent = status.totalImages;
  }

  _updateContent(imgArr = []){
    if(imgArr.length > 0){
      this.c1 = this._createImageCardNode(imgArr[0]);
      this.c2 = this._createImageCardNode(imgArr[1]);
      this.imageContainer.appendChild(this.c1);
      this.imageContainer.appendChild(this.c2);
      this.nextBtn.classList.remove('d-none');
    }else{
      this._showResult();
      this.nextBtn.classList.add('d-none');
    }
  }

  _showResult(){
    const cats = this.images.filter(img => !!img.iscat);
    // Shuffle Result
    if(cats.length > 0){
      const shuffleEl = document.createElement('shuffle-result');
      shuffleEl.setData(cats);
      this.imageContainer.appendChild(shuffleEl);
    } else {
      
      this.imageContainer.innerHTML = `
        &#x1f431;&#x1f431;&#x1f431;
        <br/>Cats Not Found :( <br/>
        &#x1f431;&#x1f431;&#x1f431;`; 
    }
  }

  _nextSet(){
    this._setTagged();
    this._init();
    if(this.totalImages.textContent === this.taggedImages.textContent){
      this.nextBtn.classList.add('d-none');
    }
  }

  // Helper Methods
  
  _getTwoUntaggedImage(){
    let c = 0;
    const u = [];
    this.images.forEach(img => {
      if(!img.tagged && c < 2){
        u.push(img);
        c++;
      }
    });
    return u;
  }

  _createImageCardNode(imgObj = {}, freeze = false){
    const c = document.createElement('image-card');
    c.setData(imgObj, freeze);
    c.addEventListener('cardUpdated', this._updateImages); // Listen for card updates
    return c;
  }

  _setTagged(){
    Array.prototype.forEach.call(
      this.imageContainer.querySelectorAll('image-card'), img => {
        img.setTagged();
      }
    );
  }
  
  _getStatus(){
    const status = this.images.reduce((s, img) => {
      !!img.iscat && s.totalCats ++;
      !!img.tagged && s.taggedImages ++;
      return s;
    }, {totalCats: 0, taggedImages:0});
    const totalImages = (this.images || []).length;
    if(totalImages === status.taggedImages){
      status.completed = true;
    }
    return {...status, totalImages: totalImages};
  }
  
  _updateImages(updatedImg = {}){
    this.images.forEach(img => {
      if(img.id === (updatedImg || {}).id){
        img = Object.assign({}, updatedImg);
      }
    });
    dataService.saveData(this.images);
    const status = this._getStatus();
    this._updateDescription(status);
  }
}

customElements.define('which-of-these-is-cat', WhichOfTheseIsCat);