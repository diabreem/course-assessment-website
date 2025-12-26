import { PieChart } from '@mui/x-charts/PieChart';

function HTMLDiamond({ className, color }) {
  return (
    <div
      className={className}
      style={{ transform: 'scale(0.6, 0.75) rotate(45deg)', background: color }}
    />
  );
}

function SVGStar({ className, color }) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path
        className={className}
        d="M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z"
        fill={color}
      />
    </svg>
  );
}

export default function FormCompletionChart() {
  return (
    <div className="bg-white rounded-xl p-4">
      <p className="text-[var(--primary-color)] font-bold text-lg mb-5">
        Form Completion Overview
      </p>
    <PieChart
      series={[
        {
          data: [
            { value: 10, label: 'Submitted', labelMarkType: 'square', color: 'var(--primary-color)' },
            { value: 15, label: 'In Progress', labelMarkType: 'square', color: 'var(--secondary-color)' },
            { value: 20, label: 'Unopened', labelMarkType: 'square', color: 'gray' },
          ],
        }, 
      ]}
      width={200}
      height={200}
    />
    </div>
  );
}
