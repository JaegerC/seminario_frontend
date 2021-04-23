import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Main from '../pages/common/main';
import SideBar from '../components/sidebar';
import { routes } from '../setup/routes';
import CircularLoading from '../components/loading/circularLoading';
import { useSelector, useDispatch } from 'react-redux';
import { getDepartments, getModules } from '../redux/common/action';

const AppRoutes = () => {
  const dispatch = useDispatch();
  // const { isLoading = false } = useSelector(state => state.systemModules);
  const { isLoading, system_modules } = useSelector(state => state.systemModules);

  useEffect(() => {
    dispatch(getDepartments())
    dispatch(getModules());
  }, [])

  // if (isLoading) {
  //   return (<CircularLoading isLoading={isLoading} />);
  // }
  return (
    <Switch>
      <Route path={routes.home} component={Main} exact />
      <Route path={routes.home} component={SideBar} />
    </Switch>
  );
}

export default AppRoutes;
