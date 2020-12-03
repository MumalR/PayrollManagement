import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AdminLogin from "./Screens/AdminLogin";
import EmployeeLogin from "./Screens/EmployeeLogin";
import Welcome from "./Screens/Welcome";
import AdminDashboard from './Screens/AdminDashboard';
import AdminAddInfo from './Screens/AdminAddInfo';
import AddEmployee from './Screens/AddEmployee';
import AddGrade from './Screens/AddGrade';
import AddDep from './Screens/AddDep';
import EmployeeDrawer from "./Screens/EmployeeDrawer";

const App = () => {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Welcome} />
        <Route path="/adminLogin" component={AdminLogin}/>
        <Route path="/employeeLogin" component={EmployeeLogin}/>
        <Route path="/adminDashboard" component={AdminDashboard}/>
        <Route path='/adminAddInfo' component={AdminAddInfo}/>
        <Route path='/addEmployee' component={AddEmployee}/>
        <Route path='/addGrade' component={AddGrade}/>
        <Route path='/addDep' component={AddDep}/>
        <Route path='/employeeDashboard' component={EmployeeDrawer}/>

      </div>
    </Router>
  );
};
export default App