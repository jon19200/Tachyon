document.addEventListener("DOMContentLoaded", function() {
  var mobileViewButton = document.getElementById("mobileView");
  mobileViewButton.addEventListener("click", function() {
    chrome.tabs.executeScript(null, {
      code: "document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')"
    });
  });
});
