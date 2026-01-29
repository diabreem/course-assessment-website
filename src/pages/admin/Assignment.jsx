import React from 'react'
import AssignmentTable from '../../components/admin/AssignmentTable'

const Assignment = () => {
  return (
    <div>
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Setup & Assignment</p>
        <p className="text-md">Fill the below table to assign forms to staff. 
        </p>
      </div>
      <AssignmentTable/>
    </div>
  )
}

export default Assignment
