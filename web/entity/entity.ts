

export class Batch {
	id: number = null;
	name: string = null;
	backup: string = null;
	timestamp: string = null;
	files: BatchFile[] = [];
}

export class BatchFile {
	id: number = null;
	path: string = null;
	act: string = null;
}