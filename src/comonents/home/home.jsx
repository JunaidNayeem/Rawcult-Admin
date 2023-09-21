import React, { useState, useEffect } from "react";
import "./home.scss";
import axios from "axios";
import { Layout, Button, Menu, Collapse, Table, Spin, Alert } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  PlusSquareOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";
import Logout from "../header/logout";
const { Header, Sider, Content } = Layout;
const { Panel } = Collapse;

const Home = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(""); // State to store user's role
  const [userData, setUserData] = useState([]); // State to store user data
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState(null); // State to track API error
  const [manufacturer, setManufacturer] = useState([]);
  const [retailer, setRetailer] = useState([]);
  const [selectedKey, setSelectedKey] = useState(1);
  const [requests, setRequests] = useState([]);

  const headers = { Authorization: `Bearer ${accessToken}` };

  useEffect(() => {
    // Fetch data from the API
    setLoading(true);
    axios
      .get("https://rawcult-be.vercel.app/users", { headers })
      .then((response) => {
        console.log("API Response:", response.data); // Log the response data
        const userData = response.data.users;

        console.log("🚀 ~ file: home.jsx:34 ~ .then ~ response:", response);
        const manufacturerData = response.data.users.filter(
          (val) => val.role === "manufacturer"
        );
        const retailer = response.data.users.filter(
          (val) => val.role === "retailer"
        );
        setManufacturer(manufacturerData);
        setRetailer(retailer);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch the list of PATCH API requests
    axios
      .get("https://rawcult-be.vercel.app/users/adminApproval", { headers })
      .then((response) => {
        console.log("API Response:", response.data);
        const requestList = response.data; // Assuming the response is an array of request objects
        setRequests(requestList);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleAccept = (requestId) => {
    // Send a PATCH request to accept the request with the given ID
    axios
      .patch(
        `https://rawcult-be.vercel.app/users/adminApproval/${headers}/accept`,
        null,
        { headers }
      )
      .then((response) => {
        // Handle success (you can update the UI as needed)
        console.log("Request accepted:", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error accepting request:", error);
      });
  };

  const handleReject = (requestId) => {
    // Send a PATCH request to reject the request with the given ID
    axios
      .patch(
        `https://rawcult-be.vercel.app/users/adminApproval/${headers}/reject`,
        null,
        { headers }
      )
      .then((response) => {
        // Handle success (you can update the UI as needed)
        console.log("Request rejected:", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error rejecting request:", error);
      });
  };

  // Define columns for the user table
  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Product Deal",
      dataIndex: "productDeal",
      key: "productDeal",
    },
    {
      title: "Unit Address",
      dataIndex: "unitAddress",
      key: "unitAddress",
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={(key) => {
            setSelectedKey(Number(key.key));
          }}
          items={[
            {
              key: "1",
              icon: <CarryOutOutlined />,
              label: "Manufacturer",
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Retailer",
            },
            {
              key: "3",
              icon: <PlusSquareOutlined />,
              label: "Requests",
              render: () =>
                requests.map((request) => (
                  <div key={request.id} className="request-item">
                    {/* Display request details here */}
                    <p>Request ID: {request.id}</p>
                    <p>Request Data: {request.data}</p>

                    {/* Accept and Reject buttons */}
                    <button onClick={() => handleAccept(request.id)}>
                      Accept
                    </button>
                    <button onClick={() => handleReject(request.id)}>
                      Reject
                    </button>
                  </div>
                )),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            fontSize: "24px",
          }}
        >
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            RawCult.com
          </div>
          <Logout />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            <Alert message={`Error: ${error}`} type="error" />
          ) : (
            <Table
              columns={userColumns}
              dataSource={selectedKey === 1 ? manufacturer : retailer}
              rowKey="_id" // Specify a unique key for each row
              // Add additional table properties and customization as needed
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
