import { mount, config } from "@vue/test-utils";
import store from "@/store";
import Tags from "../views/Tags";
import AppTable from "@/components/elements/AppTable";

config.global.mocks["$t"] = (msg) => msg;

const mockRoute = {
  query: {
    page: "12345",
  },
};

const mockRouter = {
  replace: jest.fn(),
};

describe("Tags page", () => {
  test("errors filled if data is empty", async () => {
    const wrapper = mount(Tags, {
      global: {
        plugins: [store],
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
      },
    });

    const form = wrapper.find('[data-test="form"]');
    await form.trigger("submit.prevent");
    expect(wrapper.vm.errors.title).toBeTruthy();
    expect(wrapper.vm.errors.backgroundColor).toBeTruthy();
  });

  test("edit tag filled properties", () => {
    const wrapper = mount(Tags, {
      global: {
        plugins: [store],
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
      },
    });

    const table = wrapper.findComponent(AppTable);
    table.vm.$emit("clickEdit", { item: { _id: "_id" } });

    expect(wrapper.vm.editItemId).toBe("_id");
  });
});
