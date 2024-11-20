import { Suspense } from "react";
import Footer from "./footer";
import MovieHeader, { MoviePosterSkeleton } from "./movie-header";
import LoginActions from "./login-actions";

export async function Login() {
	return (
		<div className="h-full">
			<div className="flex justify-center h-full items-center">
				<div className="w-full h-full">
					<Suspense fallback={<MoviePosterSkeleton />}>
						<MovieHeader />
					</Suspense>
				</div>
				<div className="flex relative h- items-center justify-center -mt-8 w-full h-full">
					<div className="absolute flex items-center top-4 left-4">
						<div className="w-full flex items-center justify-center">
							<img
								src="logo.png"
								alt="Serea logo"
								className="hover:scale-[0.85] duration-200 scale-100 h-12 w-12"
							/>
						</div>
						<p className="tracking-tight ml-1 text-lg dark:text-neutral-300 text-neutral-700 font-semibold">
							serea
						</p>
					</div>
					<div className="w-full max-w-sm rounded-xl">
						<p className="font-semibold text-neutral-800 dark:text-neutral-300 my-4 text-3xl">
							serea
						</p>
						<p className="font-semibold text-neutral-500 mb-8 text-xl max-w-[75%]">
							Create watchlists, share with your friends, and track the the
							stuff you watch.
						</p>
						<LoginActions />
						<Footer />
					</div>
				</div>
			</div>
		</div>
	);
}
