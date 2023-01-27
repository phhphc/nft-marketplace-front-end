import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";

import ImageUserProfile from "@Components/UserProfile/ImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";

const UserProfileContainer = () => {
    return (
        <>
            <ImageUserProfile></ImageUserProfile>
            <UserInfor></UserInfor>
            <NFTUserProfileTabs />
        </>
    );
};

export default UserProfileContainer;
