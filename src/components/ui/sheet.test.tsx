import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Sheet } from "./sheet";
import { Button } from "./button";
function Fixture({ dirty = false }: { dirty?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      title="Edit material"
      description="Change the demo item."
      dirty={dirty}
      trigger={<Button>Edit</Button>}
    >
      <label htmlFor="material">Material</label>
      <input id="material" />
      <Button>Save</Button>
    </Sheet>
  );
}
test("drawer labels, keyboard focus, Escape and focus return", async () => {
  const user = userEvent.setup();
  render(<Fixture />);
  const trigger = screen.getByRole("button", { name: /^Edit$/ });
  await user.click(trigger);
  expect(screen.getByRole("dialog", { name: "Edit material" })).toBeVisible();
  await user.tab();
  expect(screen.getByLabelText("Material")).toHaveFocus();
  await user.keyboard("{Escape}");
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(trigger).toHaveFocus();
});
test("dirty drawer preserves edits when discard is declined", async () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  const user = userEvent.setup();
  render(<Fixture dirty />);
  await user.click(screen.getByRole("button", { name: /^Edit$/ }));
  await user.type(screen.getByLabelText("Material"), "Paper");
  await user.keyboard("{Escape}");
  expect(screen.getByLabelText("Material")).toHaveValue("Paper");
  expect(confirm).toHaveBeenCalled();
  confirm.mockRestore();
});

test("a portalled drawer form submits once without triggering its parent POS form", async () => {
  const parent = vi.fn();
  const child = vi.fn();
  const user = userEvent.setup();
  render(
    <form onSubmit={parent}>
      <Sheet
        open
        onOpenChange={() => {}}
        title="Quick customer"
        description="Save a customer without submitting the order."
        footer={
          <Button form="quick-customer-test" type="submit">
            Save customer
          </Button>
        }
      >
        <form
          id="quick-customer-test"
          onSubmit={(event) => {
            event.preventDefault();
            child();
          }}
        >
          <label htmlFor="quick-customer-name">Customer</label>
          <input id="quick-customer-name" defaultValue="Fictional customer" />
        </form>
      </Sheet>
    </form>,
  );
  await user.click(screen.getByRole("button", { name: "Save customer" }));
  expect(child).toHaveBeenCalledTimes(1);
  expect(parent).not.toHaveBeenCalled();
});
