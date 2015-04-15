var assert = require('assert');

module.exports = function () {

  var helper = this;

this.Given(/^I am signed out$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});

this.When(/^I click on sign in link$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});

this.When(/^I enter my authentication information$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});

this.Then(/^I should be logged in$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});

}