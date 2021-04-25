import React from 'react';
//Components
import Search from '../pages/search/index';
import Products from '../pages/analysis/index';
import Complaints from '../pages/complaint/createComplatin';
//Icons
// import AssessmentIcon from '@material-ui/icons/Assessment';
import AssessmentIcon from '@material-ui/icons/Assessment';
import SearchIcon from '@material-ui/icons/Search';
import DescriptionIcon from '@material-ui/icons/Description';
// import PersonIcon from '@material-ui/icons/Person';
// import MemoryIcon from '@material-ui/icons/Memory';

export const createRoutes = (routes) => {
  const adminRoutes = [];
  if (routes.length > 0) {
    routes.forEach(item => {
      if (item.name === 'Búsqueda') {
        adminRoutes.push({
          path: '/',
          name: item.name,
          icon: () => <SearchIcon style={{ color: 'white' }} />,
          component: Search,
          to: "/"

        })
      } else if (item.name === "Quejas") {
        adminRoutes.push({
          path: `/${item.name}`,
          name: item.name,
          icon: () => <DescriptionIcon style={{ color: 'white' }} />,
          component: Complaints,

        })
      }
      else {
        adminRoutes.push({
          path: `/${item.name}`,
          name: item.name,
          icon: () => <AssessmentIcon style={{ color: 'white' }} />,
          component: Products,

        })
      }
    })
  }
  return adminRoutes;
}

// const adminRoutes = [
//   {
//     path: '/',
//     name: "main",
//     icon: () => <AssessmentIcon style={{ color: '#FFC02E' }} />,
//     component: Clients,
//     to: "/"

//   },
//   {
//     path: '/products',
//     name: "Productos",
//     icon: () => <HistoryIcon style={{ color: '#FFC02E' }} />,
//     component: Products,

//   },
//   // {
//   //   path: '/user',
//   //   name: "Usuario",
//   //   icon: () => <PersonIcon style={{ color: 'white' }} />,
//   //   component: <div>Hola</div>,

//   // },
//   // {
//   //   path: '/device',
//   //   name: "Dipositivos",
//   //   icon: () => <MemoryIcon style={{ color: 'white' }} />,
//   //   component: <div>Hola</div>,

//   // },
//   // { redirect: true, path: "/", to: "/main", name: "HomePage" }
// ];

// export default adminRoutes;
