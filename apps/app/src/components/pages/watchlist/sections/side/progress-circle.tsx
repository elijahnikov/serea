export default function ProgressCircle({
	progress,
	total,
}: {
	progress: number;
	total: number;
}) {
	const radius = 18;
	const circumference = 2 * Math.PI * radius;

	return (
		<svg className="w-14 h-14">
			<circle
				className="dark:text-carbon-dark-500 text-carbon-500"
				strokeWidth="4"
				stroke="currentColor"
				fill="transparent"
				r={radius}
				cx="28"
				cy="28"
			/>
			{progress > 0 && (
				<circle
					className="text-green-500"
					strokeWidth="4"
					strokeLinecap="round"
					stroke="currentColor"
					fill="transparent"
					r={radius}
					cx="28"
					cy="28"
					strokeDasharray={`${(progress / total) * circumference} ${circumference}`}
					strokeDashoffset="0"
					transform="rotate(-90 28 28)"
				/>
			)}
		</svg>
	);
}
