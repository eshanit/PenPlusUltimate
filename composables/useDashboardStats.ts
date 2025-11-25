export function useDashboardStats(evaluations: any[]) {
  if (!evaluations || evaluations.length === 0) {
    return [
      { label: 'Active Facilities', value: '0', icon: 'i-heroicons-building-office', color: 'blue' },
      { label: 'Total Evaluations', value: '0', icon: 'i-heroicons-clipboard-document', color: 'green' },
      { label: 'This Month', value: '0', icon: 'i-heroicons-calendar', color: 'orange' },
      { label: 'Completion Rate', value: '0%', icon: 'i-heroicons-chart-bar', color: 'purple' }
    ];
  }

  const evals = evaluations;

  // Active Facilities: unique facilities
  const facilities = new Set(evals.map((e: any) => e.mentee.facility));
  const activeFacilities = facilities.size;

  // Total Evaluations
  const totalEvaluations = evals.length;

  // This Month: evaluations with at least one session in current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthEvals = evals.filter((e: any) => {
    const sessions = Object.values(e.sessions).filter((s: any) => s);
    return sessions.some((s: any) => {
      const evalDate = new Date(s.evalDate);
      return evalDate.getMonth() === currentMonth && evalDate.getFullYear() === currentYear;
    });
  }).length;

  // Completion Rate: evaluations with all 5 sessions completed
  const completedEvals = evals.filter((e: any) => {
    return e.sessions.session_1 && e.sessions.session_2 && e.sessions.session_3 && e.sessions.session_4 && e.sessions.session_5;
  }).length;
  const completionRate = totalEvaluations > 0 ? Math.round((completedEvals / totalEvaluations) * 100) : 0;

  return [
    { label: 'Active Facilities', value: activeFacilities.toString(), icon: 'i-heroicons-building-office', color: 'blue' },
    { label: 'Total Evaluations', value: totalEvaluations.toString(), icon: 'i-heroicons-clipboard-document', color: 'green' },
    { label: 'This Month', value: thisMonthEvals.toString(), icon: 'i-heroicons-calendar', color: 'orange' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: 'i-heroicons-chart-bar', color: 'purple' }
  ];
}