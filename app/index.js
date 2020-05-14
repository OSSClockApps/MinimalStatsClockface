import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { locale } from "user-settings";
import { today as todayActivity } from 'user-activity';
import * as util from "../common/utils";
import {me as appbit} from "appbit";

// Update the clock every minute
clock.granularity = "seconds";

const dElem = document.getElementById("dateText");
const hElem = document.getElementById("hoursText");
const mElem = document.getElementById("minutesText");
const hrElem = document.getElementById("heartRateText");
const bElem = document.getElementById("batteryText");
const sElem = document.getElementById("stepsText");

document.getElementById("stepsUnit").text = "STEPS";
document.getElementById("heartRateUnit").text = "BPM";

//HeartRateSensor
const hrs = new HeartRateSensor();
hrs.start();


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  dElem.text = util.getWeekDay(today.getDay(),locale)+ " "+ today.getDate() + "." + (today.getMonth()+1) + "." + today.getFullYear();
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = util.monoDigits(hours % 12 || 12, false);
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.monoDigits(today.getMinutes());
  hElem.text = hours;
  mElem.text = mins;
  if(hrs.heartRate == null){
    hrElem.text = "--";
  }else{
    hrElem.text = hrs.heartRate;
  }
  bElem.text =  battery.chargeLevel + "%";
  if(battery.chargeLevel >= 75){
    bElem.style.fill = "limegreen";
  }else if(battery.chargeLevel >= 35){
    bElem.style.fill = "gold";
  }else{
    bElem.style.fill = "firebrick";
  }
  if(todayActivity.adjusted != null){
    let steps = todayActivity.adjusted.steps;
    let stepsText = "";
    if(steps > 1000){
      let thousands = Math.floor(steps/1000);
      stepsText += thousands;
      stepsText += ".";
      steps = steps - 1000*thousands;
    }
    stepsText += steps;
    sElem.text = stepsText;
  }else{
    sElem.text = "--";
  }
  
}
