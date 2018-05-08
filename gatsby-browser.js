var FontFaceObserver = require('fontfaceobserver');

// Define phase 1 fonts
const robotoSubset = new FontFaceObserver('Roboto Subset', { weight: 300 });
const robotoSlabSubset = new FontFaceObserver('Roboto Slab Subset', { weight: 400 });

// Define phase 2 fonts
const robotoNormal = new FontFaceObserver('Roboto', { weight: 400 });
const robotoSemiBold = new FontFaceObserver('Roboto', { weight: 600 });
const robotoBold = new FontFaceObserver('Roboto', { weight: 800 });
const robotoLighter = new FontFaceObserver('Roboto', { weight: 200 });

const robotoSlabNormal = new FontFaceObserver('Roboto Slab', { weight: 400 });

exports.onInitialClientRender = () => {
  Promise.all([robotoSubset.load(null, 8000), robotoSlabSubset.load(null, 8000)]).then(function() {
    document.documentElement.classList.add('subset-fonts-enabled');

    Promise.all([
      robotoNormal.load(null, 5000),
      robotoSemiBold.load(null, 5000),
      robotoBold.load(null, 5000),
      robotoLighter.load(null, 5000),
      robotoSlabNormal.load(null, 5000),
    ]).then(function() {
      document.documentElement.classList.remove('subset-fonts-enabled');
      document.documentElement.classList.add('fonts-enabled');
    });
  });
};
