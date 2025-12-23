import React from 'react'
import StaffDetailsTable from '../../components/admin/StaffDetailsTable'
const Staff = () => {
  return (
    <div>
      <div className='pb-5'>
        <p className='text-[var(--primary-color)] text-3xl font-semibold'>Staff Management</p>
        <p className="text-[var(--primary-color)] text-md">Add or remove staff and manage their details.</p>
      </div>

      <div className='w-full graph-container bg-white rounded flex flex-row justify-between'>

        <StaffDetailsTable/>
        <div className='m-2'>
          <button className='btn1 text-[var(--primary-color)] border' title='Click to add a member.'><i className="fa-solid fa-plus"></i></button>
        </div>
      </div>
    </div>
  )
}

export default Staff
