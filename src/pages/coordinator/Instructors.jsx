import React from 'react'
import Card1 from '../../components/Card1'
import RecentSubmissionsTable from '../../components/coordinator/RecentSubmissionsTable'
import InstructorTable from '../../components/coordinator/InstructorTable'

const Instructors = () => {
  return (
    <div>
      <div className='pb-5'>
        <p className='text-[var(--primary-color)] text-3xl font-bold'>Dashboard</p>
        <p className="text-[var(--primary-color)] text-md">Here's an overview of your system.
        </p>
      </div>

      <div className="w-full flex flex-wrap justify-start py-4 gap-10">
        <Card1
          title="Total Instructors"
          number={30}
          icon="fa-solid fa-users"
          shadow={true}
          bgColor="bg-[var(--primary-color)]"
          textColor="text-white"
        />
    
        <Card1
          title="Submission Rate"
          number={50}
          icon="fa-solid fa-percent"
          shadow={false}
        />
        <Card1
          title="Pending Forms"
          number={10}
          icon="fa-solid fa-hourglass-start"
          shadow={false}
        />

      </div>

      <div className='flex w-full bg-white rounded p-1'>
        <InstructorTable/>

      </div>
    </div>
  )
}

export default Instructors
