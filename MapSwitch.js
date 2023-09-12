// ==UserScript==
// @name MapSwitch
// @description Replaces the directions button with a link to Apple Maps instead of Google Maps on the Google search results page. Also redirects to Apple Maps when the current page's url is Google Maps.
// @version 2.3.1
// @icon https://repository-images.githubusercontent.com/690362254/75e9cb48-5f4d-4636-ac4d-8ac3183e61b2
// @updateURL https://raw.githubusercontent.com/Oshanotter/MapSwitch/main/MapSwitch.js
// @namespace Oshanotter
// @author Max Forst
// @include https://www.google.com/search?q=*
// @include https://www.google.com/maps*
// @run-at document-start
// ==/UserScript==



function mapSwitchMain() {
  // the main function that decides when to run the other functions

  var url = window.location.href

  if (url.includes("google.com/maps")){
    // call the openAppleMaps() function to open Apple Maps directly from the Google Maps website
    openAppleMaps()
  } else if (url.includes("google.com/search?q=")){
    // call the replaceInKnowledgeCards() function to replace the urls with Apple Maps urls in the knowledge cards on a Google search results page
    replaceInKnowledgeCards()
  } else {
    // call the findAndReplace() function to find all Google Maps links on the page and replace them with Apple Maps links
    alert("This function is incomplete. Now stopping execution")
    return
    findAndReplace()
  }

}



function replaceInKnowledgeCards() {

  var theAddress = document.querySelector("div.M2Cv8e.xPwsMd > span").innerText

  var theButton = document.querySelector("div.P6Deab")

  var appleMapsDirections = "http://maps.apple.com/?daddr=" + theAddress.replace(/ /g, '+'); //+ "&dirflg=d&t=h"
  // the below url will automatically set the transportation method to driving and set the maps type to hybrid
  // "http://maps.apple.com/?daddr=" + theAddress.replace(/ /g, '+') + "&dirflg=d&t=h"

  // add an event listener to the directions button that will link to Apple Maps
  theButton.addEventListener("click", function() {
    window.location.href = appleMapsDirections;
  });

  // remove the jsaction that would normally link to Google Maps
  theButton.__jsaction.click = "none"


  // now we need to change the data urls of the displayed address and google maps snippet to be Apple Maps
  var appleMapsAddress = "http://maps.apple.com/?address=" + theAddress.replace(/ /g, '+');

  var mapsLocationURLs = document.querySelector("div.QsDR1c").querySelectorAll("a");

  // loop through each <a> tag and change its dataset.url to Apple Maps link
  mapsLocationURLs.forEach(function(theElement) {
    theElement.dataset.url = appleMapsAddress;
  });

}



function openAppleMaps() {
  // opens Apple Maps from the Google Maps website, then returns to the previous page.

  if (window.location.href.includes("google.com/maps/place/")){

    function clickButton() {
      // find and click the button to bring up a menu with the address on it
      var button = document.querySelector("button.ecJbe");
      if (button === null) {
        // Button not found, set a timeout to check again after a certain interval
        setTimeout(clickButton, 500); // Check every 1/2 second (adjust as needed)
    } else {
        // Button found, click it
        button.click();
    }
}
  clickButton();

  function getAddress() {
    // set the timeout for the rest of the code to be 100 miliseconds or else theAddress wont have any value because of the button press

    var theAddress = document.querySelector("div.Io6YTe.fontBodyMedium.kR99db").innerText

    var appleMapsAddress = "http://maps.apple.com/?address=" + theAddress.replace(/ /g, '+');

    // open the url
    window.location.href = appleMapsAddress

    // return to the previous tab
    function returnToPreviousPage() {
      // Go back by two pages in the history
      window.history.go(-2);
      function reloadPage(){
        location.reload()
      }
      setTimeout(reloadPage, 3000);
      // relaod the page doesn't work as intended, but it allows for the system to ask whether to use Apple Maps or not the second time you visit a Google Maps page
    }
    // this only works if it is in a setTimeout function and it takes longer than the getAddress setTimeout function
    // history.back() is called twice because the button press technically loads a new page
    setTimeout(returnToPreviousPage, 2000);

    }
    // set timeout because of the button for 100 milliseconds
    setTimeout(getAddress, 1000);



  } else if (window.location.href.includes("google.com/maps/dir/")){

      if (window.location.href.includes("/@")){
        // split the url by "/@" and get the first item
        var newURL = window.location.href.split('/@')[0]
      } else {
        // split the url by "/data=" and get the first item
        var newURL = window.location.href.split('/data=')[0]
      }

      // split the url by "/maps/dir/" and get the last item
      var newURL = newURL.split('/maps/dir//')[1]

      // create the Apple Maps url
      var newURL = "http://maps.apple.com/?daddr=" + newURL

      // open the url
      window.location.href = newURL

      // return to the previous tab
      function returnToPreviousPage() {
        history.back()
        function reloadPage(){
          location.reload()
        }
        setTimeout(reloadPage, 3000);
        // relaod the page doesn't work as intended, but it allows for the system to ask whether to use Apple Maps or not the second time you visit a Google Maps page
      }
      // this only works if it is in a setTimeout function, even if it is set to 0 seconds (0000 miliseconds)
      setTimeout(returnToPreviousPage, 0000);

  }

}


// call the main() function only after the window is loaded
window.onload = function() {
  mapSwitchMain()
};
