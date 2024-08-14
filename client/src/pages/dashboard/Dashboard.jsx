// pages/dashboard/Dashboard.js
import React from 'react';
import Notifications from '../../components/Notification';
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Rightbar from '../../components/rightbar/Rightbar';
import './Dashboard.css';
const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="dashboardContainer">
        <Sidebar />
        <div className="createEventForm">
          <Notifications />
          {/* Other dashboard content */}
        </div>
        <Rightbar />
      </div>
    </>
  );
};

export default Dashboard;
