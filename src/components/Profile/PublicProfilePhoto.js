import React, { Component } from "react";

import { storage } from "../../firebase";

class PublicProfilePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarUrl: "",
      uid: "",
      loading: true
    };
  }

  componentDidMount = () => {
    this.getPhoto();
  };

  componentWillReceiveProps(nextProps) {
    this.getPhoto();
  }

  getPhoto = () => {
    const set = () => {
      this.setState({
        loading: false
        // avatarUrl: `${Placeholder}`
      });
    };
    if (this.props.uid !== "") {
      const imgName = this.props.uid + ".jpg";
      storage.imageRef
        .child(imgName)
        .getDownloadURL()
        .then(url => {
          this.setState({
            avatarUrl: url,
            uid: this.props.uid,
            loading: false
          });
        })
        .catch(function (error) {
          switch (error.code) {
            case "storage/object-not-found":
              set();
              break;
            case "storage/unauthorized":
              set();
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              set();
              // User canceled the upload
              break;
            case "storage/unknown":
              set();
              // Unknown error occurred, inspect the server response
              break;
            default:
              break;
          }
        });
    }
  };

  render() {
    let photoContent;
    if (this.state.avatarUrl === "") {
      photoContent = <div></div>;
    } else {
      photoContent = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <img
            src={this.state.avatarUrl}
            alt="Profile"
            className="public-photo"
          />
        </div>
      );
    }

    return <div> {photoContent}</div>;
  }
}

export default PublicProfilePhoto;
