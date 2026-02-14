import React from "react";
import InstructorFormTable from "../../components/instructor/InstructorFormTable";
import SemesterCountdown from "../../components/SemesterCountdown";
import FormCompletionChart from "../../components/admin/FormCompletionChart";



const Forms = () => {

     const chartData = [
    { value: 10, label: 'Submitted', labelMarkType: 'square', color: 'var(--primary-color)' },
    { value: 20, label: 'In Progress', labelMarkType: 'square', color: 'var(--secondary-color)' },
    { value: 30, label: 'Unopened', labelMarkType: 'square', color: 'gray' },
  ]; 

  return (
    <div className="rounded-lg">
        <InstructorFormTable />
        <div className="flex justify-between mt-4 gap-10">
          <SemesterCountdown />
        <FormCompletionChart data={chartData}/>
        </div>
        
      
      </div>
  )
}

export default Forms
