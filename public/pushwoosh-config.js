var Pushwoosh = Pushwoosh || [];

Pushwoosh.push(['init', {
    logLevel: 'debug',
    applicationCode: '957F6-E387B',
    // safariWebsitePushId: 
    defaultNotificationTitle: 'politIQ',
    defaultNotificationImage: './logo-192.png',
    autoSubscribe: false,
    subscribeWidget: {
        enabled: true,
    }
}])

Pushwoosh.getPushToken().then(function(pushToken) {
    console.log('pushToken:', pushToken);
});


    // axios.post('https://cp.pushwoosh.com/json/1.3/registerDevice', {
    //     application: '957F6-E387B',
    //     push_token: pushToken,
    //     hwid: "",
    //     device_type: detectDevice(),
    // })


// TO DO: write code that checks if the user is on safari because safari sux
// function iOS() {

//     var iDevices = [
//       'iPad Simulator',
//       'iPhone Simulator',
//       'iPod Simulator',
//       'iPad',
//       'iPhone',
//       'iPod'
//     ];
  
//     if (!!navigator.platform) {
//       while (iDevices.length) {
//         if (navigator.platform === iDevices.pop()){ return true; }
//       }
//     }
  
//     return false;
// }

// var isChromium = window.chrome;
// var winNav = window.navigator;
// var vendorName = winNav.vendor;
// var isOpera = typeof window.opr !== "undefined";
// var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
// var isIOSChrome = winNav.userAgent.match("CriOS");
// var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);



// const detectDevice = () => {
//     const oniOS = iOS()
//     console.log(oniOS, 'ios?')
//     if (isSafari) {
//         return 10;
//     } if (oniOS) {
//         return 1;
//     } else if (isIOSChrome) {
//         // is Google Chrome on IOS
//         console.log('on chrome')
//         return 11;
//      } else if(
//        isChromium !== null &&
//        typeof isChromium !== "undefined" &&
//        vendorName === "Google Inc." &&
//        isOpera === false &&
//        isIEedge === false
//      ) {
//         // is Google Chrome
//         console.log('also chrome')
//         return 11;
//      } else { 
//         // not Google Chrome 
//         console.log('not chrome')
//      }
// }