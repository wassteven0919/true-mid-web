import { useEffect, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import services from "../services";

const cookies = document.cookie.split(";").reduce((acc, curr) => {
  const [key, value] = curr.trim().split("=");
  acc[key] = value;
  return acc;
}, {});

function ChatPage() {
        const [messageData, setMessageData] = useState({ message: "" });
        const [messageList, setMessageList] = useState([]);
        const [userInfo, setUserInfo] = useState(null);
        const username = cookies.username;
        const getPassword = cookies.userpassword;

        useEffect(() => {
                const isLoggedIn = cookies.isLoggedIn;
                if (isLoggedIn && username) {
                        services.user
                                .signInAccount({ name: username, password: getPassword })
                                .then((data) => {
                                        setUserInfo(data);
                                });
                }
                services.user.getAllMessages().then((data) => {
                        setMessageList(data);
                });
        }, []);

        const handleTextInputChange = ({ target: { name, value } }) => {
                setMessageData((prev) => ({
                        ...prev,
                        [name]: value,
                }));
        };

        const handleFormSubmit = (event) => {
                event.preventDefault();
                if (!messageData.message) {
                        return;
                }
                services.user
                        .postMessage({ name: username,password: getPassword,message: messageData.message })
                        .then((data) => {
                                setMessageList((prev) => [data, ...prev]);
                                setMessageData({ message: "" });
                        });
        };

        const handleDeleteClick = (messageId) => {
                services.user.deleteMessage({ name: username,password: getPassword, id: messageId }).then(() => {
                        setMessageList((prev) => prev.filter((message) => message.id !== messageId));
                });
        };

        return (
                <>
                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                <div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Welcome back, {username}!
                </h2>
                </div>
                <div>
                {userInfo && (
                        <div>
                        <img
                        className="mx-auto h-240 w-240 rounded-full cursor-pointer object-cover"
                        src={userInfo.image_url}
                        alt="Profile picture"
                        />
                        <p className="text-center mt-2 text-sm font-medium text-gray-600">
                        </p>
                        </div>
                )}
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                <div className="-space-y-px rounded-md shadow-sm">
                <div>
                <label htmlFor="message" className="sr-only">
                Message
                </label>
                <textarea
                name="message"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Leave a message..."
                value={messageData.message}
                onChange={handleTextInputChange}
                />
                </div>
                </div>
                <div>
                <button
                type="submit"
                className="group relative flex w-full justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Post
                </button>
                </div>
                </form>
                </div>
                </div>
                <div className="max-w-lg mx-auto my-8">
                {messageList.map((message) => (
                        <div key={message.id} className="flex items-start space-x-2">
                        <img
                        src={message.user.image_url}
                        alt="Profile picture"
                        className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                        <h4 className="text-lg font-bold">{message.user.name}</h4>
                        <p className="text-gray-600">{message.messages}</p>
                        {username === message.user.name && (
                                <button
                                className="text-gray-400 text-sm hover:text-red-500"
                                onClick={() => handleDeleteClick(message.id)}
                                >
                                Delete
                                </button>
                        )}
                        </div>
                        </div>
                ))}
                </div>
                </>
        );
}
export default ChatPage;
