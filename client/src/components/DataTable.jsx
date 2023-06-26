import React from 'react'
import MaterialTable from 'material-table';
//material-table works only with theme providers
import {ThemeProvider, createTheme} from '@mui/material';
const DataTable = ({columns, data, title, action}) => {
    const defaultThemeMaterial = createTheme();
  return (
        <ThemeProvider theme={defaultThemeMaterial}>
            <MaterialTable
                columns={columns}
                data={data}
                title={title}
                actions={action}
            />
        </ThemeProvider>
  )
}

export default DataTable