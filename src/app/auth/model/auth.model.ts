export interface AuthorizationDetail {
    displayName:    string;
    icon:           string;
    order:          number;
    parent:         boolean;
    link:           string;
    childs:         AuthorizationDetail[];
}

export interface User {
    userName:       string;
	password:       string;
	user:           String;
	roleId:         number;
}