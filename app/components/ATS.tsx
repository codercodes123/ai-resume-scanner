interface ATSProps {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  // Guard: Ensure score is a valid number
  const safeScore = typeof score === 'number' ? score : 0;
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  const getGradient = () => {
    if (safeScore > 69) return "from-green-100";
    if (safeScore > 49) return "from-yellow-100";
    return "from-red-100";
  };

  const getIcon = () => {
    if (safeScore > 69) return "/icons/ats-good.svg";
    if (safeScore > 49) return "/icons/ats-warning.svg";
    return "/icons/ats-bad.svg";
  };

  return (
    <div
      className={`rounded-2xl shadow-md w-full bg-gradient-to-b ${getGradient()} to-light-white p-8 flex flex-col gap-4`}
    >
      <div className="flex flex-row gap-4 items-center">
        <img src={getIcon()} alt="ATS" className="w-10 h-10" />
        <p className="text-2xl font-semibold">ATS Score - {safeScore}/100</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-medium text-xl">
          How well does your resume pass through Applicant Tracking Systems?
        </p>
        <p className="text-lg text-gray-500">
          Your resume was scanned like an employer would. Here's how it
          performed:
        </p>
        {safeSuggestions.map((suggestion, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={
                suggestion.type === "good"
                  ? "/icons/check.svg"
                  : "/icons/warning.svg"
              }
              alt="ATS"
              className="w-4 h-4"
            />
            <p className="text-lg text-gray-500">{suggestion.tip}</p>
          </div>
        ))}
        <p className="text-lg text-gray-500">
          Want a better score? Improve your resume by applying the suggestions
          listed below.
        </p>
      </div>
    </div>
  );
};

export default ATS;