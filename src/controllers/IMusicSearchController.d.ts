import { IMusicEntryController } from "./IMusicController";
import { IMusicUploadHandler } from "handlers/IMusicUploadHandler";

export interface IMusicSearchController
	extends IMusicEntryController, IMusicUploadHandler {

}