const { Page } = require('../models/tachyonModel');
const puppeteer = require('puppeteer');
const fs = require('fs');
const lighthouse = require('lighthouse');
const {KnownDevices} = require('puppeteer');

const tachyonController = {};

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

tachyonController.metrics = async (req, res, next) => {
  try {
    const { url } = await Page.findOne({ _id: req.params.id });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
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
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      }
    }
    );
    fs.writeFileSync(`./Metrics/Desktop/Lighthouse/${title}.html`, result.report);
    res.locals.performance = result.lhr.categories.performance.score * 100;
    res.locals.accessibility = result.lhr.categories.accessibility.score * 100;
    await browser.close();
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
    const iPhone = KnownDevices['iPhone 6'];
    await page.emulate(iPhone);
    await page.goto(url, { waitUntil: 'networkidle2' });
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
          width: 411,
          height: 731,
          deviceScaleFactor: 2,
          disabled: false
        }}});
    fs.writeFileSync(`./Metrics/Mobile/Lighthouse/${title}.html`, result.report);
    res.locals.performance = result.lhr.categories.performance.score * 100;
    res.locals.accessibility = result.lhr.categories.accessibility.score * 100;
    await browser.close();
    next();
  } catch (err) {
    res.locals.performance = 'Error, try again';
    res.locals.accessibility = 'please click one image at a time';
    next();
  }
};

tachyonController.screenshot = async (req, res, next) => {
  try {
    const { url } = await Page.findOne({ _id: req.params.id });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.title();
    const imagePath = `./Metrics/Desktop/Screenshots/${title}.jpg`;
    await page.screenshot({ path: `${imagePath}` });
    res.locals.src = fs.readFileSync(imagePath, 'base64');
    await browser.close();
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
    const iPhone = KnownDevices['iPhone 6'];
    await page.emulate(iPhone);
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.title();
    const imagePath = `./Metrics/Mobile/Screenshots/${title}.jpg`;
    await page.screenshot({ path: `${imagePath}` });
    res.locals.src = fs.readFileSync(imagePath, 'base64');
    await browser.close();
    next();
  } catch (err) {
    res.locals.src = 'Error';
    next();
  }
};

tachyonController.addURL = async (req, res, next) => {
  try {
    const { url } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.title();
    const newPage = await Page.create({ title, url: url, isMobile: false });
    res.locals.output = newPage;
    await browser.close();
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
    const iPhone = KnownDevices['iPhone 6'];
    await page.emulate(iPhone);
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.title();
    const newPage = await Page.create({ title, url: url, isMobile: true });
    res.locals.output = newPage;
    await browser.close();
    next();
  } catch (err) {
    next({
      log: `Error in tachyonController.addMobileURL: ${err}`,
      message: { err: 'Error adding URL' },
    });
  }
};

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