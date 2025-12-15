import React, { useEffect, useState, useRef } from "react";
import Avatar from "../../assets/avatar.svg";
import Input from "../../components/Input";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  //Socket
  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id); //call
    socket?.on("getUsers", (users) => {
      console.log("activeUsers :>> ", users);
    });
    socket?.on("getMessage", (data) => {
      console.log("data :>> ", data);
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
  }, [socket]);

  //console.log(messages);
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      setUsers(resData);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const fetchConversations = async () => {
      const res = await fetch(
        `http://localhost:8000/api/conversations/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();
      setConversations(resData);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavoir: "smooth" });
  }, [messages?.messages]);

  const fetchMessages = async (conversationId, receiver) => {
    const res = await fetch(
      `http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    //console.log("resData :>> ", conversationId, " ", user);
    setMessages({ messages: resData, receiver, conversationId });
  };

  const sendMessage = async (e) => {
    socket?.emit("sendMessage", {
      senderId: user?.id,
      receiverId: messages?.receiver?.receiverId,
      message,
      conversationId: message?.conversationId,
    });
    const res = await fetch(`http://localhost:8000/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message: message,
        receiverId: messages?.receiver?.receiverId,
      }),
    });
    const resData = await res.json();
    //console.log('resData :>> ', resData);
    setMessage("");
  };
  //console.log("user :>> ", user);
  return (
    <div className=" w-screen flex ">
      <div className="w-[25%] h-screen bg-secondary">
        <div className="flex justify-center items-center p-4 ">
          <div>
            <img
              src={Avatar}
              width={50}
              height={75}
              className="rounded-full border border-primary p-[2px]"
            />{" "}
          </div>
          <div className="pl-8">
            <h3 className="text-2xl">{user?.fullName}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr className="border-gray-300 border-b-3" />
        <div className="ml-7 mt-10">
          <div className="text-primary text-lg my-8">Messages</div>
          <div>
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }) => {
                return (
                  <div>
                    <div
                      className="flex items-center  cursor-pointer border-gray-300 border-b-2 p-3 hover:bg-[#ebeefa]"
                      onClick={() => fetchMessages(conversationId, user)}
                    >
                      <div>
                        <img
                          src={Avatar}
                          width={50}
                          height={75}
                          className="rounded-full border border-primary p-[2px]"
                        />
                      </div>
                      <div className="pl-8">
                        <h3 className="text-lg">{user.fullName}</h3>
                        <p className="text-sm font-light text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-20">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[50%]  h-screen bg-white flex flex-col items-center">
        {messages?.receiver?.fullName ? (
          <div className="w-[100%]  h-screen bg-white flex flex-col items-center">
            <div className="w-[75%] bg-secondary h-[80px] mt-14 rounded-full flex p-3 shadow-sm">
              <div>
                <img
                  src={Avatar}
                  width={50}
                  height={75}
                  className="rounded-full border border-primary p-[2px]"
                />{" "}
              </div>
              <div className="pl-8 mr-auto">
                <h3 className="text-2xl">{messages?.receiver?.fullName}</h3>
                <p className="text-lg font-light text-gray-500">
                  {messages?.receiver?.email}
                </p>
              </div>

              <div className="p-4 cursor-pointer hover:bg-gray-200 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-phone"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                </svg>
              </div>
            </div>
            <div className="h-[70%]  w-full overflow-x-hidden overflow-y-auto border-b-2 border-gray-300">
              <div className="h-[1000px] px-10 py-14">
                {messages?.messages?.length > 0 ? (
                  messages.messages.map(({ message, user: { id } = {} }) => {
                    return (
                      <>
                        <div
                          className={`w-fit max-w-[70%]  rounded-b-lg  mb-12 p-4 break-words ${
                            id === user?.id
                              ? " text-white bg-primary ml-auto rounded-tl-lg"
                              : " bg-secondary rounded-tr-lg"
                          }`}
                        >
                          {message}
                        </div>
                        <div ref={messageRef}></div>
                      </>
                    );
                  })
                ) : (
                  <div className="text-center mt-20">Start Conversation</div>
                )}
              </div>
            </div>
            <div className="w-full p-10 flex">
              <Input
                placeholder="Enter Message"
                className="w-[80%] h-[100%]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                inputClassName="rounded-full bg-light focus:ring-0 foucus:border:0 outline-none shadow-md border:0 cursor:pointer"
              />
              <div
                className={`ml-2 mt-1 cursor-pointer ${
                  !message && "pointer-events-none"
                }`}
                onClick={() => sendMessage()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-send"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 14l11 -11" />
                  <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                </svg>
              </div>

              <div
                className={`ml-2 mt-1 cursor-pointer ${
                  !message && "pointer-events-none"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-plus"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
                  <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
                  <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
                  <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
                  <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
                  <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
                  <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
                  <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
                  <path d="M9 12h6" />
                  <path d="M12 9v6" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[100%] text-center mt-50 text-semibold ">
            No Contacts Selected
          </div>
        )}
      </div>
      <div className="w-[25%]  h-screen bg-secondary overflow-scroll">
        <div className="px-4 py-4 text-primary text-[30px]">People</div>
        <div>
          {users.length > 0 ? (
            users.map(({ userId, user }) => {
              return (
                <div>
                  <div
                    className="flex items-center  cursor-pointer border-gray-300 border-b-2 p-3 mr-4 hover:bg-[#ebeefa]"
                    onClick={() => fetchMessages("new", user)}
                  >
                    <div>
                      <img
                        src={Avatar}
                        width={50}
                        height={75}
                        className="rounded-full border border-primary p-[2px]"
                      />
                    </div>
                    <div className="pl-8">
                      <h3 className="text-lg">{user?.fullName}</h3>
                      <p className="text-sm font-light text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold mt-20">
              No Conversations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
