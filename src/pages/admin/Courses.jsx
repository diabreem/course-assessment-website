import React from 'react'
import CoursesTable from '../../components/admin/CoursesTable'
const Courses = () => {
  return (
    <div>

      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Course Management</p>
        <p className="text-md">Add or remove courses and manage their details.
        </p>
      </div>

      <div className='w-full graph-container bg-white rounded flex flex-row justify-between'>
        <CoursesTable/>
      </div>
    </div>
  )
}
export default Courses
