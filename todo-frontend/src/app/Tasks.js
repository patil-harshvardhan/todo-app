import React, { useEffect, useContext, useState } from "react";
import axiosInstance from "./axios";
import toast from "react-hot-toast";
import { Loader } from "./Utils";
import CollectionContext from "./context/CollectionContext";
import TaskContext from "./context/TaskContext";
import TaskItem from "./TaskItem";
import DonutChart from "./DonutChart";
import NewTask from "./NewTask";

export default function Tasks() {
  const { selectedCollection } = useContext(CollectionContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for search, sort, and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("created"); // 'title', 'created', 'completed'
  const [filterOption, setFilterOption] = useState("all"); // 'all', 'completed', 'incomplete'

  useEffect(() => {
    if (selectedCollection) fetchTasks();
  }, [selectedCollection]);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(
        `/tasks/${selectedCollection._id}`
      );
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  // Filter, search, and sort tasks
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) => {
      if (filterOption === "completed") return task.completed;
      if (filterOption === "incomplete") return !task.completed;
      return true; // 'all'
    })
    .sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "created")
        return new Date(a.created) - new Date(b.created);
      if (sortOption === "completed")
        return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
      return 0;
    });

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <DonutChart />

          {/* Search, Sort, and Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center my-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] border border-slate-300 p-2 rounded"
            />

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="flex-1 min-w-[150px] border border-slate-300 p-2 rounded"
            >
              <option value="title">Sort by Title</option>
              <option value="created">Sort by Created Date</option>
              <option value="completed">Sort by Completion Status</option>
            </select>

            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="flex-1 min-w-[150px] border border-slate-300 p-2 rounded"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          {/* Render Tasks */}
          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            <NewTask />
            {filteredTasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        </>
      )}
    </TaskContext.Provider>
  );
}
