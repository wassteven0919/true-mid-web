import { useEffect, useState } from "react";
import services from "../services";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import axios from 'axios';

const cookies = document.cookie.split(";").reduce((acc, curr) => {
  const [key, value] = curr.trim().split("=");
  acc[key] = value;
  return acc;
}, {});

function ProfilePage() {
  const [formData, setFormData] = useState({ username: "" });
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [file, setFile] = useState(null);
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
  }, []);

  const handleTextInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    axios({
      method: "POST",
      url: "https://api.imgur.com/3/image/",
      data: formData,
      headers: {
      Authorization: "Client-ID <type your clientID>",
              Accept: "application/json",
      },
    })
      .then((res) => {
        const imageUrl = res.data.data.link;
              console.log(imageUrl);
        services.user
          .updateImage({ name: username, image_url: imageUrl })
          .then((data) => {
            setMessage(JSON.stringify(data, null, 2));
            setFile(null);
            setUserInfo((prev) => ({
              ...prev,
              image_url: data.image_url,
            }));
          });
      })
      .catch((e) => {
        console.log(e);
        setMessage("Failed to upload image");
      });
  };
return (
<>
<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
<div className="w-full max-w-md space-y-8">
<div>
<img
           className="mx-auto h-12 w-auto"
           src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
           alt="Your Company"
         />
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
<label htmlFor="image" className="sr-only">
Image
</label>
<input
               name="image"
               type="file"
               accept=".jpg,.jpeg,.png"
               required
               className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300       placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               onChange={handleImageChange}
             />
        僅接受jpn,png格式，請注意你的照片會上傳到imgur，請勿上傳機敏照片
</div>
</div>
<div>
<button
             type="submit"
             className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
           >
Update Picture
</button>
</div>
</form>
</div>
</div>
</>
);
}

export default ProfilePage;
