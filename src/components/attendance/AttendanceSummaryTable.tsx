/* eslint-disable @typescript-eslint/no-explicit-any */
const AttendanceSummaryTable = ({ data }: { data: any }) => (
  <div className="bg-[#0A0A0A] border border-[#262626] rounded-[24px] overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-[#0D0D0D] border-b border-[#1A1A1A]">
        <tr className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
          <th className="px-6 py-5">Employee</th>
          <th className="px-6 py-5">Role</th>
          <th className="px-6 py-5">Location</th>
          <th className="px-6 py-5 text-center text-emerald-500">
            Total Present
          </th>
          <th className="px-6 py-5 text-center text-amber-500">Total Late</th>
          <th className="px-6 py-5 text-center text-red-500">Total Absent</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1A1A1A]">
        {data?.employees?.results.map((emp: any) => (
          <tr key={emp.id} className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-600/30">
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{emp.name}</span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-400">{emp.role}</td>
            <td className="px-6 py-4 text-sm text-gray-400">
              {emp.location || "N/A"}
            </td>
            <td className="px-6 py-4 text-center text-emerald-500 font-bold text-lg">
              {emp.total_present}
            </td>
            <td className="px-6 py-4 text-center text-amber-500 font-bold text-lg">
              {emp.total_late}
            </td>
            <td className="px-6 py-4 text-center text-red-500 font-bold text-lg">
              {emp.total_absent}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AttendanceSummaryTable;
