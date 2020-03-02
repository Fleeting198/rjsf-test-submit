var { JSDOM } = require("jsdom");

// Setup the jsdom environment
// @see https://github.com/facebook/react/issues/5046
if (!global.hasOwnProperty("window")) {
  // https://github.com/enzymejs/enzyme/issues/942#issuecomment-314715229
  let jsdom = new JSDOM("<!doctype html><html><body></body></html>");
  let { window } = jsdom;
  let { document } = window;

  // global.document = jsdom.jsdom("<!doctype html><html><body></body></html>");
  global.window = window;
  global.document = document;
  global.navigator = global.window.navigator;
  global.File = global.window.File;
}

// atob
global.atob = require("atob");

// HTML debugging helper
global.d = function d(node) {
  console.log(require("html").prettyPrint(node.outerHTML, { indent_size: 2 }));
};
