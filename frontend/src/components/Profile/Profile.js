import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const auth = useContext(AuthContext);
  const [firstName, setFirstname] = useState();
  const [lastName, setLastname] = useState();
  const [mobile, setMobile] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const [mdal, setModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [id, setId] = useState(null);
  const [signrequest, setSignrequest] = useState();
  const [image, setImgurl] = useState();
  const [file, setFile] = useState();
  const [profilePic, setProfilePic] = useState();
  const [profileImage, setProfileImage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      headers: {
        "x-auth-token": `${auth.token}`,
        "Content-Type": "application/json",
      },
    };
    console.log(auth.id)
    const getProfile = () => {
      axios
        .get(`http://localhost:5000/api/auth/profile/${auth.userId}`, config)
        .then((res) => {
          setId(res.data._id)  
          setProfilePic(res.data.image);
          setFirstname(res.data.firstName);
          setLastname(res.data.lastName);
          setMobile(res.data.mobile);
          setCity(res.data.city);
          setZip(res.data.zip);
        });
    };
    getProfile();
  }, [auth.userId, auth.token, mdal]);

  const editHandler = async (e) => {
    let update;

    e.preventDefault();
    const updatedProfile = {
      firstName: firstName,
      lastName: lastName,
      city: city,
      zip: zip,
      id: auth.userId
    };

    console.log("updated profile",updatedProfile);

    const config = {
      headers: {
        "x-auth-token": `${auth.token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      update = await axios.put(
        `http://localhost:5000/api/auth/profile/edit`,
        updatedProfile,
        config
      );

      console.log(update)

      if (update) {
        window.alert("Profile has been updated");
        setModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onImageChange = async (e) => {
    let file = e.target.files[0];
    if (file.type === "image/jpeg" || file.type === "image/png") {
      let ur = URL.createObjectURL(e.target.files[0]);
      setProfileImage(ur);
      setFile(file);
      let signed = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/aws/signed?filename=${file.name}&filetype=${file.type}`
      );
      if (signed.status !== 200) {
        window.alert("Somthing went wrong please select the image again");
      } else {
        let re = signed.data.signedRequest;
        let reulr = signed.data.url;
        setSignrequest(re);
        setImgurl(reulr);
      }
    } else {
      window.alert("Please upload jpeg or png image");
    }
  };

  function uploadFile(file, signedRequest) {
    const xhr = new XMLHttpRequest();
    if (file) {
      xhr.open("PUT", signedRequest);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return true;
          } else {
            window.alert("Somthing went wrong when uploading the image");
            return false;
          }
        }
      };
      xhr.send(file);
    } else {
      window.alert("No file selected");
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (file != null) {
        uploadFile(file, signrequest);

        const body = {
          image,
        };
        const config = {
          headers: {
            "x-auth-token": `${auth.token}`,
            "Content-Type": "application/json",
          },
        };

        const res = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/auth/profileimage`,
          body,
          config
        );
        if (res.status === 200) {
          window.alert("Profile Picture Updated");
          setFile(null);
          setProfileImage(image);
        }
      }
    } catch (error) {}
  };

const deleteProfile = async () => {
  const body = {
    id: auth.userId,
  };

  console.log(body);

  const config = {
    headers: {
      "x-auth-token": auth.token, 
    },
  };

  if (window.confirm("Are you sure about deleting your profile?")) {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/auth/delete",
        {
          data: body, 
          headers: config.headers,
        }
      );

      if (response.status === 200) {
        window.alert("Profile has been deleted");
        navigate("/home");
        auth.logout();
      } else {
        window.alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error(error);
      window.alert("An error occurred. Please try again later.");
    }
  }
};


  return (
    <div
      style={{
        padding: "50px 0px 0px",
        alignItems: "center",
        display: "flex",
        justifyContent: "center" /* Center horizontally */,
        alignItems: "center",
      }}
    >
      <Modal
        isOpen={mdal}
        onRequestClose={() => setModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(49, 49, 49, 0.8)",
            width: "100%",
            height: "100%",
          },

          content: {
            width: "calc(200px + 15vw)",
            height: "600px",
            borderRadius: "5px",
            color: "black",
            background: "white",
            margin: "0 auto",
            marginTop: "70px",
          },
        }}
      >
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => {
            setModal(false);
          }}
        ></button>
        <h1 style={{ textAlign: "center" }}>Edit Profile</h1>
        <div
          className="row  text-center mb-0 justify-content-center"
          style={{ width: "60%", margin: "auto" }}
        >
          <img
            src={profilePic}
            alt=""
            width="100"
            className="img-fluid  rounded-circle mb-3 img-thumbnail shadow-sm"
          />
        </div>
        {toggle ? (
          <React.Fragment>
            <form
              method="post"
              style={{ display: "flex", margin: "auto" }}
              //onSubmit={handleSubmit
            >
              <div className="form-group" controlId="formGridAddress1">
                <input
                  style={{ display: "flex", margin: "auto" }}
                  type="file"
                  id="custom-file"
                  label="Add image"
                  name="image"
                  accept="image/jpeg, image/png"
                  onChange={(e) => onImageChange(e)}
                  custom
                />
              </div>
              <button
                style={{ marginLeft: "-60px" }}
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Update
              </button>
            </form>
            <button
              style={{ display: "flex", margin: "auto", marginTop: "10px" }}
              className="btn btn-danger"
              onClick={() => setToggle(false)}
            >
              cancel
            </button>
          </React.Fragment>
        ) : (
          <button
            style={{ display: "flex", margin: "auto" }}
            className="btn btn-primary"
            onClick={() => setToggle(true)}
          >
            Change profile picture
          </button>
        )}
        <Form onSubmit={editHandler}>
          <Form.Label style={{ color: "blue" }}>First Name</Form.Label>
          <Form.Control
            type="text"
            defaultValue={firstName}
            onChange={(e) => {
              setFirstname(e.target.value);
            }}
          />

          <Form.Label style={{ color: "blue" }}>Last Name</Form.Label>
          <Form.Control
            type="text"
            defaultValue={lastName}
            onChange={(e) => {
              setLastname(e.target.value);
            }}
          />

          <Form.Label style={{ color: "blue" }}>Mobile</Form.Label>
          <Form.Control
            type="text"
            defaultValue={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
            }}
          />

          <Form.Label style={{ color: "blue" }}>City</Form.Label>
          <Form.Control
            type="text"
            defaultValue={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />

          <Form.Label style={{ color: "blue" }}>Zip</Form.Label>
          <Form.Control
            type="text"
            defaultValue={zip}
            onChange={(e) => {
              setZip(e.target.value);
            }}
          />

          <button
            type="submit"
            style={{
              fontSize: "calc(0.5vw + 12px)",
              borderRadius: "3px",
              padding: "calc(10px + 1vw)",
              color: "#fff",
              background:
                "linear-gradient(to right, #12c2e9, #c471ed, #f64f59)",
              border: "none",
              width: "100%",
              marginTop: "10px",
              fontStyle: "bold",
            }}
          >
            Done
          </button>
        </Form>
      </Modal>

      <div
        style={{
          margin: "100px 50px 0px 50px",
          width: "50%",
          textAlign: "center",
        }}
      >
        <div style={{ float: "right", width: "50%" }}>
          <h1 style={{ color: "black" }}>{firstName} {lastName}</h1>
          {auth.userId !== id ? null : (
            <div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "150px", marginTop: "20px" }}
                onClick={() => {
                  setModal(true);
                }}
              >
                Edit Profile
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{
                  width: "150px",
                  marginTop: "20px",
                  marginLeft: "20px",
                }}
                onClick={() => {
                  deleteProfile();
                }}
              >
                Delete Profile
              </button>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              color: "black",
              marginTop: "30px",
              width: "70%",
            }}
          ></div>
          <div style={{ color: "black", marginTop: "20px" }}>
            <h6 style={{ fontSize: "22px" }}>Mobile : {mobile}</h6>
            <h6 style={{ fontSize: "22px" }}>City : {city}</h6>
            <h6 style={{ fontSize: "22px" }}>Zip : {zip}</h6>
          </div>
        </div>

        <img
          src={profilePic}
          alt=""
          width="100"
          className="ProfilePic"
          style={{ height: "200px", width: "200px" }}
        />

        <hr style={{ backgroundColor: "white", width: "50%" }}></hr>
      </div>
    </div>
  );
};

export default Profile;
