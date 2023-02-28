const express = require('express');
const tachyonController = require('../controllers/tachyonController');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET to '/display'
//  - Gives all url's, their titles, and mobile checks from database
router.get('/display',
  tachyonController.display,
  (req, res) => res.status(200).json(res.locals.display)
);

// GET to '/metrics/:url'
//  - Use puppeteer to run lighthouse on url and grab screenshot
//  - Grabs the HTML report and stores it in lighthouse folder as the title of the page grabbed with puppeteer again and .html at the end (title.html)
//  - return the title, the performance score, and the accessibility score

// GET to '/m/metrics/:url'
//  - Use puppeteer to run lighthouse on url with isMobile tag and grab screenshot
//  - Grabs the HTML report and stores it in lighthouse folder as the title of the page grabbed with puppeteer again and .html at the end (title.html)
//  - return the title, the performance score, and the accessibility score
router.get('/metrics/:id',
  tachyonController.metrics,
  (req, res) => res.status(200).json(res.locals)
);

router.get('/m/metrics/:id',
  tachyonController.mobileMetrics,
  (req, res) => res.status(200).json(res.locals)
);

// GET to '/report/:html'
//  - serves the html file to the page from reports folder
router.get('/report/:title', (req, res) => {
  //res.status(200).sendFile(`./Metrics/Desktop/Lighthouse/${req.params.title}.html`);
  res.status(200).sendFile(path.join(__dirname, `../../Metrics/Desktop/Lighthouse/${req.params.title}.html`));
});

router.get('/m/report/:title', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, `../../Metrics/Desktop/Lighthouse/${req.params.title}.html`));
});

// GET to '/'
//  - Clear all screenshots and lighthouse reports in desktop and mobile folders
router.get('/clear', async (req, res) => {
  if (!fs.existsSync('Metrics')) {
    fs.mkdirSync('Metrics');
    fs.mkdirSync('Metrics/Desktop');
    fs.mkdirSync('Metrics/Desktop/Screenshots');
    fs.mkdirSync('Metrics/Desktop/Lighthouse');
    fs.mkdirSync('Metrics/Mobile');
    fs.mkdirSync('Metrics/Mobile/Screenshots');
    fs.mkdirSync('Metrics/Mobile/Lighthouse');
    res.status(200).send('Created all folders');
  } else {
    for (const file of await fs.readdirSync('Metrics/Desktop/Screenshots')) {
      await fs.unlinkSync(`Metrics/Desktop/Screenshots/${file}`);
    }
    for (const file of await fs.readdirSync('Metrics/Desktop/Lighthouse')) {
      await fs.unlinkSync(`Metrics/Desktop/Lighthouse/${file}`);
    }
    for (const file of await fs.readdirSync('Metrics/Mobile/Screenshots')) {
      await fs.unlinkSync(`Metrics/Mobile/Screenshots/${file}`);
    }
    for (const file of await fs.readdirSync('Metrics/Mobile/Lighthouse')) {
      await fs.unlinkSync(`Metrics/Mobile/Lighthouse/${file}`);
    }
    res.status(200).send('Cleared all screenshots and reports');
  }
});

// POST to '/addURL'
//  - stores title of the page using puppeteer to database as well as URL and isMobile = false
//    use 'page._frameManager._mainFrame.evaluate(() => document.title)' to scrape the title
//    can also use await page.title()
//  - returns the new object

// POST to '/m/addURL'
//  - stores title of the page using puppeteer to database as well as URL and isMobile = true
//    use 'page._frameManager._mainFrame.evaluate(() => document.title)' to scrape the title
//    can also use await page.title()
//  - returns the new object

router.post('/addURL',
  tachyonController.addURL,
  (req, res) => res.status(200).json(res.locals.output)
);

router.post('/m/addURL',
  tachyonController.addMobileURL,
  (req, res) => res.status(200).json(res.locals.output)
);

// DELETE to '/delete/:id'
//  - deletes id and its corresponding data from database
router.delete('/delete/:id',
  tachyonController.deleteURL,
  (req, res) => res.status(200).send('Deleted')
);

module.exports = router;