import { useContext, useState } from "react";
import CollectionContext from "./context/CollectionContext";
import axiosInstance from "./axios";
import { toast } from "react-hot-toast";
import {CustomCheckBox} from "./Utils";
import { MdEditSquare, MdDelete } from "react-icons/md";
import TaskContext from "./context/TaskContext";



export default function TaskItem({ task }) {
    const [editClicked, setEditClicked] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const {selectedCollection} = useContext(CollectionContext);
    const { fetchTasks } = useContext(TaskContext);
  
    const onTaskStatusChange = async () => {
      try {
        const res = await axiosInstance.put(`/tasks/${selectedCollection._id}/${task._id}`, {
          completed: !task.completed,
        });
        if (res.status === 200) {
          toast.success("Task updated successfully");
          fetchTasks();
        }
      } catch (err) {
        toast.error("Failed to update task");
      }
    };
  
    const handleSave = async () => {
      if (!title || !description) {
        toast.error("Title and description are required");
        return;
      }
      try {
        const res = await axiosInstance.put(`/tasks/${selectedCollection._id}/${task._id}`, {
          title,
          description,
        });
        if (res.status === 200) {
          toast.success("Task updated successfully");
          fetchTasks();
          setEditClicked(false);
        }
      } catch (err) {
        toast.error("Failed to update task");
      }
    };
  
    const onTaskDelete = async () => {
      try {
        const res = await axiosInstance.delete(`/tasks/${selectedCollection._id}/${task._id}`);
        if (res.status === 200) {
          toast.success("Task deleted successfully");
          fetchTasks();
        }
      } catch (err) {
        toast.error("Failed to delete task");
      }
    };
  
    return (
      <div className="bg-white rounded-md shadow-lg p-4 border border-slate-300">
        {!editClicked ? (
          <>
            <div className="inline-flex items-center w-full">
              <CustomCheckBox task={task} onChange={onTaskStatusChange} />
              <span className="ml-auto flex items-center">
                <MdEditSquare
                  onClick={() => setEditClicked(!editClicked)}
                  className="cursor-pointer mr-2"
                  size={"20px"}
                />
                <MdDelete
                  onClick={onTaskDelete}
                  className="cursor-pointer"
                  size={"20px"}
                />
              </span>
            </div>
            <div className="p-4 rounded-md border border-slate-300 mt-2 ">
              <p className="text-slate-600 text-sm">{task.description}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-slate-300 rounded p-2 text-sm"
            />
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-slate-300 rounded p-2 text-sm"
            ></textarea>
            <button
              onClick={handleSave}
              className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
              disabled={!title || !description}
            >
              Save
            </button>
            <button
              onClick={() => setEditClicked(!editClicked)}
              className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }