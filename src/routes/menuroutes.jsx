import React from 'react';
//Components
import Search from '../pages/search/index';
import Products from '../pages/products/index';
//Icons
import AssessmentIcon from '@material-ui/icons/Assessment';
import HistoryIcon from '@material-ui/icons/History';
import SearchIcon from '@material-ui/icons/Search'
// import PersonIcon from '@material-ui/icons/Person';
// import MemoryIcon from '@material-ui/icons/Memory';

export const createRoutes = (routes) => {
  const adminRoutes = [];
  if (routes.length > 0) {
    routes.forEach(item => {
      console.log(item.name)
      if (item.name === 'Búsqueda') {
        adminRoutes.push({
          path: '/main',
          name: item.name,
          icon: () => <SearchIcon style={{ color: '#FFC02E' }} />,
          component: Search,
          to: "/"

        })
      } else {
        adminRoutes.push({
          path: `/${item.name}`,
          name: item.name,
          icon: () => <HistoryIcon style={{ color: '#FFC02E' }} />,
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
