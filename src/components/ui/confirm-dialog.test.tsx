import {useState} from "react";
import {render,screen,waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {test,expect} from "vitest";
import {ConfirmDialog} from "./confirm-dialog";
function Fixture(){const [open,setOpen]=useState(false),[removed,setRemoved]=useState(false);return <main id="main-content" tabIndex={-1}>{!removed&&<button onClick={()=>setOpen(true)}>Deactivate</button>}<ConfirmDialog open={open} onOpenChange={setOpen} title="Deactivate material?" description="The material remains in history." action="Confirm deactivation" onConfirm={()=>setRemoved(true)}/></main>;}
test("confirmation cancel returns focus to the invoking control",async()=>{const user=userEvent.setup();render(<Fixture/>);await user.click(screen.getByRole("button",{name:"Deactivate"}));expect(screen.getByRole("button",{name:"Cancel"})).toHaveFocus();await user.click(screen.getByRole("button",{name:"Cancel"}));await waitFor(()=>expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());expect(screen.getByRole("button",{name:"Deactivate"})).toHaveFocus();});
test("confirmation removal restores a stable main focus target",async()=>{const user=userEvent.setup();render(<Fixture/>);await user.click(screen.getByRole("button",{name:"Deactivate"}));await user.click(screen.getByRole("button",{name:"Confirm deactivation"}));await waitFor(()=>expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());expect(screen.getByRole("main")).toHaveFocus();});
