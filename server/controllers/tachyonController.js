const { Page } = require('../models/tachyonModel');
const puppeteer = require('puppeteer');
const fs = require('fs');
const lighthouse = require('lighthouse');
const {KnownDevices} = require('puppeteer');

const tachyonController = {};

tachyonController.display = async (req, res, next) => {
  const display = await Page.find();
  res.locals.display = display;
  next();
};

tachyonController.metrics = async (req, res, next) => {
  const { url } = await Page.findOne({ _id: req.params.id });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const title = await page.title();
  const imagePath = `./Metrics/Desktop/Screenshots/${title}.jpg`;
  await page.screenshot({ path: `${imagePath}` });
  const result = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'html',
    onlyCategories: ['performance', 'accessibility'],
  }, {
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
      }}});
  fs.writeFileSync(`./Metrics/Desktop/Lighthouse/${title}.html`, result.report);
  res.locals.performance = result.lhr.categories.performance.score * 100;
  res.locals.accessibility = result.lhr.categories.accessibility.score * 100;
  res.locals.src = fs.readFileSync(imagePath, 'base64');
  await browser.close();
  next();
};

tachyonController.mobileMetrics = async (req, res, next) => {
  const { url } = await Page.findOne({ _id: req.params.id });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const iPhone = KnownDevices['iPhone 6'];
  await page.emulate(iPhone);
  // await page.setViewport({
  //   width: 411,
  //   height: 731,
  //   deviceScaleFactor: 2,
  //   isMobile: true,
  //   hasTouch: true,
  //   isLandscape: false
  // });
  await page.goto(url, { waitUntil: 'networkidle2' });
  const title = await page.title();
  const imagePath = `./Metrics/Mobile/Screenshots/${title}.jpg`;
  await page.screenshot({ path: `${imagePath}` });
  const result = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'html',
    onlyCategories: ['performance', 'accessibility'],
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
  res.locals.src = fs.readFileSync(imagePath, 'base64');
  await browser.close();
  next();
};

tachyonController.addURL = async (req, res, next) => {
  const { url } = req.body;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const title = await page.title();
  const newPage = await Page.create({ title, url: url, isMobile: false });
  res.locals.output = newPage;
  await browser.close();
  next();
};

tachyonController.addMobileURL = async (req, res, next) => {
  const { url } = req.body;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const iPhone = KnownDevices['iPhone 6'];
  await page.emulate(iPhone);
  // await page.setViewport({
  //   width: 412,
  //   height: 915,
  //   deviceScaleFactor: 2,
  //   isMobile: true,
  //   hasTouch: true,
  //   isLandscape: false
  // });
  await page.goto(url, { waitUntil: 'networkidle2' });
  const title = await page.title();
  const newPage = await Page.create({ title, url: url, isMobile: true });
  res.locals.output = newPage;
  await browser.close();
  next();
};

tachyonController.deleteURL = async (req, res, next) => {
  const deletedPage = await Page.findByIdAndDelete(req.params.id);
  next();
};

module.exports = tachyonController;