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

describe("Add task", () => {
    it("should add a task and display it", async () => {
      // All your async logic goes here
        const newTask = { name: "This is a test" };
        api.get.mockResolvedValueOnce({ data: { tasks: [] } });
        api.post.mockResolvedValueOnce({ data: newTask });
        api.get.mockResolvedValueOnce({ data: { tasks: [newTask] } });

        render(<TaskList/>)
        const button = screen.getByTestId("addTask");
        const form = screen.getByTestId("addTaskForm");

        await userEvent.type(form,newTask.name)
        await userEvent.click(button)
        
        const taskList = screen.getByTestId("tasks");
        const taskItem = await screen.findByText(newTask.name);
        expect(taskList).toContainElement(taskItem);
        expect(taskItem).toHaveTextContent(newTask.name);
        expect(taskItem.tagName).toBe("LI");
    });
  });
