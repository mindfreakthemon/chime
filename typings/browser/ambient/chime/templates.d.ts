interface TemplateAttributes {
	[key: string]: string;
}

declare module 'templates/content' {
	export function button(attributes?: TemplateAttributes);
	export function lyrics(attributes?: TemplateAttributes);
	export function scrobbling(attributes?: TemplateAttributes);
}

declare module 'templates/options' {
	export function body(attributes?: TemplateAttributes);
	export function lyrics(attributes?: TemplateAttributes);
	export function scrobbling(attributes?: TemplateAttributes);
}
