import React from 'react'
import InstructorFormsOverviewTable from '../../components/admin/InstructorFormsOverviewTable'
import Card3 from '../../components/Card3'
import { useNavigate } from 'react-router-dom'

export default function Forms() {
  const navigate = useNavigate();
  return (
    <div>
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Forms Management</p>
        <p className="text-md">Create, manage, and track instructor forms.
        </p>
      </div>

      {/* <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card3
          icon="fa-regular fa-file text-xl"
          title="View Form Templates"
          subtitle="View existing form templates."
          button="View"
        />
        <Card3
          icon="fa-regular fa-file text-xl"
          title="Create New Template"
          subtitle="Design a new form template."
          button="Create"
        />
        <Card3
          icon="fa-regular fa-file text-xl"
          title="Edit Existing Template"
          subtitle="Edit an existing form template."
          button="Edit"
        />
        <Card3
          icon="fa-regular fa-file text-xl"
          title="Assign Forms"
          subtitle="Assign forms to instructors."
          button="Assign"
          onClick={()=>navigate("/admin/assignment")}
        />
      </div> */}

      <div className='w-full bg-white rounded'>
        <InstructorFormsOverviewTable />
      </div>

    </div>
  )
}
