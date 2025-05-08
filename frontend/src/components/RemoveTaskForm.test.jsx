import React from "react"; 
import {render, screen} from "@testing-library/react";
import TaskList from "./Tasks";
import { describe,it,expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest" 
import api from "../api";

vi.mock("../api",() => ({
    default:{
        get: vi.fn(),
        post: vi.fn()
        }
    })
)

describe("Remove Task", () => {
    it("should remove a task and not display it", async () => {
      // All your async logic goes here
        const oldTask = { name: "This is a test" };
        const removeIndex = {index: 1}
        api.get.mockResolvedValueOnce({ data: { tasks: [oldTask] } });
        api.post.mockResolvedValueOnce({ data: removeIndex });
        api.get.mockResolvedValueOnce({ data: { tasks: [] } });

        render(<TaskList/>)
        const button = screen.getByTestId("removeTask");
        const form = screen.getByTestId("removeTaskForm");

        await userEvent.type(form,removeIndex.index.toString())

        await userEvent.click(button)
        
        expect(screen.queryByText(oldTask.name)).not.toBeInTheDocument();
    });
  });
