"use client";
import { useEffect, useState } from "react";
import Tasks from "./Tasks";
import DonutChart from "./DonutChart";
import axiosInstance from "./axios";
import toast from "react-hot-toast";
import { Loader } from "./Utils";
import Sidebar from "./Sidebar";
import UserContext from "./context/UserContext";

export default function Home() {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/user");
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch user");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <main>
        <Sidebar>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            {loading ? (
              <Loader />
            ) : (
              <>
                <Tasks />
              </>
            )}
          </div>
        </Sidebar>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </UserContext.Provider>
  );
}
