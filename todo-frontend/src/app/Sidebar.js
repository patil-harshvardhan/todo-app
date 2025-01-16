import { useContext, useEffect, useState } from "react";
import { UserProfilePlaceholder } from "./Utils";
import CollectionContext from "./context/CollectionContext";
import axiosInstance from "./axios";
import toast from "react-hot-toast";
import { MdEditSquare, MdDelete } from "react-icons/md";

export default function Sidebar({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getUserCollections = async () => {
    try {
      const res = await axiosInstance.get("/collections");
      if (res.status === 200) {
        setCollections(res.data);
        // Find the selected collection in the fetched collections if not set to default
        const findCollection = selectedCollection
          ? res.data.find(
              (collection) => collection._id === selectedCollection._id
            ) || res.data.find((collection) => collection.name === "Default")
          : res.data.find((collection) => collection.name === "Default");
        setSelectedCollection(findCollection);
      } else {
        toast.error("Failed to fetch collections");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch collections");
    }
  };

  useEffect(() => {
    getUserCollections();
  }, []);

  return (
    <CollectionContext.Provider
      value={{ collections, selectedCollection, getUserCollections }}
    >
      {/* Overlay for small screens */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
        ></div>
      )}

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-50"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-gray-800 text-white`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Sidebar User Profile */}
          <UserProfilePlaceholder />

          {/* Collections */}
          <ul className="space-y-2 my-4">
            {collections.map((collection) => (
              <CollectionItem
                key={collection._id}
                collection={collection}
                setSelectedCollection={setSelectedCollection}
              />
            ))}
          </ul>
          <CreateCollection />
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`relative transition-all ${
          isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
        } sm:ml-64`}
      >
        {children}
      </div>
    </CollectionContext.Provider>
  );
}

function CreateCollection() {
  const [createCollectionClicked, setCreateCollectionClicked] = useState(false);
  const [name, setName] = useState("");
  const { getUserCollections } = useContext(CollectionContext);

  const handleCreateCollection = async () => {
    if (name) {
      try {
        const res = await axiosInstance.post("/collections", { name });
        if (res.status === 201) {
          setName("");
          setCreateCollectionClicked(false);
          toast.success("Collection created successfully");
          getUserCollections();
        }
      } catch (err) {
        toast.error("Failed to create collection");
      }
    } else toast.error("Collection name is required");
  };

  return (
    <div className="w-full flex justify-center">
      {createCollectionClicked ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-slate-300 rounded p-2 text-sm text-black"
          />
          <button
            onClick={handleCreateCollection}
            className="bg-slate-300 text-black px-4 py-2 rounded text-sm"
          >
            Create
          </button>
          <button
            onClick={() => setCreateCollectionClicked(!createCollectionClicked)}
            className="bg-slate-300 text-black px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="bg-slate-300 text-black px-4 py-2 rounded text-sm"
          onClick={() => setCreateCollectionClicked(!createCollectionClicked)}
        >
          Create new collection
        </button>
      )}
    </div>
  );
}

function CollectionItem({ collection, setSelectedCollection }) {
  const { getUserCollections } = useContext(CollectionContext);
  const [editClicked, setEditClicked] = useState(false);
  const [updatedName, setUpdatedName] = useState(collection.name);
  const { selectedCollection } = useContext(CollectionContext);

  const onCollectionDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/collections/${collection._id}`);
      if (res.status === 200) {
        toast.success("Collection deleted successfully");
        getUserCollections();
      }
    } catch (error) {
      toast.error("Failed to delete collection");
    }
  };

  const onCollectionUpdate = async () => {
    if (!updatedName.trim()) {
      toast.error("Collection name cannot be empty.");
      return;
    }
    try {
      const res = await axiosInstance.put(`/collections/${collection._id}`, {
        name: updatedName,
      });
      if (res.status === 200) {
        toast.success("Collection updated successfully");
        setEditClicked(false);
        getUserCollections();
      }
    } catch (error) {
      toast.error("Failed to update collection.");
    }
  };

  return (
    <li
      key={collection._id}
      className={`inline-flex items-center w-full rounded-lg hover:bg-gray-700 px-3 ${
        selectedCollection?._id === collection._id ? "bg-gray-700" : ""
      }`}
    >
      {editClicked ? (
        <div className="flex flex-col gap-2 my-2 w-full">
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="=border border-slate-300 rounded p-2 text-sm text-black"
          />
          <button
            onClick={onCollectionUpdate}
            className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setEditClicked(false)}
            className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <a
            className="cursor-pointer flex items-center p-2 text-gray-300"
            onClick={() => setSelectedCollection(collection)}
          >
            <span>{collection.name}</span>
          </a>
          <span className="ml-auto flex items-center">
            <MdEditSquare
              onClick={() => setEditClicked(true)}
              className="cursor-pointer mr-2"
              size={"20px"}
            />
            <MdDelete
              onClick={() => onCollectionDelete()}
              className="cursor-pointer"
              size={"20px"}
            />
          </span>
        </>
      )}
    </li>
  );
}
