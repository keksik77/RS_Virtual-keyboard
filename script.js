import { keys } from './keys.js'; 

let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ru';
let index = 0;
let shift = false;
let caps = false;
let alt = false;
let light = false;
let flag = true;

const about = document.createElement('span');
about.className = 'about';
document.body.appendChild(about);
about.innerHTML = 'Смена языка Shift+Alt, OS "Windows10"';

const textarea = document.createElement('textarea');
textarea.className = 'textarea';
document.body.appendChild(textarea);

const keyboard = document.createElement('div');
keyboard.className = 'keyboard';
document.body.appendChild(keyboard);
    
for (let key in keys) {
  let elem = document.createElement('div');
  elem.id = key;
  elem.className = keys[key].class;
  elem.innerHTML = keys[key][lang][0];
  elem.addEventListener('mousedown', (e) => {
    toDown(e.target.id);
    e.preventDefault();
  });
  elem.addEventListener('mouseup',(e)=>{
    toUp(e.target.id);
    e.preventDefault();
  });
  keyboard.appendChild(elem);
}

document.addEventListener('keydown', (e) => {
  toDown(e.code);
  e.preventDefault();
});
document.addEventListener('keyup', (e) => {
  toUp(e.code);
  e.preventDefault();
});

function getCursorPosition(el){
    var CaretPos = 0;
    if ( document.selection ) {
    el.focus ();
        var Sel = document.getSelection();
        Sel.moveStart ('character', -el.value.length);
        CaretPos = Sel.text.length;
    } else if ( el.selectionStart || el.selectionStart == '0' ) {
        CaretPos = el.selectionStart;
    }
    return CaretPos;
}

function toDown(id) {
    textarea.focus();
  let elem = document.getElementById(id);
  elem.classList.add('active');
  if (keys[id].inner == true) {
    let a = getCursorPosition(textarea);
    textarea.value = `${textarea.value.substring(0,textarea.selectionStart)}${elem.innerText}${textarea.value.substring(textarea.selectionEnd)}`
    textarea.setSelectionRange(a+1,a+1);
  } else
  switch (id){
    case "Backspace":
        let a = textarea.selectionStart;
        if(a != 0){
            textarea.value = textarea.value.substring(0,textarea.selectionStart-1)+textarea.value.substring(textarea.selectionEnd);
            textarea.setSelectionRange(a-1,a-1);
        }
        break;
    case "Delete":
        let b = textarea.selectionEnd;
        if(b != textarea.value.length){
            textarea.value = textarea.value.substring(0,textarea.selectionStart)+textarea.value.substring(textarea.selectionEnd+1);
            textarea.setSelectionRange(b,b);
        } 
        break;
    case "Enter":
        let c = textarea.selectionEnd;
        textarea.value = `${textarea.value.substring(0,textarea.selectionStart)}${`\n`}${textarea.value.substring(textarea.selectionEnd)}`
        textarea.setSelectionRange(c+1,c+1);
        break;
    case "ArrowLeft":
        if(getCursorPosition(textarea) != 0){
            textarea.setSelectionRange(getCursorPosition(textarea)-1,getCursorPosition(textarea)-1);
        }
        break;
    case "ArrowRight":
        textarea.setSelectionRange(getCursorPosition(textarea)+1,getCursorPosition(textarea)+1);
        break;
    case "ArrowUp":
        textarea.setSelectionRange(0,0);
        break;
    case "ArrowDown":
        textarea.setSelectionRange(textarea.value.length,textarea.value.length);
        break;
    case "Tab":
        let d = textarea.selectionEnd;
        textarea.value = `${textarea.value.substring(0,textarea.selectionStart)}${`\t`}${textarea.value.substring(textarea.selectionEnd)}`
        textarea.setSelectionRange(d+1,d+1);
        break;
    case "Space":
        let e = textarea.selectionEnd;
        textarea.value = `${textarea.value.substring(0,textarea.selectionStart)}${` `}${textarea.value.substring(textarea.selectionEnd)}`
        textarea.setSelectionRange(e+1,e+1);
        break;
  }
  
    if (id == 'CapsLock' && flag) {
        caps = !caps;
        index = Math.abs(index - 1);
        let count = 0;
        for (let key in keys) {
        if (keys[key].inner && count>14) {
            let el = document.getElementById(key);
            el.innerHTML = keys[key][lang][index];
        }else count++;
        }
        flag = false;
    }else if(id === 'AltRight' || id === 'AltLeft'){
        alt = true;
    }else if ( id === "MetaLeft" && light == false){
        for (let key in keys) {
            let elem = document.getElementById(key);
            elem.classList.add('light');
        }
        light = true;
    }else if(id ==="MetaLeft" && light == true){
        for (let key in keys) {
            let elem = document.getElementById(key);
            elem.classList.remove('light');
        }
        light = false;
    }
     if((id === 'ShiftRight' || id === 'ShiftLeft') && caps === true){
        let count = 0;
        for (let key in keys) {
            let elem = document.getElementById(key);
            if(keys[key].inner && count < 14){
                elem.innerHTML = keys[key][lang][Math.abs(index)];
                count++;
            }else elem.innerHTML = keys[key][lang][Math.abs(index-1)];
        }
    }else if (id === 'ShiftRight' || id === 'ShiftLeft'){
      index = shift ? index : Math.abs(index - 1);
      shift = true;
      for (let key in keys) {
        let elem = document.getElementById(key);
        elem.innerHTML = keys[key][lang][index];
      }
    }
    else if ((id === 'AltRight' || id === 'AltLeft') && shift) {
      lang = (lang == 'ru') ? 'en' : 'ru';
      for (let key in keys) {
        let elem = document.getElementById(key);
        elem.innerHTML = keys[key][lang][index];
      }
    }
     if ((id === 'ShiftRight' || id === 'ShiftLeft') && alt){
        lang = (lang == 'ru') ? 'en' : 'ru';
        for (let key in keys) {
            let elem = document.getElementById(key);
            elem.innerHTML = keys[key][lang][index];
        }
    }
}

