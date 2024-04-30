import React from 'react'
import { Link } from 'react-router-dom'
import EditEmployees from '../../EditEmployee/EditEmployees'


function ManageEmployee() {
  return (
    <>
    <table className="table table-borderless">
  <thead>
    <tr>
      <th scope="col">Employee Id</th>
      <th scope="col">Product Name</th>
      <th scope="col">Category</th>
      <th scope="col">Stock Available</th>
      <th scope="col">Action</th>

    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td className='d-flex gap-4'><Link to={'/EditEmployees'}><i className="fa-regular fa-pen-to-square fs-4"></i></Link><i className="fa-solid fa-xmark fs-4"></i></td>
    </tr>
  </tbody>
</table>
    </>
  )
}

export default ManageEmployee