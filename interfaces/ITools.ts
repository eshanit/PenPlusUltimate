interface Tools {
    label: string,
    name: string,
    svg_path: string,
    description?: string,
    color?: string,
    category?: string
}

type ITools = Readonly<Tools>;

export type { ITools as default };