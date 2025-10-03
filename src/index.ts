import CryptoJS from "crypto-js";
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import {
  ApiRequestDeleteOptions, ApiRequestGetOptions, ApiRequestPostOptions, ApiRequestPutOptions, ApiResponseDeleteData,
  ApiResponseGetData, ApiResponseGetListData, ApiResponsePostData, ApiResponsePutData,
} from './api';
import { Where } from './api/query';
import { ApiClientGetOptions, ApiClientUtils, BaseApiClient, IApiClientResult } from "./apiClient";
import { PeriodOptionsNames, periodOptions } from './dateTime';

export {
  ApiClientGetOptions, ApiClientUtils, ApiRequestDeleteOptions, ApiRequestGetOptions, ApiRequestPostOptions, ApiRequestPutOptions, ApiResponseDeleteData,
  ApiResponseGetData, ApiResponseGetListData, ApiResponsePostData, ApiResponsePutData, BaseApiClient, IApiClientResult,
  PeriodOptionsNames, Where, periodOptions, 
};

export const showDebugLog = false

// LAYOUT
const screenResolutionFactor: number = 0;

export class ScreenResolutions {
  static xs = 600 - screenResolutionFactor;
  static sm = 960 - screenResolutionFactor;
  static md = 1280 - screenResolutionFactor;
  static lg = 1920 - screenResolutionFactor;
  static xl = 1921 - screenResolutionFactor;

  static getCurrent = (): ScreenResolutions => {
    let width = window.innerHeight;
    return width <= ScreenResolutions.xs
      ? ScreenResolutions.xs
      : width > ScreenResolutions.xs && width <= ScreenResolutions.sm
        ? ScreenResolutions.sm
        : width > ScreenResolutions.sm && width <= ScreenResolutions.md
          ? ScreenResolutions.md
          : width > ScreenResolutions.md && width <= ScreenResolutions.lg
            ? ScreenResolutions.lg
            : ScreenResolutions.xl;
  }
}

// WEB
export class WebUtils {
  static setCookie(cname: string, cvalue: string, exdays: number) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  static getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  static deleteCookie(cname: string) {
    let d = new Date();
    d.setTime(d.getTime() - (24 * 60 * 60 * 1000)); // Define a data de expiração para um dia atrás
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
  }

  static getCookieObj<T extends object>(cname: string): T | undefined {
    const resultStr = WebUtils.getCookie(cname)
    if (resultStr)
      return JSON.parse(resultStr) as T
    return undefined
  }

  static getUrlParams(url: string): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    const urlParts = url.split('?');

    if (urlParts.length > 1) {
      const queryString = urlParts[1];
      const pairs = queryString.split('&');

      pairs.forEach(pair => {
        const keyValue = pair.split('=');
        const key = decodeURIComponent(keyValue[0]);
        const value = decodeURIComponent(keyValue[1]);
        params[key] = value;
      });
    }

    return params;
  }
}

// STRINGS
export class StringUtils {
  static getInitLetters = (text: string, onlyFirstAndLast?: boolean) => text.indexOf(' ') !== -1 ? text.split(' ').reduce((a, b, index) => {
    let r = String(`${index === 1 ? a[0] : a}${b[0]}`)
    if (onlyFirstAndLast)
      r = `${r[0]}${r[r.length - 1]}`
    return r
  }) : onlyFirstAndLast ? `${text[0]}${text[text.length - 1]}` : text

  static toBool = (value?: string | undefined): boolean => {
    const truthy: string[] = [
      'true',
      'True',
      '1'
    ]

    return value ? truthy.includes(value) : false
  }

  static onlyNumbers(value: string) {
    return value.replace(/\D/g, "")
  }

  static isEmpty = (value?: string) => {
    return [null, undefined, ''].indexOf(value?.trim()) != -1
  }

  static isNotEmpty = (value?: string) => {
    return [null, undefined, ''].indexOf(value?.trim()) == -1
  }

  // handling error
  static jsonDecode = (str: string) =>
    (_ => { try { return JSON.parse(str); } catch (err) { return undefined; } })()
}

// COLORS
export class ColorUtils {
  // static incColor = (color: string, amt: number) => {
  //   var usePound = false;

  //   if (!color) return color

  //   if (color[0] === "#") {
  //     color = color.slice(1);
  //     usePound = true;
  //   }

  //   var num = parseInt(color, 16);

  //   var r = (num >> 16) + amt;

  //   if (r > 255) r = 255;
  //   else if (r < 0) r = 0;

  //   var b = ((num >> 8) & 0x00FF) + amt;

