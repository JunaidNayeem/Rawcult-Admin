import React, { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import "./login.scss";

const Login = ({ setIsAuthenticated }) => {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const onFinish = async (values) => {
    try {
      const response = await fetch("https://rawcult-be.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.Email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (data.user.isApproved) {
        const authToken = `${data.accessToken}`;
        const role = `${data.user.role}`;
        localStorage.setItem("accessToken", authToken);
        localStorage.setItem("role", role);
        setIsAuthenticated(true);
        navigate(location?.state ? location?.state?.from?.pathname : "/");
        setAlert(null);
      } else {
        // If authentication fails, show an alert with the error message
        setAlert(<Alert message={data.message} type="error" />);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="login-container">
      <Card>
        <h2>Login</h2>
        {alert}
        <Form
          name="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="Email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
