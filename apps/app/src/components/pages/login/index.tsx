import { Suspense } from "react";
import Footer from "./footer";
import LoginButtons from "./login-buttons";
import MovieHeader, { MoviePosterSkeleton } from "./movie-header";

export default function LoginComponent() {
	return (
		<div className="h-full">
			<div className="flex flex-col md:flex-row justify-center h-full items-center">
				<div className="w-full h-full hidden xl:block">
					<Suspense fallback={<MoviePosterSkeleton />}>
						<MovieHeader />
					</Suspense>
				</div>
				<div className="flex relative h-full items-center justify-center w-full px-4 md:px-0">
					<div className="absolute flex items-center top-4 left-4">
						<div className="w-full flex items-center justify-center">
							<img
								src="logo.png"
								alt="Serea logo"
								className="hover:scale-[0.85] duration-200 scale-100 h-8 md:h-12 w-8 md:w-12"
							/>
						</div>
						<p className="tracking-tight ml-1 text-base md:text-lg dark:text-neutral-300 text-neutral-700 font-semibold">
							serea
						</p>
					</div>
					<div className="w-full max-w-sm rounded-xl mt-16 md:mt-0">
						<p className="font-semibold text-neutral-800 dark:text-neutral-300 my-4 text-2xl md:text-3xl">
							serea
						</p>
						<p className="font-semibold text-neutral-500 mb-8 text-lg md:text-xl max-w-[90%] md:max-w-[75%]">
							Create watchlists, share with your friends, and track the stuff
							you watch.
						</p>
						<LoginButtons />
						<Footer />
					</div>
				</div>
			</div>
		</div>
	);
}
