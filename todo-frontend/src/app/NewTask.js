import React, { useState, useContext } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import axiosInstance from "./axios";
import { toast } from "react-hot-toast";
import CollectionContext from "./context/CollectionContext";
import TaskContext from "./context/TaskContext";

export default function NewTask() {
  const [createClicked, setCreateClicked] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { selectedCollection } = useContext(CollectionContext);
  const { fetchTasks } = useContext(TaskContext);

  const handleCreateTask = async () => {
    if (title && description) {
      try {
        const res = await axiosInstance.post(
          `/tasks/${selectedCollection._id}`,
          {
            title,
            description,
          }
        );
        if (res.status === 201) {
          setTitle("");
          setDescription("");
          setCreateClicked(false);
          toast.success("Task created successfully");
          fetchTasks();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to create task");
      }
    }
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-4 border border-slate-300">
      {!createClicked ? (
        <div className=" mt-2 mb-4 flex items-center ">
          <FaRegPlusSquare
            size={"20px"}
            className="rounded shadow hover:shadow-md border border-slate-300 h-5 w-5 cursor-pointer relative"
            onClick={() => setCreateClicked(!createClicked)}
          />
          <span
            className="cursor-pointer ml-2 text-slate-600 text-sm"
            onClick={() => setCreateClicked(!createClicked)}
          >
            Create New Task
          </span>
        </div>
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
            onClick={handleCreateTask}
            className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
            disabled={!title || !description}
          >
            Create
          </button>
          <button
            onClick={() => setCreateClicked(!createClicked)}
            className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
