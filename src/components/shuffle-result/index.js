
import './shuffle-result.scss';
import dataService from '../../services/data-service';

class ShuffleResult extends HTMLElement{
  constructor(){
    super();
    this.catImages = [];
    this.allImages = [];
    this._createShuffleCard = this._createShuffleCard.bind(this);
  }

  //============= COMPONENT CYCLE ============== //

  connectedCallback(){
    this.catImages.forEach(img => {
      this._createShuffleCard(img);
    });
  }

  //============= PUBLIC METHODS ============== //

  setData(data){
    this.catImages = data;
    this.allImages = dataService.getData();
  }

  //============= PRIVATE METHODS ============== //

  _createShuffleCard(img){
    const imgCard = document.createElement('img');
    this.appendChild(imgCard);

    goShuffle(imgCard, this.allImages);

    async function goShuffle(img, allImages){
      await shuffleCard(img, allImages);;
    }
  
    function shuffleCard(c, a){
      return new Promise((resolve, reject) => {
        let idx = 0;
        let tick = 0;
        let duration = 50;
        function shuffle(){
          c.setAttribute('src', 'data/' + a[Math.floor(Math.random() * Math.floor(a.length))].img);
          idx++;
          tick++;
          idx === a.length && (idx = 0);
          if(tick === duration){
            c.setAttribute('src', 'data/' + img.img);
            idx = 0; tick = 0; duration = 50; resolve(c);
            return;
          }
          requestAnimationFrame(shuffle);
        }
        requestAnimationFrame(shuffle);
      });
    }
  }
}


customElements.define('shuffle-result', ShuffleResult);