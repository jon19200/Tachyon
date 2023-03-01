const Page = require('../models/tachyonModel');
const puppeteer = require('puppeteer');
const fs = require('fs');
const lighthouse = require('lighthouse');
const {KnownDevices} = require('puppeteer');

const tachyonController = {};

//Find all pages in the database and send them to the client
tachyonController.display = async (req, res, next) => {
  try {
    const display = await Page.find();
    res.locals.display = display;
    next();
  } catch (err) {
    next({
      log: `Error in tachyonController.display: ${err}`,
      message: { err: '505: Could not display' },
    });
  }
};

// Find the page in the database and send the url to lighthouse
// - lighthouse will analyze the page and send the results back to the client
// - the results will be saved as a html file in the lighthouse folder
tachyonController.metrics = async (req, res, next) => {
  try {
    const { url } = await Page.findOne({ _id: req.params.id });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
    const title = await page.title();
    const result = await lighthouse(url, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'html',
      onlyCategories: ['performance', 'accessibility'],
    }, 
    {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 2,
          disabled: false
        },
        emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      }
    }
    );
    await browser.close();
    fs.writeFileSync(`./lighthouse/desktop/${title}.html`, result.report);
    res.locals.performance = result.lhr.categories.performance.score * 100;
    res.locals.accessibility = result.lhr.categories.accessibility.score * 100;
    next();
  } catch (err) {
    res.locals.performance = 'Error, try again';
    res.locals.accessibility = 'please click one image at a time';
    next();
  }
};

tachyonController.mobileMetrics = async (req, res, next) => {
  try {
    const { url } = await Page.findOne({ _id: req.params.id });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const samsung = KnownDevices['Galaxy S9+'];
    await page.emulate(samsung);
    await page.goto(url, { waitUntil: 'load' });
    const title = await page.title();
    const result = await lighthouse(url, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'html',
      onlyCategories: ['performance', 'accessibility'],
      disableDeviceEmulation: false,
    }, {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'mobile',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 846,
          deviceScaleFactor: 2,
          disabled: false
        }}});
    await browser.close();
    fs.writeFileSync(`./lighthouse/mobile/${title}.html`, result.report);
    res.locals.performance = result.lhr.categories.performance.score * 100;
    res.locals.accessibility = result.lhr.categories.accessibility.score * 100;
    next();
  } catch (err) {
    res.locals.performance = 'Error, try again';
    res.locals.accessibility = 'please click one image at a time';
    next();
  }
};

// Find the page in the database and send the url to puppeteer to take a screenshot
// - store the screenshot and send the image to the client
tachyonController.screenshot = async (req, res, next) => {
  try {
    const { url } = await Page.findOne({ _id: req.params.id });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.title();
    page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2, isMobile: false});
    const image = await page.screenshot({ type :  'jpeg', quality: 100});
    await browser.close();
    res.locals.src = image.toString('base64');
    next();
  } catch (err) {
    res.locals.src = 'Error';
    next();
  }
};

tachyonController.mobileScreenshot = async (req, res, next) => {
  try {
    const { url } = await Page.findOne({ _id: req.params.id });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const samsung = KnownDevices['Galaxy S9+'];
    await page.emulate(samsung);
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.title();
    page.viewport({ width: 412, height: 846, deviceScaleFactor: 2, isMobile: true});
    const image = await page.screenshot({ type :  'jpeg', quality: 100});
    await browser.close();
    res.locals.src = image.toString('base64');
    next();
  } catch (err) {
    res.locals.src = 'Error';
    next();
  }
};

// Add a new page to the database after sending the url to puppeteer to scrape the title
tachyonController.addURL = async (req, res, next) => {
  try {
    const { url } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
    const title = await page.title();
    await browser.close();
    const newPage = await Page.create({ title, url: url, isMobile: false });
    res.locals.output = newPage;
    next();
  } catch (err) {
    next({
      log: `Error in tachyonController.addURL: ${err}`,
      message: { err: 'Error adding URL' },
    });
  }
};

tachyonController.addMobileURL = async (req, res, next) => {
  try {
    const { url } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const samsung = KnownDevices['Galaxy S9+'];
    await page.emulate(samsung);
    await page.goto(url, { waitUntil: 'load' });
    const title = await page.title();
    await browser.close();
    const newPage = await Page.create({ title, url: url, isMobile: true });
    res.locals.output = newPage;
    next();
  } catch (err) {
    next({
      log: `Error in tachyonController.addMobileURL: ${err}`,
      message: { err: 'Error adding URL' },
    });
  }
};

// Delete a page from the database
tachyonController.deleteURL = async (req, res, next) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    next();
  } catch (err) {
    next({
      status: 400,
      log: `Error in tachyonController.deleteURL: ${err}`,
      message: { err: 'Error in tachyonController.deleteURL' },
    });
  }
};

module.exports = tachyonController;