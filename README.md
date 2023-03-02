# Tachyon
Displays performance/accessibility scores for specified urls and allows you to compare them side by side. Click on the generated numbers for useful tips. Works for mobile webpages too!
___
How to download:
1. Clone this repository onto your machine.
2. Run 'npm install' in the terminal to download all dependencies.
3. Navigate to server/models/tachyonModel.js
4. Input a mongoDB link to your database in the MONGO_URI variable at line 4 in place of the empty string.
5. Run 'npm run build' to bundle the app into one folder.
5. Run 'npm start' and navigate towards 'localhost:3000/' in your browser.
___
How to use Tachyon:
1. Input a URL into the text field. If you want to see the metrics for the mobile version of the page, click on the checkbox.
2. Click the add button.
3. Wait for your image to load and then click on it to load the metrics below. (click on the title if you wish to navigate to the given URL)
4. Click on the loaded numbers to open up a full report in another tab if desired.
5. Wait for the previous query's numbers to render before starting another.
