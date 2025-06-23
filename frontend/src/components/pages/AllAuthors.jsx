import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";

const AllAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useContext(Context);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/authors",
          { withCredentials: true }
        );
        setAuthors(data.authors);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch authors"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <article className={mode === "dark" ? "dark-bg all-authors" : "light-bg all-authors"}>
      <h2>ALL AUTHORS</h2>
      <div className="container">
        {loading ? (
          <div style={{ padding: "150px 0" }}>
            <BeatLoader color="gray" size={50} />
          </div>
        ) : authors && authors.length > 0 ? (
          authors.map((author) => (
            <div className="card" key={author._id}>
              <img
                src={author.avatar?.url || "/pic.jpg"}
                alt={`${author.name}_avatar`}
              />
              <h3>{author.name}</h3>
              <p>{author.role}</p>
            </div>
          ))
        ) : (
          <p style={{ padding: "50px 0", fontSize: "18px", color: "gray" }}>
            No authors found.
          </p>
        )}
      </div>
    </article>
  );
};

export default AllAuthors;
