

export class AirOrder {
	id: number = null;
	crUser: string = null;
	crTime: string = undefined;
	upUser: string = null;
	upTime: string = undefined;
	custom: Custom = new Custom();
	customId: number = null;
}

export class AuthUser {
	id: number = null;
	crUser: string = null;
	crTime: string = undefined;
	upUser: string = null;
	upTime: string = undefined;
	username: string = null;
	password: string = null;
	role: string = null;
	enable: boolean = null;
	delete: boolean = null;
}

export class Credit {
	id: number = null;
	crUser: string = null;
	crTime: string = undefined;
	upUser: string = null;
	upTime: string = undefined;
	cardType: string = null;
	firstName: string = null;
	lastName: string = null;
	middleName: string = null;
	cardNo: string = null;
	cvv: string = null;
	outDate: string = null;
	invoice: string = null;
	amount: string = null;
	currency: string = null;
	currencyAmount: number = null;
}

export class Custom {
	id: number = null;
	crUser: string = null;
	crTime: string = undefined;
	upUser: string = null;
	upTime: string = undefined;
	parentId: number = null;
	phone1: string = null;
	phone2: string = null;
	email: string = null;
	qq: string = null;
	wx: string = null;
	firstName: string = null;
	middleName: string = null;
	lastName: string = null;
	sex: string = null;
	country: string = null;
	customSource: string = null;
	customType: string = null;
	remark: string = null;
}

export class FileMeta {
	id: number = null;
	crUser: string = null;
	crTime: string = undefined;
	upUser: string = null;
	upTime: string = undefined;
	path: string = null;
	name: string = null;
	root: string = null;
	ext: string = null;
	size: number = null;
	tag: string = null;
	userId: number = null;
	referId: number = null;
	orderNo: number = null;
}

export class Payment {
	id: number = null;
	crUser: string = null;
	crTime: string = undefined;
	upUser: string = null;
	upTime: string = undefined;
	type: string = null;
	amount: number = null;
	payedTime: string = null;
	credit: Credit = null;
}