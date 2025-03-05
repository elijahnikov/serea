import NumberFlow, { NumberFlowGroup } from "@number-flow/react";

export default function CurrentRuntimeCount({
	time,
}: {
	time: string;
}) {
	const [hh, mm, ss] = time.split(":").map(Number);
	return (
		<NumberFlowGroup>
			<div
				style={{
					fontVariantNumeric: "tabular-nums",
				}}
				className="font-medium font-mono"
			>
				<NumberFlow
					trend={+1}
					value={hh ?? 0}
					format={{ minimumIntegerDigits: 2 }}
				/>
				<NumberFlow
					prefix=":"
					trend={+1}
					value={mm ?? 0}
					digits={{ 1: { max: 5 } }}
					format={{ minimumIntegerDigits: 2 }}
				/>
				<NumberFlow
					prefix=":"
					trend={+1}
					value={ss ?? 0}
					digits={{ 1: { max: 5 } }}
					format={{ minimumIntegerDigits: 2 }}
				/>
			</div>
		</NumberFlowGroup>
	);
}
