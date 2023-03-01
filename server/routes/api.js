const express = require('express');
const tachyonController = require('../controllers/tachyonController');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Responds with all data from the database
router.get('/display',
  tachyonController.display,
  (req, res) => res.status(200).json(res.locals.display)
);

// Responds with the analytical data from lighthouse
router.get('/metrics/:id',
  tachyonController.metrics,
  (req, res) => res.status(200).json(res.locals)
);

router.get('/m/metrics/:id',
  tachyonController.mobileMetrics,
  (req, res) => res.status(200).json(res.locals)
);

// Responds with the screenshot of the page
router.get('/screenshot/:id',
  tachyonController.screenshot,
  (req, res) => res.status(200).json(res.locals)
);

router.get('/m/screenshot/:id',
  tachyonController.mobileScreenshot,
  (req, res) => res.status(200).json(res.locals)
);

// Responds with the html report of the lighthouse analysis
router.get('/report/:title', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, `../../lighthouse/desktop/${req.params.title}.html`));
});

router.get('/m/report/:title', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, `../../lighthouse/mobile/${req.params.title}.html`));
});

// Clear all lighthouse reports in desktop and mobile folders
// - if the folders do not exist, create them
router.get('/clear', async (req, res) => {
  if (!fs.existsSync('lighthouse')) {
    fs.mkdirSync('lighthouse');
    fs.mkdirSync('lighthouse/desktop');
    fs.mkdirSync('lighthouse/mobile');
    res.status(200).send('Created all folders');
  } else {
    for (const file of fs.readdirSync('lighthouse/desktop')) {
      fs.unlinkSync(`lighthouse/desktop/${file}`);
    }
    for (const file of fs.readdirSync('lighthouse/mobile')) {
      fs.unlinkSync(`lighthouse/mobile/${file}`);
    }
    res.end();
  }
});

// Add data to the database from the client
router.post('/addURL',
  tachyonController.addURL,
  (req, res) => res.status(200).json(res.locals.output)
);

router.post('/m/addURL',
  tachyonController.addMobileURL,
  (req, res) => res.status(200).json(res.locals.output)
);

// Delete data from the database
router.delete('/delete/:id',
  tachyonController.deleteURL,
  (req, res) => res.status(200).send('Deleted')
);

module.exports = router;