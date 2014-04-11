chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('game.html', {
    'bounds': {
      'width': 800,
      'height': 500
    }
  });
}); 
