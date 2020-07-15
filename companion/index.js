import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";

settingsStorage.onchange = (evt) => {
  sendNewValue(evt.key, evt.newValue);
}

function sendNewValue(key, value){
  if(value != null){
    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN){
      messaging.peerSocket.send({key: key, value: JSON.parse(value)});
    }else{
      console.log("Error");
    }
  }  
}