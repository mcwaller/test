import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import axios from 'axios';

const TablePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3011/api/depart/departamentos')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      $('#example').DataTable(); // Initialize DataTable after data is fetched and state is updated
    }
  }, [data]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <table id="example" className="table table-striped table-bordered table-hover" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>DATE_TIME</th>
                  <th>T</th>
                  <th>RH</th>
                  <th>HUM</th>
                  <th>LUX</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.ID}>
                    <td>{item.DATE_TIME}</td>
                    <td>{item.T}</td>
                    <td>{item.RH}</td>
                    <td>{item.HUM}</td>
                    <td>{item.LUX}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
