try {
  window.Popper = require('popper.js').default;
  window.$ = window.jQuery = require('jquery');
  window.htmlToPdf = require('html2pdf.js');
  window.ClassicEditor = require('@ckeditor/ckeditor5-build-classic/build/ckeditor');
  window.Chart = require('chart.js');

  require('@fortawesome/fontawesome-free/js/all');
} catch (e) {}
