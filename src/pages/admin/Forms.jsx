import React from 'react'
import InstructorFormsOverviewTable from '../../components/admin/InstructorFormsOverviewTable'
import Card3 from '../../components/Card3'

export default function Forms() {
  return (
    <div>
      <div className='pb-5'>
        <p className='text-[var(--primary-color)] text-3xl font-semibold'>Forms Management</p>
        <p className="text-[var(--primary-color)] text-md">Create, manage, and track instructor forms.</p>
      </div>


      <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card3
          icon="fa-regular fa-file text-xl"
          title="View Form Templates"
          subtitle="View existing form templates."
          button="Create"
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
          button="Create"
        />
        <Card3
          icon="fa-regular fa-file text-xl"
          title="Assign Forms"
          subtitle="Assign forms to instructors."
          button="Create"
        />
      </div>

      <div className='w-full bg-white rounded'>
        <InstructorFormsOverviewTable />
      </div>

    </div>
  )
}
