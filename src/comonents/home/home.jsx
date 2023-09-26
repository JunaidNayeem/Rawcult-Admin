import { useState, useEffect } from "react";
import "./home.scss";
import axios from "axios";
import { Layout, Button, Menu, Table, Spin, Alert, Modal } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  PlusSquareOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";
import Logout from "../header/logout";
const { Header, Sider, Content } = Layout;
// const { Panel } = Collapse;

const Home = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState(null); // State to track API error
  const [manufacturer, setManufacturer] = useState([]);
  const [retailer, setRetailer] = useState([]);
  const [selectedKey, setSelectedKey] = useState(1);
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const headers = { Authorization: `Bearer ${accessToken}` };

  const fetchData = () => {
    // setLoading(true);
    axios
      .get("https://rawcult-be.vercel.app/users", { headers })
      .then((response) => {
        const manufacturerData = response.data.users.filter(
          (val) => val.role === "manufacturer" && val.isApproved
        );
        const retailerData = response.data.users.filter(
          (val) => val.role === "retailer" && val.isApproved
        );
        const notApprovedData = response.data.users.filter(
          (user) => !user.isApproved
        );
        setRequests(notApprovedData);
        setManufacturer(manufacturerData);
        setRetailer(retailerData);
        setLoading(false);
      })
      .catch((error) => {
        error.response.status === 401
          ? setError("Session Expired! Please Logout then Login again...")
          : setError(error.response.data.msg);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling with a timeout function
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Fetch data every 5 seconds

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run this effect only once

  const handleAccept = (requestId) => {
    axios
      .patch(
        `https://rawcult-be.vercel.app/users/adminApproval`,
        { userId: requestId },
        { headers }
      )
      .then((response) => {
        // Handle success (you can update the UI as needed)
        console.log("Request accepted:", response.data);
        const updatedRequests = requests.filter(
          (user) => user._id !== requestId
        );
        setRequests(updatedRequests);

        const updatedManufacturer = manufacturer.filter(
          (user) => user._id !== requestId
        );
        setManufacturer(updatedManufacturer);

        const updatedRetailer = retailer.filter(
          (user) => user._id !== requestId
        );
        setRetailer(updatedRetailer);
      })
      .catch((error) => {
        // Handle error
        console.error("Error accepting request:", error);
      });
  };

  const handleReject = (requestId) => {
    axios
      .delete("https://rawcult-be.vercel.app/users/adminRejection", {
        data: { userId: requestId },
        headers,
      })
      .then((response) => {
        // Handle success (you can update the UI as needed)
        console.log("Request rejected:", response.data);
        const updatedRequests = requests.filter(
          (user) => user._id !== requestId
        );
        setRequests(updatedRequests);

        const updatedManufacturer = manufacturer.filter(
          (user) => user._id !== requestId
        );
        setManufacturer(updatedManufacturer);

        const updatedRetailer = retailer.filter(
          (user) => user._id !== requestId
        );
        setRetailer(updatedRetailer);
      })
      .catch((error) => {
        // Handle error
        console.error("Error rejecting request:", error);
      });
  };

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleHideModal = () => {
    setSelectedUser(null);
    setIsModalVisible(false);
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
    {
      title: "Actions",
      key: "actions",
      className: "registration-table-column",
      render: (text, record) => (
        <span>
          {record.isApproved ? (
            <>
              <Button
                className="btn3"
                danger
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event propagation to the row
                  handleReject(record._id);
                }}
              >
                Delete
              </Button>
              {/* <Button
                className="btn3"
                style={{ marginLeft: "5px" }}
                onClick={() => handlePause(record)}
              >
                Pause
              </Button> */}
            </>
          ) : (
            <>
              <Button
                className="btn3"
                type="primary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event propagation to the row
                  handleAccept(record._id);
                }}
              >
                Accept
              </Button>
              <Button
                className="btn3"
                style={{ marginLeft: "5px" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event propagation to the row
                  handleReject(record._id);
                }}
              >
                Reject
              </Button>
            </>
          )}
        </span>
      ),
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
              style={{ cursor: "pointer" }}
              dataSource={
                (selectedKey === 1 && manufacturer) ||
                (selectedKey === 2 && retailer) ||
                (selectedKey === 3 && requests)
              }
              rowKey="_id"
              onRow={(record) => {
                return {
                  onClick: () => handleShowModal(record), // Handle row click
                };
              }}
            />
          )}
          <Modal
            title="User Details:-"
            visible={isModalVisible}
            onCancel={handleHideModal}
            footer={null}
          >
            {selectedUser && (
              <div>
                <p>Name: {selectedUser.name}</p>
                <p>Email: {selectedUser.email}</p>
                <p>Phone: {selectedUser.phone}</p>
                <p style={{ textTransform: "capitalize" }}>
                  Role: {selectedUser.role}
                </p>
                <p>Aadhaar/Pan: {selectedUser.aadhaarOrPan}</p>
                <p>GST No.: {selectedUser.gstNo}</p>

                {selectedUser.role === "manufacturer" ? (
                  <>
                    <p>Manufacturer Unit: {selectedUser.mfdUnit}</p>
                    <p>Product Deal: {selectedUser.productDeal}</p>
                    <p>Unit Address: {selectedUser.unitAddress}</p>
                  </>
                ) : (
                  <>
                    <p>Shop Name: {selectedUser.shopName}</p>
                    <p>Shop Address: {selectedUser.shopAddress}</p>
                  </>
                )}
                {/* Add other user details as needed */}
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
