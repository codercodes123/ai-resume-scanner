interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const getBadgeStyles = () => {
    if (score > 70) return { bg: "bg-badge-green", text: "text-green-600", label: "Strong" };
    if (score > 59) return { bg: "bg-badge-yellow", text: "text-yellow-600", label: "Good Start" };
    return { bg: "bg-badge-red", text: "text-red-600", label: "Needs Work" };
  };

  const { bg, text, label } = getBadgeStyles();

  return (
    <div className={`${bg} px-3 py-1 rounded-full`}>
      <p className={`${text} text-sm font-medium`}>{label}</p>
    </div>
  );
};

export default ScoreBadge;
