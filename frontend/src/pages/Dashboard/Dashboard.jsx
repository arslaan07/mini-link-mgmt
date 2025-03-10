import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useSelector } from "react-redux";
import api from "../../../api";
import Pagination from "../../Components/Pagination/Pagination"; // Importing the Pagination component
import Loader from "../../Components/Loader/Loader";

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const [totalClicks, setTotalClicks] = useState(
    JSON.parse(localStorage.getItem("totalClicks")) || 0
  );

  const [clicksByDate, setClicksByDate] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("clicksByDate")) || [];
    } catch {
      return [];
    }
  });

  const [clicksByDevice, setClicksByDevice] = useState(
    JSON.parse(localStorage.getItem("deviceClicks")) || []
  );

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(0);

  // Paginated data
  const paginatedData = clicksByDate.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(clicksByDate.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/urls/clickdata", {
          withCredentials: true,
        });

        // Flattening clickData (as it's an array of arrays)
        const allClicks = response.data.clickData.flat();

        // Total Clicks
        setTotalClicks(allClicks.length);
        localStorage.setItem("totalClicks", JSON.stringify(allClicks.length));

        // Clicks by Date
        const dateClicks = {};
        allClicks.forEach((click) => {
          const date = new Date(click.timestamp)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })
            .replace(/\//g, "-");

          dateClicks[date] = (dateClicks[date] || 0) + 1;
        });

        const formattedClicksByDate = Object.entries(dateClicks).map(
          ([date, clicks]) => ({ date, clicks })
        );

        setClicksByDate(formattedClicksByDate);
        localStorage.setItem(
          "clicksByDate",
          JSON.stringify(formattedClicksByDate.slice(0, 5))
        );

        // Clicks by Device
        const deviceClicks = {};
        allClicks.forEach((click) => {
          const device = click.device[0].toUpperCase() + click.device.slice(1, click.device.length)
          deviceClicks[device] = (deviceClicks[device] || 0) + 1;
        });

        const formattedDeviceClicks = Object.entries(deviceClicks).map(
          ([device, clicks]) => ({ device, clicks })
        );

        setClicksByDevice(formattedDeviceClicks);
        localStorage.setItem(
          "deviceClicks",
          JSON.stringify(formattedDeviceClicks)
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Handler to update the page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.container}>
        <div className={styles.dashboard}>
          <div className={styles.heading}>
            <header>Total Clicks</header>
            <header className={styles.clicks}>{totalClicks}</header>
          </div>
          <div className={styles.data}>
            <div className={styles.card}>
              <h2 className={styles.title}>Date-wise Clicks</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={paginatedData}
                  layout="vertical"
                  margin={{ top: 10, right: 25, left: 25, bottom: 10 }}
                >
                  <XAxis type="number" hide={true} />
                  <YAxis
                    type="category"
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      textAnchor: "start",
                      dx: -75,
                      fill: "black",
                    }}
                    width={60}
                  />
                  {/* <Tooltip cursor={{ fill: "transparent" }} /> */}
                  <Bar
                    dataKey="clicks"
                    fill="#0000ff"
                    barSize={20}
                    isAnimationActive={false}
                    name={`bar-${Date.now()}`} // Add a unique name
                  >
                    <LabelList
                      dataKey="clicks"
                      position="right"
                      content={(props) => {
                        const { x, y, value, index } = props;
                        return (
                          <text
                            key={`label-${index}-${value}`} // Add a unique key
                            x="100%"
                            y={y + 15}
                            textAnchor="end"
                            fill="#333"
                            fontSize={16}
                          >
                            {value}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Pagination Component */}
              {
                    totalPages > 1 &&
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage} // Make sure this is correctly passed
              />
              }
            </div>

            {/* Click Devices */}
            <div className={styles.card}>
              <h2 className={styles.title}>Click Devices</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={clicksByDevice}
                  layout="vertical"
                  margin={{ top: 10, right: 35, left: 20, bottom: 10 }}
                  width={80}
                  barGap="2rem"
                >
                  <XAxis type="number" hide={true} />
                  <YAxis
                    type="category"
                    dataKey="device"
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    tick={{
                      textAnchor: "start",
                      dx: -65,
                      fill: "black",
                    }}
                  />
                  {/* <Tooltip cursor={{ fill: "transparent" }} /> */}
                  <Bar dataKey="clicks" fill="#0000ff" barSize={20}>
                    <LabelList
                      dataKey="clicks"
                      position="right"
                      content={(props) => {
                        const { x, y, value } = props;
                        return (
                          <text
                            x="100%" // Align to the far-right side of the chart
                            y={y + 15} // Center vertically
                            textAnchor="end" // Align text to the right
                            fill="#000"
                            fontSize={16}
                          >
                            {value}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
