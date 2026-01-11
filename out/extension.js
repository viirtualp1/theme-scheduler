"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/suncalc3/suncalc.js
var require_suncalc = __commonJS({
  "node_modules/suncalc3/suncalc.js"(exports2, module2) {
    (function() {
      "use strict";
      const sin = Math.sin;
      const cos = Math.cos;
      const tan = Math.tan;
      const asin = Math.asin;
      const atan = Math.atan2;
      const acos = Math.acos;
      const rad = Math.PI / 180;
      const degr = 180 / Math.PI;
      const dayMs = 864e5;
      const J1970 = 24405875e-1;
      const J2000 = 2451545;
      const lunarDaysMs = 2551442778;
      const firstNewMoon2000 = 94717884e4;
      function fromJulianDay(j) {
        return (j - J1970) * dayMs;
      }
      function toDays(dateValue) {
        return dateValue / dayMs + J1970 - J2000;
      }
      const e = rad * 23.4397;
      function rightAscension(l, b) {
        return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
      }
      function declination(l, b) {
        return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
      }
      function azimuthCalc(H, phi, dec) {
        return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)) + Math.PI;
      }
      function altitudeCalc(H, phi, dec) {
        return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
      }
      function siderealTime(d, lw) {
        return rad * (280.16 + 360.9856235 * d) - lw;
      }
      function astroRefraction(h) {
        if (h < 0) {
          h = 0;
        }
        return 2967e-7 / Math.tan(h + 312536e-8 / (h + 0.08901179));
      }
      function solarMeanAnomaly(d) {
        return rad * (357.5291 + 0.98560028 * d);
      }
      function eclipticLongitude(M) {
        const C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 3e-4 * sin(3 * M));
        const P = rad * 102.9372;
        return M + C + P + Math.PI;
      }
      function sunCoords(d) {
        const M = solarMeanAnomaly(d);
        const L = eclipticLongitude(M);
        return {
          dec: declination(L, 0),
          ra: rightAscension(L, 0)
        };
      }
      const SunCalc = {};
      SunCalc.getPosition = function(dateValue, lat, lng) {
        if (isNaN(lat)) {
          throw new Error("latitude missing");
        }
        if (isNaN(lng)) {
          throw new Error("longitude missing");
        }
        if (dateValue instanceof Date) {
          dateValue = dateValue.valueOf();
        }
        const lw = rad * -lng;
        const phi = rad * lat;
        const d = toDays(dateValue);
        const c = sunCoords(d);
        const H = siderealTime(d, lw) - c.ra;
        const azimuth = azimuthCalc(H, phi, c.dec);
        const altitude = altitudeCalc(H, phi, c.dec);
        return {
          azimuth,
          altitude,
          zenith: 90 * Math.PI / 180 - altitude,
          azimuthDegrees: degr * azimuth,
          altitudeDegrees: degr * altitude,
          zenithDegrees: 90 - degr * altitude,
          declination: c.dec
        };
      };
      const sunTimes = SunCalc.times = [
        { angle: 6, riseName: "goldenHourDawnEnd", setName: "goldenHourDuskStart" },
        // GOLDEN_HOUR_2
        { angle: -0.3, riseName: "sunriseEnd", setName: "sunsetStart" },
        // SUNRISE_END
        { angle: -0.833, riseName: "sunriseStart", setName: "sunsetEnd" },
        // SUNRISE
        { angle: -1, riseName: "goldenHourDawnStart", setName: "goldenHourDuskEnd" },
        // GOLDEN_HOUR_1
        { angle: -4, riseName: "blueHourDawnEnd", setName: "blueHourDuskStart" },
        // BLUE_HOUR
        { angle: -6, riseName: "civilDawn", setName: "civilDusk" },
        // DAWN
        { angle: -8, riseName: "blueHourDawnStart", setName: "blueHourDuskEnd" },
        // BLUE_HOUR
        { angle: -12, riseName: "nauticalDawn", setName: "nauticalDusk" },
        // NAUTIC_DAWN
        { angle: -15, riseName: "amateurDawn", setName: "amateurDusk" },
        { angle: -18, riseName: "astronomicalDawn", setName: "astronomicalDusk" }
        // ASTRO_DAWN
      ];
      const suntimesDeprecated = SunCalc.timesDeprecated = [
        ["dawn", "civilDawn"],
        ["dusk", "civilDusk"],
        ["nightEnd", "astronomicalDawn"],
        ["night", "astronomicalDusk"],
        ["nightStart", "astronomicalDusk"],
        ["goldenHour", "goldenHourDuskStart"],
        ["sunrise", "sunriseStart"],
        ["sunset", "sunsetEnd"],
        ["goldenHourEnd", "goldenHourDawnEnd"],
        ["goldenHourStart", "goldenHourDuskStart"]
      ];
      SunCalc.addTime = function(angleAltitude, riseName, setName, risePos, setPos, degree) {
        let isValid = typeof riseName === "string" && riseName.length > 0 && typeof setName === "string" && setName.length > 0 && typeof angleAltitude === "number";
        if (isValid) {
          const EXP = /^(?![0-9])[a-zA-Z0-9$_]+$/;
          for (let i = 0; i < sunTimes.length; ++i) {
            if (!EXP.test(riseName) || riseName === sunTimes[i].riseName || riseName === sunTimes[i].setName) {
              isValid = false;
              break;
            }
            if (!EXP.test(setName) || setName === sunTimes[i].riseName || setName === sunTimes[i].setName) {
              isValid = false;
              break;
            }
          }
          if (isValid) {
            const angleDeg = degree === false ? angleAltitude * (180 / Math.PI) : angleAltitude;
            sunTimes.push({ angle: angleDeg, riseName, setName, risePos, setPos });
            for (let i = suntimesDeprecated.length - 1; i >= 0; i--) {
              if (suntimesDeprecated[i][0] === riseName || suntimesDeprecated[i][0] === setName) {
                suntimesDeprecated.splice(i, 1);
              }
            }
            return true;
          }
        }
        return false;
      };
      SunCalc.addDeprecatedTimeName = function(alternameName, originalName) {
        let isValid = typeof alternameName === "string" && alternameName.length > 0 && typeof originalName === "string" && originalName.length > 0;
        if (isValid) {
          let hasOrg = false;
          const EXP = /^(?![0-9])[a-zA-Z0-9$_]+$/;
          for (let i = 0; i < sunTimes.length; ++i) {
            if (!EXP.test(alternameName) || alternameName === sunTimes[i].riseName || alternameName === sunTimes[i].setName) {
              isValid = false;
              break;
            }
            if (originalName === sunTimes[i].riseName || originalName === sunTimes[i].setName) {
              hasOrg = true;
            }
          }
          if (isValid && hasOrg) {
            suntimesDeprecated.push([alternameName, originalName]);
            return true;
          }
        }
        return false;
      };
      const J0 = 9e-4;
      function julianCycle(d, lw) {
        return Math.round(d - J0 - lw / (2 * Math.PI));
      }
      function approxTransit(Ht, lw, n) {
        return J0 + (Ht + lw) / (2 * Math.PI) + n;
      }
      function solarTransitJ(ds, M, L) {
        return J2000 + ds + 53e-4 * sin(M) - 69e-4 * sin(2 * L);
      }
      function hourAngle(h, phi, dec) {
        return acos((sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec)));
      }
      function observerAngle(height) {
        return -2.076 * Math.sqrt(height) / 60;
      }
      function getSetJ(h, lw, phi, dec, n, M, L) {
        const w = hourAngle(h, phi, dec);
        const a = approxTransit(w, lw, n);
        return solarTransitJ(a, M, L);
      }
      SunCalc.getSunTimes = function(dateValue, lat, lng, height, addDeprecated, inUTC) {
        if (isNaN(lat)) {
          throw new Error("latitude missing");
        }
        if (isNaN(lng)) {
          throw new Error("longitude missing");
        }
        const t = new Date(dateValue);
        if (inUTC) {
          t.setUTCHours(12, 0, 0, 0);
        } else {
          t.setHours(12, 0, 0, 0);
        }
        const lw = rad * -lng;
        const phi = rad * lat;
        const dh = observerAngle(height || 0);
        const d = toDays(t.valueOf());
        const n = julianCycle(d, lw);
        const ds = approxTransit(0, lw, n);
        const M = solarMeanAnomaly(ds);
        const L = eclipticLongitude(M);
        const dec = declination(L, 0);
        const Jnoon = solarTransitJ(ds, M, L);
        const noonVal = fromJulianDay(Jnoon);
        const nadirVal = fromJulianDay(Jnoon + 0.5);
        const result = {
          solarNoon: {
            value: new Date(noonVal),
            ts: noonVal,
            name: "solarNoon",
            // elevation: 90,
            julian: Jnoon,
            valid: !isNaN(Jnoon),
            pos: sunTimes.length
          },
          nadir: {
            value: new Date(nadirVal),
            ts: nadirVal,
            name: "nadir",
            // elevation: 270,
            julian: Jnoon + 0.5,
            valid: !isNaN(Jnoon),
            pos: sunTimes.length * 2 + 1
          }
        };
        for (let i = 0, len = sunTimes.length; i < len; i += 1) {
          const time = sunTimes[i];
          const sa = time.angle;
          const h0 = (sa + dh) * rad;
          let valid = true;
          let Jset = getSetJ(h0, lw, phi, dec, n, M, L);
          if (isNaN(Jset)) {
            Jset = Jnoon + 0.5;
            valid = false;
          }
          const Jrise = Jnoon - (Jset - Jnoon);
          const v1 = fromJulianDay(Jset);
          const v2 = fromJulianDay(Jrise);
          result[time.setName] = {
            value: new Date(v1),
            ts: v1,
            name: time.setName,
            elevation: sa,
            julian: Jset,
            valid,
            pos: len + i + 1
          };
          result[time.riseName] = {
            value: new Date(v2),
            ts: v2,
            name: time.riseName,
            elevation: sa,
            // (180 + (sa * -1)),
            julian: Jrise,
            valid,
            pos: len - i - 1
          };
        }
        if (addDeprecated) {
          for (let i = 0, len = suntimesDeprecated.length; i < len; i += 1) {
            const time = suntimesDeprecated[i];
            result[time[0]] = Object.assign({}, result[time[1]]);
            result[time[0]].deprecated = true;
            result[time[0]].nameOrg = result[time[1]].pos;
            result[time[0]].posOrg = result[time[0]].pos;
            result[time[0]].pos = -2;
          }
        }
        return result;
      };
      SunCalc.getSunTime = function(dateValue, lat, lng, elevationAngle, height, degree, inUTC) {
        if (isNaN(lat)) {
          throw new Error("latitude missing");
        }
        if (isNaN(lng)) {
          throw new Error("longitude missing");
        }
        if (isNaN(elevationAngle)) {
          throw new Error("elevationAngle missing");
        }
        if (degree) {
          elevationAngle = elevationAngle * rad;
        }
        const t = new Date(dateValue);
        if (inUTC) {
          t.setUTCHours(12, 0, 0, 0);
        } else {
          t.setHours(12, 0, 0, 0);
        }
        const lw = rad * -lng;
        const phi = rad * lat;
        const dh = observerAngle(height || 0);
        const d = toDays(t.valueOf());
        const n = julianCycle(d, lw);
        const ds = approxTransit(0, lw, n);
        const M = solarMeanAnomaly(ds);
        const L = eclipticLongitude(M);
        const dec = declination(L, 0);
        const Jnoon = solarTransitJ(ds, M, L);
        const h0 = (elevationAngle - 0.833 + dh) * rad;
        const Jset = getSetJ(h0, lw, phi, dec, n, M, L);
        const Jrise = Jnoon - (Jset - Jnoon);
        const v1 = fromJulianDay(Jset);
        const v2 = fromJulianDay(Jrise);
        return {
          set: {
            name: "set",
            value: new Date(v1),
            ts: v1,
            elevation: elevationAngle,
            julian: Jset,
            valid: !isNaN(Jset),
            pos: 0
          },
          rise: {
            name: "rise",
            value: new Date(v2),
            ts: v2,
            elevation: elevationAngle,
            // (180 + (elevationAngle * -1)),
            julian: Jrise,
            valid: !isNaN(Jrise),
            pos: 1
          }
        };
      };
      SunCalc.getSunTimeByAzimuth = function(dateValue, lat, lng, nazimuth, degree) {
        if (isNaN(nazimuth)) {
          throw new Error("azimuth missing");
        }
        if (isNaN(lat)) {
          throw new Error("latitude missing");
        }
        if (isNaN(lng)) {
          throw new Error("longitude missing");
        }
        if (degree) {
          nazimuth = nazimuth * rad;
        }
        const date = new Date(dateValue);
        const lw = rad * -lng;
        const phi = rad * lat;
        let dateVal = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).valueOf();
        let addval = dayMs;
        dateVal += addval;
        while (addval > 200) {
          const d = toDays(dateVal);
          const c = sunCoords(d);
          const H = siderealTime(d, lw) - c.ra;
          const nazim = azimuthCalc(H, phi, c.dec);
          addval /= 2;
          if (nazim < nazimuth) {
            dateVal += addval;
          } else {
            dateVal -= addval;
          }
        }
        return new Date(Math.floor(dateVal));
      };
      SunCalc.getSolarTime = function(dateValue, lng, utcOffset) {
        const date = new Date(dateValue);
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1e3;
        const dayOfYear = Math.floor(diff / dayMs);
        const b = 360 / 365 * (dayOfYear - 81) * rad;
        const equationOfTime = 9.87 * sin(2 * b) - 7.53 * cos(b) - 1.5 * sin(b);
        const localSolarTimeMeridian = 15 * utcOffset;
        const timeCorrection = equationOfTime + 4 * (lng - localSolarTimeMeridian);
        const localSolarTime = date.getHours() + timeCorrection / 60 + date.getMinutes() / 60;
        const solarDate = new Date(0, 0);
        solarDate.setMinutes(+localSolarTime * 60);
        return solarDate;
      };
      function moonCoords(d) {
        const L = rad * (218.316 + 13.176396 * d);
        const M = rad * (134.963 + 13.064993 * d);
        const F = rad * (93.272 + 13.22935 * d);
        const l = L + rad * 6.289 * sin(M);
        const b = rad * 5.128 * sin(F);
        const dt = 385001 - 20905 * cos(M);
        return {
          ra: rightAscension(l, b),
          dec: declination(l, b),
          dist: dt
        };
      }
      SunCalc.getMoonPosition = function(dateValue, lat, lng) {
        if (isNaN(lat)) {
          throw new Error("latitude missing");
        }
        if (isNaN(lng)) {
          throw new Error("longitude missing");
        }
        if (dateValue instanceof Date) {
          dateValue = dateValue.valueOf();
        }
        const lw = rad * -lng;
        const phi = rad * lat;
        const d = toDays(dateValue);
        const c = moonCoords(d);
        const H = siderealTime(d, lw) - c.ra;
        let altitude = altitudeCalc(H, phi, c.dec);
        altitude += astroRefraction(altitude);
        const pa = atan(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));
        const azimuth = azimuthCalc(H, phi, c.dec);
        return {
          azimuth,
          altitude,
          azimuthDegrees: degr * azimuth,
          altitudeDegrees: degr * altitude,
          distance: c.dist,
          parallacticAngle: pa,
          parallacticAngleDegrees: degr * pa
        };
      };
      const fractionOfTheMoonCycle = SunCalc.moonCycles = [
        {
          from: 0,
          to: 0.033863193308711,
          id: "newMoon",
          emoji: "\u{1F31A}",
          code: ":new_moon_with_face:",
          name: "New Moon",
          weight: 1,
          css: "wi-moon-new"
        },
        {
          from: 0.033863193308711,
          to: 0.216136806691289,
          id: "waxingCrescentMoon",
          emoji: "\u{1F312}",
          code: ":waxing_crescent_moon:",
          name: "Waxing Crescent",
          weight: 6.3825,
          css: "wi-moon-wax-cres"
        },
        {
          from: 0.216136806691289,
          to: 0.283863193308711,
          id: "firstQuarterMoon",
          emoji: "\u{1F313}",
          code: ":first_quarter_moon:",
          name: "First Quarter",
          weight: 1,
          css: "wi-moon-first-quart"
        },
        {
          from: 0.283863193308711,
          to: 0.466136806691289,
          id: "waxingGibbousMoon",
          emoji: "\u{1F314}",
          code: ":waxing_gibbous_moon:",
          name: "Waxing Gibbous",
          weight: 6.3825,
          css: "wi-moon-wax-gibb"
        },
        {
          from: 0.466136806691289,
          to: 0.533863193308711,
          id: "fullMoon",
          emoji: "\u{1F31D}",
          code: ":full_moon_with_face:",
          name: "Full Moon",
          weight: 1,
          css: "wi-moon-full"
        },
        {
          from: 0.533863193308711,
          to: 0.716136806691289,
          id: "waningGibbousMoon",
          emoji: "\u{1F316}",
          code: ":waning_gibbous_moon:",
          name: "Waning Gibbous",
          weight: 6.3825,
          css: "wi-moon-wan-gibb"
        },
        {
          from: 0.716136806691289,
          to: 0.783863193308711,
          id: "thirdQuarterMoon",
          emoji: "\u{1F317}",
          code: ":last_quarter_moon:",
          name: "third Quarter",
          weight: 1,
          css: "wi-moon-third-quart"
        },
        {
          from: 0.783863193308711,
          to: 0.966136806691289,
          id: "waningCrescentMoon",
          emoji: "\u{1F318}",
          code: ":waning_crescent_moon:",
          name: "Waning Crescent",
          weight: 6.3825,
          css: "wi-moon-wan-cres"
        },
        {
          from: 0.966136806691289,
          to: 1,
          id: "newMoon",
          emoji: "\u{1F31A}",
          code: ":new_moon_with_face:",
          name: "New Moon",
          weight: 1,
          css: "wi-moon-new"
        }
      ];
      SunCalc.getMoonIllumination = function(dateValue) {
        if (dateValue instanceof Date) {
          dateValue = dateValue.valueOf();
        }
        const d = toDays(dateValue);
        const s = sunCoords(d);
        const m = moonCoords(d);
        const sdist = 149598e3;
        const phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra));
        const inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi));
        const angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
        const phaseValue = 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI;
        const diffBase = dateValue - firstNewMoon2000;
        let cycleModMs = diffBase % lunarDaysMs;
        if (cycleModMs < 0) {
          cycleModMs += lunarDaysMs;
        }
        const nextNewMoon = lunarDaysMs - cycleModMs + dateValue;
        let nextFullMoon = lunarDaysMs / 2 - cycleModMs + dateValue;
        if (nextFullMoon < dateValue) {
          nextFullMoon += lunarDaysMs;
        }
        const quater = lunarDaysMs / 4;
        let nextFirstQuarter = quater - cycleModMs + dateValue;
        if (nextFirstQuarter < dateValue) {
          nextFirstQuarter += lunarDaysMs;
        }
        let nextThirdQuarter = lunarDaysMs - quater - cycleModMs + dateValue;
        if (nextThirdQuarter < dateValue) {
          nextThirdQuarter += lunarDaysMs;
        }
        const next = Math.min(nextNewMoon, nextFirstQuarter, nextFullMoon, nextThirdQuarter);
        let phase;
        for (let index = 0; index < fractionOfTheMoonCycle.length; index++) {
          const element = fractionOfTheMoonCycle[index];
          if (phaseValue >= element.from && phaseValue <= element.to) {
            phase = element;
            break;
          }
        }
        return {
          fraction: (1 + cos(inc)) / 2,
          // fraction2: cycleModMs / lunarDaysMs,
          // @ts-ignore
          phase,
          phaseValue,
          angle,
          next: {
            value: next,
            date: new Date(next).toISOString(),
            type: next === nextNewMoon ? "newMoon" : next === nextFirstQuarter ? "firstQuarter" : next === nextFullMoon ? "fullMoon" : "thirdQuarter",
            newMoon: {
              value: nextNewMoon,
              date: new Date(nextNewMoon).toISOString()
            },
            fullMoon: {
              value: nextFullMoon,
              date: new Date(nextFullMoon).toISOString()
            },
            firstQuarter: {
              value: nextFirstQuarter,
              date: new Date(nextFirstQuarter).toISOString()
            },
            thirdQuarter: {
              value: nextThirdQuarter,
              date: new Date(nextThirdQuarter).toISOString()
            }
          }
        };
      };
      SunCalc.getMoonData = function(dateValue, lat, lng) {
        const pos = SunCalc.getMoonPosition(dateValue, lat, lng);
        const illum = SunCalc.getMoonIllumination(dateValue);
        return Object.assign({
          illumination: illum,
          zenithAngle: illum.angle - pos.parallacticAngle
        }, pos);
      };
      function hoursLater(dateValue, h) {
        return dateValue + h * dayMs / 24;
      }
      SunCalc.getMoonTimes = function(dateValue, lat, lng, inUTC) {
        if (isNaN(lat)) {
          throw new Error("latitude missing");
        }
        if (isNaN(lng)) {
          throw new Error("longitude missing");
        }
        const t = new Date(dateValue);
        if (inUTC) {
          t.setUTCHours(0, 0, 0, 0);
        } else {
          t.setHours(0, 0, 0, 0);
        }
        dateValue = t.valueOf();
        const hc = 0.133 * rad;
        let h0 = SunCalc.getMoonPosition(dateValue, lat, lng).altitude - hc;
        let rise;
        let set;
        let ye;
        let d;
        let roots;
        let x1;
        let x2;
        let dx;
        for (let i = 1; i <= 26; i += 2) {
          const h1 = SunCalc.getMoonPosition(hoursLater(dateValue, i), lat, lng).altitude - hc;
          const h2 = SunCalc.getMoonPosition(hoursLater(dateValue, i + 1), lat, lng).altitude - hc;
          const a = (h0 + h2) / 2 - h1;
          const b = (h2 - h0) / 2;
          const xe = -b / (2 * a);
          ye = (a * xe + b) * xe + h1;
          d = b * b - 4 * a * h1;
          roots = 0;
          if (d >= 0) {
            dx = Math.sqrt(d) / (Math.abs(a) * 2);
            x1 = xe - dx;
            x2 = xe + dx;
            if (Math.abs(x1) <= 1) {
              roots++;
            }
            if (Math.abs(x2) <= 1) {
              roots++;
            }
            if (x1 < -1) {
              x1 = x2;
            }
          }
          if (roots === 1) {
            if (h0 < 0) {
              rise = i + x1;
            } else {
              set = i + x1;
            }
          } else if (roots === 2) {
            rise = i + (ye < 0 ? x2 : x1);
            set = i + (ye < 0 ? x1 : x2);
          }
          if (rise && set) {
            break;
          }
          h0 = h2;
        }
        const result = {};
        if (rise) {
          result.rise = new Date(hoursLater(dateValue, rise));
        } else {
          result.rise = NaN;
        }
        if (set) {
          result.set = new Date(hoursLater(dateValue, set));
        } else {
          result.set = NaN;
        }
        if (!rise && !set) {
          if (ye > 0) {
            result.alwaysUp = true;
            result.alwaysDown = false;
          } else {
            result.alwaysUp = false;
            result.alwaysDown = true;
          }
        } else if (rise && set) {
          result.alwaysUp = false;
          result.alwaysDown = false;
          result.highest = new Date(hoursLater(dateValue, Math.min(rise, set) + Math.abs(set - rise) / 2));
        } else {
          result.alwaysUp = false;
          result.alwaysDown = false;
        }
        return result;
      };
      function calcMoonTransit(rize, set) {
        if (rize > set) {
          return new Date(set + (rize - set) / 2);
        }
        return new Date(rize + (set - rize) / 2);
      }
      SunCalc.moonTransit = function(rise, set, lat, lng) {
        let main = null;
        let invert = null;
        const riseDate = new Date(rise);
        const setDate = new Date(set);
        const riseValue = riseDate.getTime();
        const setValue = setDate.getTime();
        const day = setDate.getDate();
        let tempTransitBefore;
        let tempTransitAfter;
        if (rise && set) {
          if (rise < set) {
            main = calcMoonTransit(riseValue, setValue);
          } else {
            invert = calcMoonTransit(riseValue, setValue);
          }
        }
        if (rise) {
          tempTransitAfter = calcMoonTransit(riseValue, SunCalc.getMoonTimes(new Date(riseDate).setDate(day + 1), lat, lng).set.valueOf());
          if (tempTransitAfter.getDate() === day) {
            if (main) {
              invert = tempTransitAfter;
            } else {
              main = tempTransitAfter;
            }
          }
        }
        if (set) {
          tempTransitBefore = calcMoonTransit(setValue, SunCalc.getMoonTimes(new Date(setDate).setDate(day - 1), lat, lng).rise.valueOf());
          if (tempTransitBefore.getDate() === day) {
            main = tempTransitBefore;
          }
        }
        return {
          main,
          invert
        };
      };
      if (typeof exports2 === "object" && typeof module2 !== "undefined") {
        module2.exports = SunCalc;
      } else if (typeof define === "function" && define.amd) {
        define(SunCalc);
      } else {
        window.SunCalc = SunCalc;
      }
    })();
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var import_suncalc3 = __toESM(require_suncalc());
var statusBarItem;
var checkInterval;
function activate(context) {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "theme-scheduler.switchNow";
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(
    vscode.commands.registerCommand("theme-scheduler.enable", () => {
      vscode.workspace.getConfiguration("themeScheduler").update("enabled", true, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage("Theme Scheduler enabled");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("theme-scheduler.disable", () => {
      vscode.workspace.getConfiguration("themeScheduler").update("enabled", false, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage("Theme Scheduler disabled");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("theme-scheduler.switchNow", () => {
      switchTheme();
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("themeScheduler")) {
        restartScheduler();
      }
    })
  );
  startScheduler();
}
function deactivate() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
function getConfig() {
  const config = vscode.workspace.getConfiguration("themeScheduler");
  return {
    enabled: config.get("enabled", true),
    mode: config.get("mode", "sunriseSunset"),
    dayTheme: config.get("dayTheme", "Default Light+"),
    nightTheme: config.get("nightTheme", "Default Dark+"),
    latitude: config.get("latitude", 40.7128),
    longitude: config.get("longitude", -74.006),
    manualDayTime: config.get("manualDayTime", "07:00"),
    manualNightTime: config.get("manualNightTime", "19:00")
  };
}
function isDaytime() {
  const config = getConfig();
  const now = /* @__PURE__ */ new Date();
  if (config.mode === "sunriseSunset") {
    const times = (0, import_suncalc3.getTimes)(now, config.latitude, config.longitude);
    const sunrise = times.sunrise.value;
    const sunset = times.sunset.value;
    return now >= sunrise && now < sunset;
  } else {
    const [dayHour, dayMinute] = config.manualDayTime.split(":").map(Number);
    const [nightHour, nightMinute] = config.manualNightTime.split(":").map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dayMinutes = dayHour * 60 + dayMinute;
    const nightMinutes = nightHour * 60 + nightMinute;
    return currentMinutes >= dayMinutes && currentMinutes < nightMinutes;
  }
}
function switchTheme() {
  const config = getConfig();
  if (!config.enabled) {
    updateStatusBar("disabled");
    return;
  }
  const isDayTime = isDaytime();
  const targetTheme = isDayTime ? config.dayTheme : config.nightTheme;
  const currentTheme = vscode.workspace.getConfiguration("workbench").get("colorTheme");
  if (currentTheme !== targetTheme) {
    vscode.workspace.getConfiguration("workbench").update("colorTheme", targetTheme, vscode.ConfigurationTarget.Global);
  }
  updateStatusBar(isDayTime ? "day" : "night");
}
function updateStatusBar(mode) {
  if (mode === "disabled") {
    statusBarItem.text = "$(color-mode) Theme Auto: Off";
    statusBarItem.tooltip = "Theme Scheduler is disabled. Click to switch theme.";
  } else {
    const icon = mode === "day" ? "$(lightbulb)" : "$(moon)";
    statusBarItem.text = `${icon} ${mode === "day" ? "Day" : "Night"}`;
    statusBarItem.tooltip = `Current: ${mode === "day" ? "Day theme" : "Night theme"}. Click to switch now.`;
  }
  statusBarItem.show();
}
function startScheduler() {
  switchTheme();
  checkInterval = setInterval(() => {
    switchTheme();
  }, 6e4);
}
function restartScheduler() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  startScheduler();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
