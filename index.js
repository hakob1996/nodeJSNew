const htmlFile = require("./generateHTML");
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const puppeteer = require("puppeteer");



const writeFileAsync = util.promisify(fs.writeFile);

function init() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter your GitHub username",
        name: "username"
      },
      {
        type: "input",
        message: "Choose color for your header red blue or greens",
        name: "color"
      }
    ])
    .then(function ({ username, color }) {
      const config = { headers: { accept: "application/json" } };
      const queryUrl = `https://api.github.com/users/${username}`;
      return axios

        .get(queryUrl, config).then(userData => {
          const starURL = `https://api.github.com/users/${username}/starred`;

          axios.get(starURL, config).then(starredRepos => {
            data = {
              picture: userData.data.avatar_url,
              location: userData.data.location,
              gitProfile: userData.data.html_url,
              Blog: userData.data.blog,
              userBio: userData.data.bio,
              repositories: userData.data.public_repos,
              followers: userData.data.followers,
              following: userData.data.following,
              stars: starredRepos.data.length,
              username: username,
              color: color
            };
            htmlFile(data);
            writeHTML(htmlFile(data));
            makePdf(username);

          });
        });
    });
}
const writeHTML = function (htmlFile) {
  writeFileAsync("index.html", htmlFile);
}

init();




async function makePdf(username){
  try {
 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
//the page.goto path should be manually set to where the HTML you want to convert to .pdf lives
  await page.goto("file:/Users/hakmuradyan/Desktop/Homeworks/nodeJS/index.html");
  await page.emulateMedia("screen");
  await page.pdf({
    path: `${username}.pdf`,
    format: "A4",
    printBackground:true,
    landscape:true
  });
  
  console.log("done");
  await browser.exit();
} catch (error) {
console.log("our error");
}
}


