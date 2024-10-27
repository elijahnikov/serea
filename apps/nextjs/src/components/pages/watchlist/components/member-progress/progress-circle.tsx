export default function ProgressCircle({
	progress,
	total,
}: {
	progress: number;
	total: number;
}) {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg className="w-14 h-14">
			<circle
				className="text-surface-200"
				strokeWidth="4"
				stroke="currentColor"
				fill="transparent"
				r="24"
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
					r="24"
					cx="28"
					cy="28"
					strokeDasharray={`${(progress / total) * 150.72} 150.72`}
					strokeDashoffset="0"
					transform="rotate(-90 28 28)"
				/>
			)}
		</svg>
	);
}
