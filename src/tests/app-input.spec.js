import { mount } from "@vue/test-utils";
import AppInput from "@/components/elements/AppInput";
import { config } from "@vue/test-utils";

config.global.mocks["$t"] = (msg) => msg;

const mountWrapper = (options) => {
  return mount(AppInput, options);
};

describe("AppInput", () => {
  test("initial with filled value", () => {
    const title = "title";
    const wrapper = mountWrapper({
      props: {
        modelValue: title,
      },
    });
    const input = wrapper.find('[data-test="input"]');
    expect(input.element.value).toEqual(title);
  });

  test("does not render label", () => {
    const wrapper = mountWrapper();

    expect(wrapper.find('[data-test="label"]').exists()).toBe(false);
  });

  test("does not render error", () => {
    const wrapper = mountWrapper();

    expect(wrapper.find('[data-test="error"]').exists()).toBe(false);
  });

  test("set input value", async () => {
    const wrapper = mountWrapper();

    const value = "test-value";
    const input = wrapper.find('[data-test="input"]');

    await input.setValue(value);

    expect(input.element.value).toBe(value);
  });

  test("emitted update:modelValue", async () => {
    const wrapper = mountWrapper();
    const input = wrapper.find('[data-test="input"]');
    const value = "test-value";

    await input.setValue(value);

    expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
  });

  test("emitted update:modelValue value", async () => {
    const wrapper = mountWrapper();
    const input = wrapper.find('[data-test="input"]');
    const value = "test-value";

    await input.setValue(value);

    expect(wrapper.emitted()["update:modelValue"][0][0]).toBe(value);
  });

  test("type input to be", () => {
    const wrapper = mountWrapper({
      props: {
        typeInput: "password",
      },
    });

    const input = wrapper.find('[data-test="input"]');
    expect(input.attributes().type).toBe("password");
  });

  describe("props to be", () => {
    const props = {
      placeholder: "placeholder",
      typeInput: "password",
      label: "label",
      error: "error",
    };
    const wrapper = mountWrapper({
      props,
    });
    const input = wrapper.find('[data-test="input"]');
    const label = wrapper.find('[data-test="label"]');
    const error = wrapper.find('[data-test="error"]');

    test("typeInput", () => {
      expect(input.attributes().type).toBe(props.typeInput);
    });

    test("placeholder", () => {
      expect(input.attributes().placeholder).toBe(props.placeholder);
    });

    test("label", () => {
      expect(label.text()).toBe(props.label);
    });

    test("error", () => {
      expect(error.text()).toBe(props.error);
    });
  });

  test("id to be defined", () => {
    const wrapper = mountWrapper();

    const input = wrapper.find('[data-test="input"]');
    expect(input.attributes().id).toBeDefined();
  });

  test('label attr "for" equal input id ', () => {
    const wrapper = mountWrapper({
      props: {
        label: "label",
      },
    });
    const input = wrapper.find('[data-test="input"]');
    const label = wrapper.find('[data-test="label"]');
    expect(label.attributes().for).toEqual(input.attributes().id);
  });
});
