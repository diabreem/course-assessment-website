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

      <div className='w-full bg-white rounded'>
        <InstructorFormsOverviewTable />
      </div>

    </div>
  )
}
