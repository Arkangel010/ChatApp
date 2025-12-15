import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Banner from "../../components/Banner";
import { useNavigate } from "react-router-dom";
const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: "",
    }),
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data : >> ", data);
    const res = await fetch(
      `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (res.status === 400) {
      alert("Invalid credentials");
    } else {
      const resData = await res.json();
      console.log("data :>> ", resData);
      if (resData.token) {
        localStorage.setItem("user:token", resData.token);
        localStorage.setItem("user:detail", JSON.stringify(resData.user));
        navigate("/");
      }
    }
  };
  const navigate = useNavigate();
  return (
    <div className="bg-[#edf3fc] h-screen flex justify-center items-center">
      <div className="bg-white w-[60%] h-[90%] shadow-lg rounded-lg flex flex-col  items-center p-10">
        <Banner
          className="w-full text-center pb-20"
          headClassName="text-[100px]"
        />
        <form
          className="flex flex-col justify-center items-center w-full"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="text-4xl font-extrabold">
            Welcome {isSignInPage && "Back"}
          </div>
          <div className="text-xl font-light mb-14">
            {isSignInPage
              ? "Sign in to explored"
              : "Sign up now to get started"}
          </div>
          {!isSignInPage && (
            <Input
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              className="mb-6"
              type="text"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            label="Email Address"
            name="email"
            placeholder="Enter your email address"
            className="mb-6"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="mb-14"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button
            label={isSignInPage ? "Sign in" : "Sign up"}
            type="submit"
            className="w-1/2 mb-2"
          />
          <div className="flex">
            {isSignInPage
              ? "Didn't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              className="inline text-primary cursor-pointer underline "
              onClick={() => {
                if (isSignInPage) {
                  navigate("/users/sign_up");
                } else {
                  navigate("/users/sign_in");
                }
              }}
            >
              {isSignInPage ? "Sign up" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
