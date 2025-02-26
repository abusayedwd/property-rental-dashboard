import { createBrowserRouter } from "react-router-dom";
import Home from "../home/Home";
import ForgotPassword from "../auth/forgotpassword";
import VerifyOtp from "../auth/VerifyOtp";
import UpdatePassword from "../auth/UpdatePassword";
import Main from "../layout/Main";
import DashboardHome from "../dashboard/home/DashboardHome";
import Notification from "../dashboard/menu/headermenu/Notification";
import Profile from "../dashboard/menu/headermenu/Profile";
import EditProfiel from "../dashboard/menu/headermenu/EditProfile";
import Earning from "../dashboard/menu/sidebarMenu/Earning";
import Users from "../dashboard/menu/sidebarMenu/Users";
 
import Landlord from "../dashboard/menu/sidebarMenu/Landlord";
 
import Settings from "../dashboard/menu/Settings";
import PrivacyPolicy from "../dashboard/menu/privacypolicy/PrivacyPolicy";
import EditPrivacy from "../dashboard/menu/privacypolicy/EditPrivacy";
import TermCondition from "../dashboard/menu/termsCondition/TermCondition";
import EditTermCondition from "../dashboard/menu/termsCondition/EditTermCondition";

import ErrorPage from "./ErrorPage";
import About from "../dashboard/menu/about/About";
import EditAbout from "../dashboard/menu/about/EditAbout";
import Subscription from "../dashboard/menu/subscription/Subscription";
import Addsubscripton from "../dashboard/menu/subscription/Addsubscripton";
import Editsubscription from "../dashboard/menu/subscription/Editsubscription";
import Property from "../dashboard/menu/sidebarMenu/Property";
import Banner from "../dashboard/menu/sidebarMenu/Banner";
import AddBanner from "../dashboard/menu/sidebarMenu/AddBanner";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home></Home>,
        errorElement: <ErrorPage />
    },
    {
        path: "forgotpassword",
        element: <ForgotPassword></ForgotPassword>
    },
    {
        path: "verifyotp",
        element: <VerifyOtp></VerifyOtp>
    },
    {
        path: "updatepassword",
        element: <UpdatePassword />
    },

    {
        path: "dashboard",
        element: <Main></Main>,
        children: [
            {
                path: "home",
                element: <DashboardHome />
            },
            {
                path: "banner",
                element: <Banner />
            },
            {
                path: "banner/addbanner",
                element: <AddBanner />
            },
            {
                path: "notification",
                element: <Notification />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "editprofile",
                element: <EditProfiel />
            },
            {
                path: "earning",
                element: <Earning />
            },
            {
                path:"user",
                element: <Users />
            }, 
            {
                path: "landlord",
                element: <Landlord />
            },
            {
                path: "property",
                element: <Property />
            },
            
            {
                path: 'settings',
                element:<Settings />
            },
            {
                path:'settings/privacypolicy',
                element:<PrivacyPolicy />
            },
            {
                path:'settings/editprivacypolicy',
                element: <EditPrivacy />
            },
            {
                path:"settings/termcondition",
                element:<TermCondition />
            },
            {
                path: "settings/edittermcondition",
                element: <EditTermCondition />
            },
            {
                path:'settings/about',
                element: <About />
            },
            {
                path:'settings/editabout',
                element:<EditAbout />
            },
            {
                path:'subscription',
                element: <Subscription />
            },
            {
                path: 'subscription/addsubscription',
                element: <Addsubscripton />
            },
            {
                path: 'subscription/editsubscription',
                element: <Editsubscription/>
            }
        ]
    }
])