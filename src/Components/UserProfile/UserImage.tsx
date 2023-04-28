

const UserImage = () => {
  return (
    <div id="user-profile">
      <div className="cover-container relative">
        <img
          src="https://okaystartup.com/images/home4.jpg"
          alt="cover-image"
          className="cover-image"
        ></img>
        {/* <i className="pi pi-pencil edit-cover" style={{ fontSize: "2rem" }}></i> */}
      </div>
      <div className="absolute avt-frame">
        <div className="avatar-container relative">
          <img
            src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
            alt=""
            className="avt-image"
          ></img>
          {/* <i className="pi pi-pencil edit-avt" style={{ fontSize: "1rem" }}></i> */}
        </div>
      </div>
    </div>
  );
};
export default UserImage;
