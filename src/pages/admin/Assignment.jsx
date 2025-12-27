import React from 'react'
import AssignmentTable from '../../components/admin/AssignmentTable'

const Assignment = () => {
  return (
    <div>
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Setup & Assignment</p>
        <p className="text-md">Fill out the semesters, instructor names, and coordinator names. 
        </p>
      </div>
      <AssignmentTable/>
    </div>
  )
}

export default Assignment
