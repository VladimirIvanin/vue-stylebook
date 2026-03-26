import * as Rsg from 'react-styleguidist'
import { Component } from './Component'
import { CodeExample, MdxExample } from './Example'

export interface ConfigSection extends Rsg.ConfigSection {
	componentPagePerSection?: boolean
	sections?: ConfigSection[]
}

export interface ProcessedSection extends Rsg.BaseSection {
	name: string
	href: string
	components?: Component[]
	filepath?: string
	content?: (CodeExample | Rsg.MarkdownExample | MdxExample)[]
	sections: ProcessedSection[]
	sectionDepth: number
	componentPagePerSection?: boolean
	slug?: string
}
