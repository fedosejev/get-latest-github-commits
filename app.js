var GitHubApi = require('github');
var moment = require('moment');
var Rx = require('rx');

var STUDENTS = [
  {
    name: 'Dariusz Franczak',
    gitHubUsername: 'dariusz75'
  },
  {
    name: 'Julie Walker',
    gitHubUsername: 'julieannwalker'
  },
  {
    name: 'Raphael Desoyo',
    gitHubUsername: 'Raparapap'
  },
  {
    name: 'Victor Gabaldon',
    gitHubUsername: 'vicgabal'
  }
];

var gitHub = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  pathPrefix: "", // for some GHEs; none for GitHub
  timeout: 5000,
  headers: {
      "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
  }
});

gitHub.events.getFromRepo({
  // optional:
  // headers: {
  //     "cookie": "blahblah"
  // },
  user: "vicgabal",
  repo: "tiy-front-end-course"
}, function(err, response) {

  var results = response.filter(function (event) {
    if (event.type === 'PushEvent' && event.actor.login === 'vicgabal') {
      return true;
    }

    return false;
  });

  results = results.map(function (event) {
    return moment(event.created_at).format('dddd, Do of MMMM YYYY, HH:mm');
  });

  console.dir(results);
});

function getLatestCommits() {
  STUDENTS.forEach(function () {
    
  });
}