import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { locale } from "user-settings";
import { today as todayActivity } from 'user-activity';
import { me as appbit } from "appbit";
import { display } from "display";
import { BodyPresenceSensor } from "body-presence";
import * as util from "../common/utils";
import * as messaging from "messaging";
import * as fs from "fs";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

// Update the clock every second
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
if (HeartRateSensor) {
  const hrs = new HeartRateSensor();
  hrs.start();
}

// Disable HRS when watch is not on wrist
if (BodyPresenceSensor && hrs) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (body.present) {
      hrs.start();
    } else {
      hrs.stop();
    }
  });
  body.start();
}

// Disable HRS when screen is off
if (display && hrs) {
  display.addEventListener("change", () => {
    if (hrs != null) {
      if (display.on) {
        hrs.start();
      } else {
        hrs.stop();
      }
    }
  });
}



let settings = loadSettings();
applySettings();

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let date = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let dateText = util.getWeekDay(today.getDay(), locale) + " ";
  if (locale.language == "en-us") {
    dateText += month + "/" + date + "/" + year;
  } else {
    dateText += date + "." + month + "." + year;
  }
  dElem.text = dateText;
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
  if (hrs.heartRate == null) {
    hrElem.text = "--";
  } else {
    hrElem.text = hrs.heartRate;
  }
  bElem.text = battery.chargeLevel + "%";
  if (battery.chargeLevel >= 75) {
    bElem.style.fill = "limegreen";
  } else if (battery.chargeLevel >= 35) {
    bElem.style.fill = "gold";
  } else {
    bElem.style.fill = "firebrick";
  }
  if (todayActivity.adjusted != null) {
    let steps = todayActivity.adjusted.steps;
    let stepsText = "";
    if (steps > 1000) {
      let thousands = Math.floor(steps / 1000);
      stepsText += thousands;
      stepsText += ".";
      steps = steps - 1000 * thousands;
      if (steps < 10) {
        stepsText += "0";
      }
      if (steps < 100) {
        stepsText += "0";
      }
    }
    stepsText += steps;
    sElem.text = stepsText;
  } else {
    sElem.text = "--";
  }

}

//Settings

function applySettings() {
  hElem.style.fill = settings.primaryColor;
  mElem.style.fill = settings.secondaryColor;
}

messaging.peerSocket.onmessage = (evt) => {
  if (evt.data.key == "primaryColor") {
    settings.primaryColor = evt.data.value;
  } else if (evt.data.key == "secondaryColor") {
    settings.secondaryColor = evt.data.value;
  }
  applySettings()
}


appbit.onunload = saveSettings;

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {
      primaryColor: "lightcoral",
      secondaryColor: "lightskyblue",
    }
  }
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
