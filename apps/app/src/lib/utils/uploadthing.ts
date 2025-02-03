import {
	generateReactHelpers,
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";

import type { UtFileRouter } from "~/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<UtFileRouter>();
export const UploadDropzone = generateUploadDropzone<UtFileRouter>();

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<UtFileRouter>();
