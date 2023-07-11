import {Route, Switch} from 'react-router-dom';
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Login from './Pages/LoginPage/Login';
import Register from './Pages/RegisterPage/Register';
import HomePage from './Pages/UserHomePage/HomePage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import Addvenue from './Pages/Addvenue/AddVenue';
import AddEvent from './Pages/AddEvent/AddEvent';
import UserEvents from './Pages/UserEvents/UserEvents';
import Invitation from './Pages/Invitations/Invitations';
import GuestList from './Pages/GuestList/GuestList';
import UpdateUser from './Pages/UpdateUser/UpdateUser';
import UpdateVenue from './Pages/UpdateVenue/UpdateVenue';
import UpdateEvent from './Pages/UpdateEvent/UpdateEvent';

import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';


import GuestPage from './Pages/ProfilePage/GuestPage';




function App() {
  return (
    <>
    <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/homepage" component={HomePage} />
        <Route path="/profilePage" component={ProfilePage} />
        <Route path="/addVenue" component={Addvenue} />
        {/* <Route path="/addEvent/:id/:venueId" component={AddEvent} /> */}
        <Route path="/addEvent/:venueId" component={AddEvent} />
        <Route path="/userEvents" component={UserEvents} />
        <Route path="/invitation" component={Invitation} />
        <Route path="/guestList" component={GuestList} />
        <Route path="/updateUser" component={UpdateUser} />
        <Route path="/updateVenue/:venueId" component={UpdateVenue} />
        <Route path="/updateEvent/:eventId" component={UpdateEvent} />
        <Route path="/guestPage/:id" component={GuestPage} />

        <Route path="/dashboard" component={AdminDashboard} />







      </Switch>
      <Footer />
    </>
  );
}

export default App;
