import { mount } from "@vue/test-utils";
import AppInput from "@/components/elements/AppInput";

describe("AppInput", () => {
  it("initial with filled value", () => {
    const title = "title";
    const wrapper = mount(AppInput, {
      props: {
        modelValue: title,
      },
    });
    const input = wrapper.find("input");
    expect(input.element.value).toEqual(title);
  });

  it("test", () => {});
});
