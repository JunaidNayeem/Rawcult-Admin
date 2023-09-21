import React, { useState, useEffect } from "react";
import "./home.scss";
import axios from "axios";
import { Layout, Button, theme, Menu, Collapse, Tag } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CaretRightOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import Logout from "../header/logout";
const { Header, Sider, Content } = Layout;
const { Panel } = Collapse;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "TimeLogs",
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
        ></Content>
      </Layout>
    </Layout>
  );
};

export default Home;
