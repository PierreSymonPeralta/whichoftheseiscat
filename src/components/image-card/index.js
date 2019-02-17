import tmpl from './image-card.html'
import './image-card.scss';

class ImageCard extends HTMLElement{
  constructor(){
    super();
    this.image = {};
    this.freeze = false;

    this._init = this._init.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._dispathUpdate = this._dispathUpdate.bind(this);
    this.setTagged = this.setTagged.bind(this);
  }

  //============= COMPONENT CYCLE ============== //

  connectedCallback(){
    const tmp = document.createRange().createContextualFragment(tmpl).querySelector('template').content;
    // Get ref
    this.img = tmp.querySelector('img');
    this.overlay = tmp.querySelector('.overlay');
    this.overlayContent = this.overlay.querySelector('.overlay__content');
    
    this._init()
    
    this.appendChild(tmp);
    this.freeze || this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback(){
    this.removeEventListener('click', this._handleClick);
  }

  //============= PUBLIC METHODS ============== //

  setData(data, freeze){
    this.freeze = !!freeze;
    this.image = data;
  }

  setTagged(){
    this.image.tagged = true;
    this._dispathUpdate();
  }

  //============= PRIVATE METHODS ============== //

  _init(){
    this.img.setAttribute('src', 'data/' + (this.image.img || ''));
    this.img.setAttribute('id', this.image.id);
    this.image.iscat && this.overlay.classList.remove('d-none');
    this.overlayContent.textContent = this.image.message || '';
  }

  _handleClick(e){
    this.selected = true;
    this.overlay.classList.toggle('d-none');
    this.image.iscat = !this.image.iscat;
    this._dispathUpdate();
  }

  _dispathUpdate(){
    const evt = new CustomEvent('cardUpdated', { detail: this.image });
    this.dispatchEvent(evt);
  }

}


customElements.define('image-card', ImageCard);