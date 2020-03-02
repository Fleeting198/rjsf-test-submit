### Prerequisites

- [x] I have read the [documentation](https://react-jsonschema-form.readthedocs.io/);
- [x] In the case of a bug report, I understand that providing a [SSCCE](http://sscce.org/) example is tremendously useful to the maintainers.
- [ ] Ideally, I'm providing a [sample JSFiddle](https://jsfiddle.net/n1k0/f2y3fq7L/6/) or a [shared playground link](https://rjsf-team.github.io/react-jsonschema-form/) demonstrating the issue.

### Description

I was writing test using Jest + Enzyme for my application and found callback "onSubmit" passed to a rjsf Form is not called with a simulated click on its submit button. The application itself works well.

Following this test github.com/rjsf-team/react-jsonschema-form/blob/master/packages/core/test/Form_test.js#L377, i wrote a small example: github.com/Fleeting198/rjsf-test-submit.

Found out it's something with the jsdom, with v8.3.0 as the [offical test](https://github.com/rjsf-team/react-jsonschema-form/blob/master/packages/core/test/Form_test.js#L377), the test passes. But with v16.2.0, it fails.

In [setup-jsdom.js](https://github.com/rjsf-team/react-jsonschema-form/blob/master/packages/core/test/setup-jsdom.js).
with jsdom@8.3.0:

```javascript
global.document = jsdom.jsdom("<!doctype html><html><body></body></html>");
```

The above line fails at jsdom@16.2.0,
following github.com/enzymejs/enzyme/blob/master/docs/guides/jsdom.md and github.com/enzymejs/enzyme/issues/942#issuecomment-314715229, use the following lines instead:

```javascript
  global.document = new jsdom.JSDOM(
    "<!doctype html><html><body></body></html>"
  ).window.document;
```

Looking into it...

#### The Mocha one

```javascript
import React from "react";
import Form from "react-jsonschema-form";
import { renderIntoDocument } from "react-dom/test-utils";
import { findDOMNode } from "react-dom";

describe("Custom submit buttons", function() {
  it("should submit the form when clicked", function(done) {
    let submitCount = 0;
    function onSubmit() {
      submitCount++;
      if (submitCount === 2) {
        done();
      }
    }

    const comp = renderIntoDocument(
      <Form onSubmit={onSubmit} schema={{}}>
        <button type="submit">Submit</button>
        <button type="submit">Another submit</button>
      </Form>
    );
    const node = findDOMNode(comp);
    const buttons = node.querySelectorAll("button[type=submit]");
    buttons[0].click();
    buttons[1].click();
  });
});
```

outputs:

```shell
    1) should submit the form when clicked


  0 passing (2s)
  1 failing

  1) Custom submit buttons
       should submit the form when clicked:
     Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/Users/fleetingkl/Documents/wp/form-test/foo2.test.js)
```


#### The Jest + Enzyme one

```javascript
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import Form from "react-jsonschema-form";
import { mount } from "enzyme";
Enzyme.configure({ adapter: new Adapter() });

describe("Custom submit buttons", () => {
  it("should submit the form when clicked", () => {
    let submitCount = 0;
    const onSubmit = () => {
      submitCount++;
    };

    const wrapper = mount(
      <Form onSubmit={onSubmit} schema={{}}>
        <button type="submit">Submit</button>
        <button type="submit">Another submit</button>
      </Form>
    );

    expect(wrapper.find('button[type="submit"]')).toHaveLength(2);
    const buttons = wrapper.find('button[type="submit"]');
    buttons.at(0).simulate("click");
    buttons.at(1).simulate("click");
    expect(submitCount).toBe(2);
  });
});
```

outputs:

```shell
    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: 0

      24 |     buttons.at(0).simulate("click");
      25 |     buttons.at(1).simulate("click");
    > 26 |     expect(submitCount).toBe(2);
         |                         ^
      27 |   });
      28 | });
      29 |

      at Object.<anonymous> (foo.test.js:26:25)
```



### Steps to Reproduce

1. Clone my [example](https://github.com/Fleeting198/rjsf-test-submit).
2. `npm install`
3. `npm run test`
4. `npm run test2`

#### Expected behavior

The tests are passed. "onSubmit" is called.

#### Actual behavior

The callback is not called and whatever changes in the callback take no effect.

### Version

  "devDependencies": {
    "@babel/cli": "^7.8.4",
    "@babel/core": "^7.8.6",
    "@babel/preset-env": "^7.8.6",
    "@babel/preset-react": "^7.8.3",
    "babel": "^6.23.0",
    "babel-core": "^6.26.3",
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.2",
    "jest": "^25.1.0",
    "jsdom": "^16.2.0",
    "mocha": "^7.1.0"
  },
  "dependencies": {
    "@babel/register": "^7.8.6",
    "react": "^16.13.0",
    "react-dom": "^16.13.0",
    "react-jsonschema-form": "^1.8.1"
  }