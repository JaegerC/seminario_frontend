import React from 'react';
import MenuBar from '../pages/menu/menubar';
import { createRoutes } from '../routes/menuroutes';
import { useSelector } from 'react-redux';

const SideBar = (props) => {
  const { system_modules } = useSelector(state => state.systemModules);

  return (
    <MenuBar routes={createRoutes(system_modules)} props={props} />
  );
}

export default SideBar;
