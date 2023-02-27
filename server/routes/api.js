const express = require('express');
const tachyonController = require('../controllers/tachyonController');
const router = express.Router();
const fs = require('fs');

// GET to '/display'
//  - Gives all url's, their titles, and mobile checks from database
router.get('/display',
  tachyonController.display,
  (req, res) => res.status(200).json(res.locals)
);

// GET to '/screenshot/:url'
//  - Use puppeteer to take a screenshot of the url and store in image folder as the title of the page grabbed with puppeteer again and .jpg at the end (title.jpg)
//  - return the title

// GET to '/m/screenshot/:url'
//  - Use puppeteer with isMobile tag
//  - Take a screenshot of the url and store in image folder as the title of the page grabbed with puppeteer again and .jpg at the end (title.jpg)
//  - return the title
router.get('/screenshot/:url', 
  tachyonController.screenshot,
  (req, res) => res.status(200).json(res.locals)
);

router.get('/m/screenshot/:url', 
tachyonController.mobileScreenshot,
(req, res) => res.status(200).json(res.locals)
);

// GET to '/metrics/:url'
//  - Use puppeteer to run lighthouse on url
//  - Grabs the HTML report and stores it in lighthouse folder as the title of the page grabbed with puppeteer again and .html at the end (title.html)
//  - return the title, the performance score, and the accessibility score

// GET to '/m/metrics/:url'
//  - Use puppeteer to run lighthouse on url with isMobile tag
//  - Grabs the HTML report and stores it in lighthouse folder as the title of the page grabbed with puppeteer again and .html at the end (title.html)
//  - return the title, the performance score, and the accessibility score
router.get('/metrics/:url',
  tachyonController.metrics,
  (req, res) => res.status(200).json(res.locals)
);

router.get('/m/metrics/:url',
  tachyonController.mobileMetrics,
  (req, res) => res.status(200).json(res.locals)
);

// GET to '/report/:html'
//  - serves the html file to the page from reports folder
router.get('/report/:url', (req, res) => {
  res.status(200).json(res.locals)
});

// GET to '/'
//  - Clear all files from image folder and from reports folder
router.get('/', (req, res) => {
  res.status(200).json(res.locals)
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
  (req, res) => res.status(200).json(res.locals)
);

router.post('/m/addURL',
  tachyonController.mobileAddURL,
  (req, res) => res.status(200).json(res.locals)
);

// DELETE to '/delete/:id'
//  - deletes id and its corresponding data from database
router.delete('/delete/:id',
  tachyonController.delete,
  (req, res) => res.status(200).json(res.locals)
);