function toUp(id) {
    for (let key in keys){
        let elem = document.getElementById(key);
        if (key != 'ShiftRight' && key != 'ShiftLeft' && (key !== 'CapsLock' || !caps)) {
            elem.classList.remove('active');
        }
    }
    if(id === 'ShiftLeft' || id === 'ShiftRight'){
        let elem = document.getElementById(id);
        elem.classList.remove('active');
    }
    if(id === 'CapsLock'){
        flag = true;
    }else if((id === 'ShiftRight' || id === 'ShiftLeft') && caps === true){
        let count = 0;
        for (let key in keys) {
            let elem = document.getElementById(key);
            if(keys[key].inner && count < 14){
                elem.innerHTML = keys[key][lang][Math.abs(index-1)];
                count++;
            }else
            elem.innerHTML = keys[key][lang][Math.abs(index)];
        }
    }else if(id === 'ShiftRight' || id === 'ShiftLeft'){
        shift = false;
        index = Math.abs(index - 1);
        for (let key in keys) {
            let elem = document.getElementById(key);
            elem.innerHTML = keys[key][lang][index];
        }
    }else if(id === 'AltRight' || id === 'AltLeft'){
        alt = false;
    }
}

keyboard.onmousedown = function(event) {

    let shiftX = event.clientX - keyboard.getBoundingClientRect().left;
    let shiftY = event.clientY - keyboard.getBoundingClientRect().top;
  
    keyboard.style.position = 'absolute';
    keyboard.style.zIndex = 1000;
  
    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        
        if(((pageX - shiftX + keyboard.clientWidth) < window.innerWidth) && ((pageX- shiftX)>0)){
            keyboard.style.left = pageX - shiftX + 'px';}
        if(((pageY - shiftY + keyboard.clientHeight) < window.innerHeight) && ((pageY - shiftY)>0)){
            keyboard.style.top = pageY - shiftY + 'px';}
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    document.addEventListener('mousemove', onMouseMove);
  
    keyboard.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      keyboard.onmouseup = null;
    };
  
    keyboard.ondragstart = function() {
    return false;
  };
};

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lang', lang);
});