  //   if (b > 255) b = 255;
  //   else if (b < 0) b = 0;

  //   var g = (num & 0x0000FF) + amt;

  //   if (g > 255) g = 255;
  //   else if (g < 0) g = 0;

  //   var x = b << 8
  //   var y = r << 16
  //   var z = g | (x) | (y)
  //   var result = (z).toString(16)

  //   return (usePound ? "#" : "") + result

  // }

  static incColor(color: string, amt: number): string {
    if (!color) return color.trim();

    const isHex = color.startsWith("#");
    const isRgb = color.startsWith("rgb");
    const isHsl = color.startsWith("hsl");

    if (isHex) {
      // Converte HEX para RGB
      let hex = color.slice(1);
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((char) => char + char)
          .join(""); // Expande #abc para #aabbcc
      }

      let num = parseInt(hex, 16);
      let r = (num >> 16) + amt;
      let g = ((num >> 8) & 0x00ff) + amt;
      let b = (num & 0x0000ff) + amt;

      // Ajusta os valores para estarem entre 0 e 255
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));

      return `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
    }

    if (isRgb) {
      const match = color.match(/\d+/g);
      if (!match) return color;
      let [r, g, b, a] = match.map(Number);

      r = Math.max(0, Math.min(255, r + amt));
      g = Math.max(0, Math.min(255, g + amt));
      b = Math.max(0, Math.min(255, b + amt));

      return a !== undefined ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    }

    if (isHsl) {
      const match = color.match(/(\d+(\.\d+)?)/g);
      if (!match) return color;
      let [h, s, l, a] = match.map(Number);

      l = Math.max(0, Math.min(100, l + (amt / 255) * 100));

      return a !== undefined
        ? `hsla(${h}, ${s}%, ${l}%, ${a})`
        : `hsl(${h}, ${s}%, ${l}%)`;
    }

    return color; // Caso a cor não seja reconhecida
  }

  static randomColorHexStr = () => {
    var x = Math.floor(Math.random() * 256)
    var y = 100 + Math.floor(Math.random() * 256)
    var z = 50 + Math.floor(Math.random() * 256)
    var result = "rgb(" + x + "," + y + "," + z + ")"
    return result
  };

  static randomDarkColorHexStr = () => {
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
    }
    return color;
  }

  // in material, has a function to get highlighted/contrasted color
  static invertColor = (hexTripletColor: any) => {
    if (!hexTripletColor) return null
    var color = hexTripletColor;
    color = color.substring(1); // remove #
    color = parseInt(color, 16); // convert to integer
    color = 0xFFFFFF ^ color; // invert three bytes
    color = color.toString(16); // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color; // prepend #
    return color;
  }
}

// NUMBER
export class NumberUtils {
  /**
   * @deprecated
   */
  static getNumberStr(value: number) {
    return Number(Number(value).toFixed(2)).toLocaleString('pt-br', { minimumFractionDigits: 2 });
  }

  /**
   * @deprecated
   */
  static onlyNumbers = (value: any) => {
    return typeof value == 'string' ? Number(value.replace(/[^0-9]/g, '')) : Number(value)
  }

  static randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

// ARRAY
export class ArrayUtils {
  // select a random item in an array
  static randomItem = (list: any[]) => {
    return list[Math.floor((Math.random() * list.length))];
  }

  // checks if there is at least 1 item from a to b
  static checkArrays = (arrayA: any[], arrayB: any[]) => arrayA?.some(r => arrayB?.indexOf(r) >= 0)

  static intersection = (array1: any[], array2: any[]): any[] => {
    const setArray1 = new Set(array1);
    const result: any[] = [];

    for (const elemento of array2) {
      if (setArray1.has(elemento)) {
        result.push(elemento);
      }
    }

    return result;
  }

  /**
   * @deprecated
   * is similar to intersection function but with lower performance
   */
  static differ = (arrayA: any[] | undefined, arrayB: any[] | undefined) => arrayA?.filter(elem => !arrayB?.includes(elem))
}

// CRYPT
/**
   * @deprecated
   */
export class CryptUtils {
  // NUNCA MUDAR ESSE VALOR
  /**
   * @deprecated
   */
  static secretKey = 'dd6924666ccf03064b22806cfee495c2'

  /**
   * @deprecated 
   */
  static crypt(text: string) {
    const encrypt = CryptoJS.AES.encrypt(text, CryptUtils.secretKey).toString()
    return encrypt
  }

  /**
   * @deprecated 
   */
  static decrypt = (text: string) => {
    const bytes = CryptoJS.AES.decrypt(text, CryptUtils.secretKey)
    const decrypt = bytes.toString(CryptoJS.enc.Utf8)
    return decrypt
  }

  /**
   * @deprecated 
   */
  static cryptMD5(text: string) {
    // var hash = MD5.generate(CryptUtils.secretKey + text);
    var hash = CryptoJS.MD5(CryptUtils.secretKey + text).toString()
    return hash
  }

  /**
   * @deprecated
   */
  static parseJwt(token: any) {
    if (token) {
      var a = token.split('.')
      if (a.length >= 2) {
        var base64Payload = a[1];
        var payload = Buffer.from(base64Payload, 'base64');
        return JSON.parse(payload.toString());
      }
    }
  }
}

// LOCALE
export class LocaleUtils {
  static localeCurrencyMap: Record<string, string> = {
    'pt-BR': 'BRL',
    'en-US': 'USD',
    'en-GB': 'GBP',
    'de-DE': 'EUR',
  }
}

// COMMON
export class CommonUtils {
  // will only work for functions defined with the async keyword, not for functions that return promises without being declared as async.
  // For instance, let's say you have a function like this:
  // function myFunction(): Promise<number> {
  //     return new Promise<number>((resolve, reject) => {
  //         // resolve or reject the promise
  //     });
  // }
  // This function returns a Promise, but it's not an async function. Therefore, myFunction.constructor.name will return "Function", not "AsyncFunction". 
  // So, the isAsync function you provided won't identify it as an async function.
  static isAsync(func: any) {
    return func.constructor && func.constructor.name === 'AsyncFunction'
  }

  // If you specifically want to check whether the return value of a function is a promise, 
  // regardless of whether the function is declared as asynchronous, you will need to use the approach below, 
  // which checks whether the return value has a then method.
  static isPromise(obj: any): obj is Promise<any> {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
  }

  static isNullOrEmpty(some: any) {
    return (typeof some == 'number') ?
      some == undefined || some == null :
      (some || '').toString().trim() === ''
  }

  static isValidCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '')

    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
      return false
    }

    const validateCPF = cpf.split('').map(el => +el)

    const rest = (count: number) => (validateCPF.slice(0, count - 12))
      .reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10 % 11 % 10

    return rest(10) === validateCPF[9] && rest(11) === validateCPF[10]
  }

  static isValidPhone(phone: string) {
    return true
    if (phone.length !== 11 || !!phone.match(/([0-9])\1{10}/)) {
      return false
    } else return true
  }

  static isValidEmail(email: string) {
    return email.indexOf('@') !== -1
  }

  /**
   * @deprecated
   */
  static getNewUuid() {
    return uuid()
  }

  /**
   * @deprecated
   */
  static uuidv7() {
    const UNIX_TS_MS_BITS = 48;
    const VER_DIGIT = "7";
    const SEQ_BITS = 12;
    const VAR = 0b10;
    const VAR_BITS = 2;
    const RAND_BITS = 62;

    let prevTimestamp = -1;
    let seq = 0;

    const timestamp = Math.max(Date.now(), prevTimestamp);
    seq = timestamp === prevTimestamp ? seq + 1 : 0;
    prevTimestamp = timestamp;

    const var_rand = new Uint32Array(2);
    crypto.getRandomValues(var_rand);
    var_rand[0] = (VAR << (32 - VAR_BITS)) | (var_rand[0] >>> VAR_BITS);

    const digits =
      timestamp.toString(16).padStart(UNIX_TS_MS_BITS / 4, "0") +
      VER_DIGIT +
      seq.toString(16).padStart(SEQ_BITS / 4, "0") +
      var_rand[0].toString(16).padStart((VAR_BITS + RAND_BITS) / 2 / 4, "0") +
      var_rand[1].toString(16).padStart((VAR_BITS + RAND_BITS) / 2 / 4, "0");

    return (
      digits.slice(0, 8) +
      "-" +
      digits.slice(8, 12) +
      "-" +
      digits.slice(12, 16) +
      "-" +
      digits.slice(16, 20) +
      "-" +
      digits.slice(20)
    );
  }

  static isObject(value: any): value is { [key: string]: any } {
    return value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
  }

  static exportToCSV = (bodyList: any[], headers?: string[]) => {
    if (!bodyList.length) return;

    // Detecta linguagem dinamicamente
    const getLocale = () => {
      if (typeof navigator !== "undefined" && navigator.language) {
        return navigator.language;
      }
      // Node.js fallback
      return Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
    };

    const locale = getLocale();

    const quoteIfNeeded = (value: any) => {
      if (typeof value === 'string' && (value.includes(';') || value.includes('\n') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      } else if (typeof value == 'number')
        return new Intl.NumberFormat(locale, {
          style: "decimal",
          currency: LocaleUtils.localeCurrencyMap[locale],
        }).format(value);
      return value
    };

    const finalHeaders = headers?.join(';') ?? Object.keys(bodyList[0]).join(';')
    const rows = bodyList.map((item) =>
      Object.values(item)
        .map(value => {
          if (CommonUtils.isObject(value) || Array.isArray(value)) {
            return JSON.stringify(value)
          }
          return quoteIfNeeded(value)
        })
        .join(';')
    ).join('\n')

    const csvContent = `data:text/csv;charset=utf-8,${finalHeaders}\n${rows}`;
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static deepCloneWithSymbols(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    let clone: any;

    if (Array.isArray(obj)) {
      clone = obj.map(item => CommonUtils.deepCloneWithSymbols(item));
    } else {
      clone = {};

      // Copia as propriedades de string
      for (const key of Object.keys(obj)) {
        clone[key] = CommonUtils.deepCloneWithSymbols(obj[key]);
      }

      // Copia as propriedades simbólicas (como Op.and, Op.or)
      for (const sym of Object.getOwnPropertySymbols(obj)) {
        clone[sym] = CommonUtils.deepCloneWithSymbols(obj[sym]);
      }
    }

    return clone;
  }
}

// DATE UTILS
export class DateUtils {
  static todayFromBegin(): Date {
    return moment(new Date()).startOf('day').toDate()
  }

  static todayAtEnd(): Date {
    return moment(new Date()).endOf('day').toDate()
  }
}

// CONSOLE LOG
export enum ConsoleLogColors {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",
  FgGray = "\x1b[90m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
  BgGray = "\x1b[100m",
}

export class ConsoleLogUtils {
  static Reset = "\x1b[0m"
  static Bright = "\x1b[1m"
  static Dim = "\x1b[2m"
  static Underscore = "\x1b[4m"
  static Blink = "\x1b[5m"
  static Reverse = "\x1b[7m"
  static Hidden = "\x1b[8m"

  static FgBlack = "\x1b[30m"
  static FgRed = "\x1b[31m"
  static FgGreen = "\x1b[32m"
  static FgYellow = "\x1b[33m"
  static FgBlue = "\x1b[34m"
  static FgMagenta = "\x1b[35m"
  static FgCyan = "\x1b[36m"
  static FgWhite = "\x1b[37m"
  static FgGray = "\x1b[90m"

  static BgBlack = "\x1b[40m"
  static BgRed = "\x1b[41m"
  static BgGreen = "\x1b[42m"
  static BgYellow = "\x1b[43m"
  static BgBlue = "\x1b[44m"
  static BgMagenta = "\x1b[45m"
  static BgCyan = "\x1b[46m"
  static BgWhite = "\x1b[47m"
  static BgGray = "\x1b[100m"

  static Next = '%s'
  static ErrorTitle = `${ConsoleLogUtils.BgRed}${ConsoleLogUtils.Next}${ConsoleLogUtils.Reset}`
  static ErrorText = `${ConsoleLogUtils.FgRed}${ConsoleLogUtils.Next}${ConsoleLogUtils.Reset}`
  static HighlightTitle = `${ConsoleLogUtils.BgGreen}${ConsoleLogUtils.Next}${ConsoleLogUtils.Reset}`
  static HighlightText = `${ConsoleLogUtils.FgGreen}${ConsoleLogUtils.Next}${ConsoleLogUtils.Reset}`

  static Error = (text: any) => {
    console.log(ConsoleLogUtils.ErrorTitle, 'ERRO:')
    console.log(ConsoleLogUtils.ErrorText, text)
  }

  static Highlight = (args: { text: any, title?: any, textColor?: string, titleColor?: string }) => {
    var textColor = `${args.textColor || ConsoleLogUtils.FgGreen}${ConsoleLogUtils.Next}${ConsoleLogUtils.Reset}`
    var titleColor = `${args.titleColor || ConsoleLogUtils.BgGreen}${ConsoleLogUtils.Next}${ConsoleLogUtils.Reset}`
    if (args.title)
      console.log(titleColor, args.title)
    console.log(textColor, args.text)
  }

  static HighlightProcess = (args: {
    process?: number
  }) => {
    var process = args.process || NumberUtils.randomIntFromInterval(1, 100)

    return process
  }
}
