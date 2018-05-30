var path = require('path');
const url = require('url');
const BasePage = require('./base-page');

const LoginPage = Object.create(BasePage, {
  /**
   * define elements
   */
  header: {
    get() {
      return $('.cd-login__header');
    },
  },
  loginBox: {
    get() {
      return $('.cd-login__box');
    },
  },
  email: {
    get() {
      return $('input[type=email]');
    },
  },
  password: {
    get() {
      return $('input[type=password]');
    },
  },
  login: {
    get() {
      return $('input[type=submit]');
    },
  },
  register: {
    get() {
      return $('.cd-login__register');
    },
  },
  forgotPassword: {
    get() {
      return $('.cd-login__forgot-password');
    },
  },
  registerLink: {
    get() {
      return this.register.$('a');
    },
  },
  forgotPasswordLink: {
    get() {
      return this.forgotPassword.$('a');
    },
  },
  emailReqError: {
    get() {
      return $('.cd-login__email-req-err');
    },
  },
  emailFormatError: {
    get() {
      return $('.cd-login__email-format-err');
    },
  },
  passwordReqError: {
    get() {
      return $('.cd-login__password-req-err');
    },
  },
  loginFailed: {
    get() {
      return $('.cd-login__login-failed');
    },
  },
  open: {
    value(query) {
      return BasePage.open.call(this, url.format({ pathname: '/login', query }));
    },
  },
});

module.exports = LoginPage;
