import React, { Component } from 'react';
import logo from './logo.svg';
import close from './close.png';
import open from './icon.png';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      url: 'http://mycoolurl',
      dragged: false,
      active: false,
      currentX: null,
      currentY: null,
      initialX: null,
      initialY: null,
      xOffset: 0,
      yOffset: 0,
      useDnd: true
    }
  }

  componentDidMount = () => {
      var chatContainerHeaderElem = document.getElementsByClassName('chat-container-header')[0];
      chatContainerHeaderElem.addEventListener('click', this.togglechatContainer);
      var chatContainerHeaderElemMobile = document.getElementsByClassName('chat-container-header-mobile')[0];
      chatContainerHeaderElemMobile.addEventListener('click', this.togglechatContainer);
     
     
      if (typeof(Storage) !== "undefined") {
        var chatContainerOpen = localStorage.getItem('chatContainerOpen');
        var chatContainerHeaderImgElemOpen = document.getElementsByClassName('chat-container-header-img open')[0];
        var chatContainerHeaderImgElemClose = document.getElementsByClassName('chat-container-header-img close')[0];
        var receiverElem = document.getElementById('receiver');
        if (chatContainerOpen && localStorage.getItem('chatContainerOpen') !== "true") {
          this.closechatContainer(receiverElem, chatContainerHeaderImgElemOpen, chatContainerHeaderImgElemClose);
        } else {
          this.openchatContainer(receiverElem, chatContainerHeaderImgElemOpen, chatContainerHeaderImgElemClose);
        }
      } else {
          // Sorry! No Web Storage support..
        console.log('No localStorage support')
      }

      if (this.state.useDnd) {
        this.initchatContainerDnd();
      }
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log('updating');
    if (prevState.useDnd !== this.state.useDnd) {
      if (this.state.useDnd) {
        this.initchatContainerDnd();
      } else {
        this.removechatContainerDnd();
      }
    }
  }

  render () {
    const useDndText = this.state.useDnd ? 'Dnd off' : 'Dnd on';
    return (
      <div className="App">
        <div>
          <button type='button' onClick={this.handleDndChange}>
            <span>{useDndText}</span>
          </button>
        </div>
        <div className="chat-container">
        <div className="chat-container-wrapper">
            <div className="chat-container-header-mobile">
              <img className="close" src={close} alt="toggle chat container" />
            </div>
            <iframe id="receiver" src={this.state.url} title="my cool iframe" frameBorder="0" width="100%" height="100%" allow="geolocation; microphone; camera">
              <p>Your browser does not support iframes.</p>
            </iframe>
            <div className="chat-container-header">
              <img className="chat-container-header-img close" src={close} draggable="false" alt="toggle chat container" />
              <img className="chat-container-header-img open" src={open} draggable="false" alt="toggle chat container" />
            </div>
        </div>
      </div>
      </div>
    );
  }

  initchatContainerDnd = () => {
    var container = document.querySelector("body");

    container.addEventListener("touchstart", this.dragStart, false);
    container.addEventListener("touchend", this.dragEnd, false);
    container.addEventListener("touchmove", this.drag, false);

    container.addEventListener("mousedown", this.dragStart, false);
    container.addEventListener("mouseup", this.dragEnd, false);
    container.addEventListener("mousemove", this.drag, false);
  }

  removechatContainerDnd = () => {
    var container = document.querySelector("body");
    container.removeEventListener("touchstart", this.dragStart, false);
    container.removeEventListener("touchend", this.dragEnd, false);
    container.removeEventListener("touchmove", this.drag, false);

    container.removeEventListener("mousedown", this.dragStart, false);
    container.removeEventListener("mouseup", this.dragEnd, false);
    container.removeEventListener("mousemove", this.drag, false);
    const dragItem = document.querySelector(".chat-container");
    dragItem.style.transform = 'none';
    this.setState({
      dragged: false,
      active: false,
      currentX: null,
      currentY: null,
      initialX: null,
      initialY: null,
      xOffset: 0,
      yOffset: 0
    });
  }

  handleDndChange = (e) => {
    this.setState({
      useDnd: !this.state.useDnd
    });
  }

  openchatContainer = (receiverElem, imgElemOpen, imgElemClose) => {
    document.getElementById('receiver').classList.add("open");
    document.getElementById('receiver').classList.remove("close");
    document.getElementsByClassName('chat-container')[0].classList.add("chat-container-open");
    document.getElementsByClassName('chat-container')[0].classList.remove("chat-container-closed");
    document.getElementsByClassName('chat-container-wrapper')[0].classList.remove("chat-container-closed");
    document.getElementsByClassName('chat-container-header-mobile')[0].classList.remove('close');
    imgElemClose.style.opacity = 1;
    imgElemOpen.style.opacity = 0;
    localStorage.setItem('chatContainerOpen', true);
  }
     
  closechatContainer = (receiverElem, imgElemOpen, imgElemClose) => {
    document.getElementById('receiver').classList.add("close");
    document.getElementById('receiver').classList.remove("open");
    document.getElementsByClassName('chat-container')[0].classList.add("chat-container-closed");
    document.getElementsByClassName('chat-container')[0].classList.remove("chat-container-open");
    document.getElementsByClassName('chat-container-wrapper')[0].classList.add("chat-container-closed");
    document.getElementsByClassName('chat-container-header-mobile')[0].classList.add('close');
    imgElemOpen.style.opacity = 1;
    imgElemClose.style.opacity = 0;
    localStorage.setItem('chatContainerOpen', false);
  }
     
  togglechatContainer = (e) => {
    if (this.state.dragged) return;
    /**
     * Toggles opening and closing of the chatContainer
     * @returns - no return
     */
    var chatContainerHeaderImgElemOpen = document.getElementsByClassName('chat-container-header-img open')[0];
    var chatContainerHeaderImgElemClose = document.getElementsByClassName('chat-container-header-img close')[0];
    var receiverElem = document.getElementById('receiver');
    if (receiverElem.classList.contains('close')) {
      this.openchatContainer(receiverElem, chatContainerHeaderImgElemOpen, chatContainerHeaderImgElemClose);
    } else {
      this.closechatContainer(receiverElem, chatContainerHeaderImgElemOpen, chatContainerHeaderImgElemClose);
    }
  }

  dragStart = (e) => {
    // this.state.dragged = false;
    let initialX;
    let initialY;
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - this.state.xOffset;
      initialY = e.touches[0].clientY - this.state.yOffset;
    } else {
      initialX = e.clientX - this.state.xOffset;
      initialY = e.clientY - this.state.yOffset;
    }
    var touchItem = document.querySelector(".chat-container-header-img.open");
    if (e.target === touchItem) {
      // active = true;
      this.setState({
        dragged: false,
        active: true,
        initialX,
        initialY
      });
    } else {
      this.setState({
        dragged: false,
        initialX,
        initialY
      });
    }
  }

  dragEnd = (e) => {
    const bodyBound = document.body.getBoundingClientRect();
    const chatContainerHeaderBound = document.getElementsByClassName('chat-container-header')[0].getBoundingClientRect();
    const center = {
      x: chatContainerHeaderBound.x + chatContainerHeaderBound.width/2,
      y: chatContainerHeaderBound.y + chatContainerHeaderBound.height/2
    };
    if(center.x < bodyBound.width/2 && center.y < bodyBound.height/2) {
      console.log('left side/ top side');
    } else if (center.x < bodyBound.width/2 && center.y > bodyBound.height/2) {
      console.log('left side/ bottom side');
    } else if (center.x > bodyBound.width/2 && center.y < bodyBound.height/2 ) {
      console.log('right side/ top side');
    } else {
      console.log('right side/ bottom side');
    }


    // console.log('center', center);
    this.setState({
      initialX: this.state.currentX,
      initialY: this.state.currentY,
      active: false
    });
  }

  drag = (e) => {
    const dragItem = document.querySelector(".chat-container");
    if (this.state.active) {
      let currentX;
      let currentY;
      e.preventDefault();

      // dragged = true;
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - this.state.initialX;
        currentY = e.touches[0].clientY - this.state.initialY;
      } else {
        currentX = e.clientX - this.state.initialX;
        currentY = e.clientY - this.state.initialY;
      }

      // xOffset = currentX;
      // yOffset = currentY;
      this.setState({
        xOffset: currentX,
        yOffset: currentY,
        dragged: true
      }, this.setTranslate(currentX, currentY, dragItem));
    }
  }

  setTranslate = (xPos, yPos, el) => {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
}

export default App;
