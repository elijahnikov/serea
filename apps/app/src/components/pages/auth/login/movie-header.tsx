"use client";

import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import { AspectRatio } from "@serea/ui/aspect-ratio";
import Image from "next/image";
import { Marquee } from "@serea/ui/marquee";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "@serea/api";

export default function MovieHeader() {
	const { data, isLoading } = api.tmdb.trendingThisWeek.useQuery();

	if (isLoading) {
		return <MoviePosterSkeleton />;
	}

	const splitArray = (
		arr: RouterOutputs["tmdb"]["trendingThisWeek"]["results"],
		parts: number,
	) => {
		const result = [];
		const itemsPerPart = Math.ceil(arr.length / parts);
		for (let i = 0; i < arr.length; i += itemsPerPart) {
			result.push(arr.slice(i, i + itemsPerPart));
		}
		return result;
	};

	const [part1, part2, part3] = data?.results
		? splitArray(data.results, 3)
		: [];

	const MovieCard = ({
		movie,
	}: { movie: NonNullable<typeof data>["results"][number] }) => {
		return (
			<div key={movie.id} className="w-[200px] pointer-events-none select-none">
				<AspectRatio ratio={2 / 3}>
					<Image
						fill
						className="h-full w-full rounded-md object-cover pointer-events-none"
						src={`${TMDB_IMAGE_BASE_URL_SD}${movie.poster_path}`}
						alt={movie.original_title}
					/>
				</AspectRatio>
			</div>
		);
	};

	if (!data) {
		return <MoviePosterSkeleton />;
	}

	return (
		<div className="rounded-lg justify-center relative opacity-90 flex h-full px-4 bg-surface border">
			<Marquee vertical className="max-h-[96vh] py-1 [--duration:60s]">
				{part1?.map((movie) => (
					<MovieCard key={movie.id} movie={movie} />
				))}
			</Marquee>
			<Marquee reverse vertical className="max-h-[96vh] py-1 [--duration:60s]">
				{part2?.map((movie) => (
					<MovieCard key={movie.id} movie={movie} />
				))}
			</Marquee>
			<Marquee vertical className="max-h-[96vh] py-1 [--duration:60s]">
				{part3?.map((movie) => (
					<MovieCard key={movie.id} movie={movie} />
				))}
			</Marquee>
		</div>
	);
}

const MoviePosterSkeleton = () => {
	const LoadingCard = () => (
		<div className="w-[200px]">
			<AspectRatio ratio={2 / 3}>
				<div className="h-full rounded-md w-full border bg-surface-100" />
			</AspectRatio>
		</div>
	);

	return (
		<div className="rounded-lg justify-center relative opacity-90 flex h-full px-4 bg-surface border">
			<Marquee vertical className="max-h-[96vh] py-1 [--duration:60s]">
				{Array.from({ length: 6 }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<LoadingCard key={index} />
				))}
			</Marquee>
			<Marquee reverse vertical className="max-h-[96vh] py-1 [--duration:60s]">
				{Array.from({ length: 6 }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<LoadingCard key={index} />
				))}
			</Marquee>
			<Marquee vertical className="max-h-[96vh] py-1 [--duration:60s]">
				{Array.from({ length: 6 }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<LoadingCard key={index} />
				))}
			</Marquee>
		</div>
	);
};
