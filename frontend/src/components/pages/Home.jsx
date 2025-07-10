import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";

import LatestBlogs from "../miniComponents/LatestBlogs";
import HeroSection from "../miniComponents/HeroSection";
import TrendingBlogs from "../miniComponents/TrendingBlogs";
import PopularAuthors from "../miniComponents/PopularAuthors";
import { Context } from "../../main";

const Home = () => {
  const { mode } = useContext(Context);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/all`, {
          withCredentials: true, // Include cookies if using authentication
        });
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.slice(0, 6);

  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <HeroSection />
      <TrendingBlogs />
      <LatestBlogs heading={"Latest Blogs"} blogs={filteredBlogs} />
      <PopularAuthors />
    </article>
  );
};

export default Home;
