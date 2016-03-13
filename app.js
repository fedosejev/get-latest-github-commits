var GitHubApi = require('github');
var moment = require('moment');
var Rx = require('rx');
var fs = require('fs');
 
var fileContents = fs.readFileSync('config.json', 'utf8');
var fileJson = JSON.parse(fileContents);

var STUDENTS = fileJson.users;
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

var studentObservable = Rx.Observable
  .from(STUDENTS)
  .flatMap(function (student) {
    return Rx.Observable.create(function (observer) {

      gitHub.events.getFromRepo({
        user: student.gitHubUsername,
        repo: 'tiy-front-end-course'
      }, function(error, response) {

        observer.onNext(response);

      });
    });
  });

studentObservable
  .map(function (responses) {
    return responses.filter(function (response) {
      return (response.type === 'PushEvent');
    });
  })
  .map(function (response) {
    return response[0];
  })
  .subscribe(
    function onCompleted(response) {
      var lastCommit = moment(response.created_at).format('dddd, Do of MMMM YYYY, HH:mm');

      console.log('🔥  ' + response.actor.login + ': 👉 ', lastCommit);
    }
);