// Razorpay JS loader for local dev (for demo)
(function() {
  var script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);
})();
