var GitHubApi = require('github');
var moment = require('moment');
var Rx = require('rx');
var fs = require('fs');
 
var fileContents = fs.readFileSync('config.json', 'utf8');
var fileJson = JSON.parse(fileContents);

var USERS = fileJson.users;
var GITHUB_AUTH = fileJson.gitHub;

var gitHub = new GitHubApi({
  // required
  version: '3.0.0',
  // optional
  debug: false,
  protocol: 'https',
  host: 'api.github.com', // should be api.github.com for GitHub
  pathPrefix: '', // for some GHEs; none for GitHub
  timeout: 5000
});

gitHub.authenticate({
  type: 'basic',
  username: GITHUB_AUTH.username,
  password: GITHUB_AUTH.password
});

Rx.Observable
  .from(USERS)
  .flatMap(function (user) {
    return Rx.Observable.create(function (observer) {

      gitHub.events.getFromRepo({
        user: user.gitHubUsername,
        repo: 'tiy-front-end-course'
      }, function(error, events) {

        observer.onNext(events);

      });
    });
  })
  .map(function (events) {
    return events.filter(function (event) {
      return (event.type === 'PushEvent');
    });
  })
  .map(function (events) {
    return events[0];
  })
  .subscribe(
    function onCompleted(event) {
      var lastCommitDate = moment(event.created_at).format('dddd, Do of MMMM YYYY, HH:mm');

      console.log('🔥  ' + event.actor.login + ': 👉 ', lastCommitDate);
    }
);