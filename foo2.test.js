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
