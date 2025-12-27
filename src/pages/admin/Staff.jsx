import React from 'react'
import StaffDetailsTable from '../../components/admin/StaffDetailsTable'
const Staff = () => {
  return (
    <div>

      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Staff Management</p>
        <p className="text-md">Add or remove staff and manage their details.
        </p>
      </div>

      <div className='w-full graph-container bg-white rounded flex flex-row justify-between'>
        <StaffDetailsTable/>
      </div>
    </div>
  )
}
export default Staff
