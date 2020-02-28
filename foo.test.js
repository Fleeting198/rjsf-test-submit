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
      if (submitCount === 2) {
        done();
      }
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
