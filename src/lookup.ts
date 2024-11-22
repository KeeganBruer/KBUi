const Lookup: {
    [key: string]: {
        src: string[],
        dst: string[]
    }[]
} = {
    "Files": [
        {
            src: ["Files", "Drop", "Area.tsx"],
            dst: ["Components", "Files", "Drop", "Area.tsx"]
        },
        {
            src: ["Files", "Drop", "Box.tsx"],
            dst: ["Components", "Files", "Drop", "Box.tsx"]
        },
        {
            src: ["Files", "useFileManager.ts"],
            dst: ["Hooks", "Files", "useFileManager.ts"]
        },
        {
            src: ["Files", "useFileUploadManager.ts"],
            dst: ["Hooks", "Files", "useFileUploadManager.ts"]
        },
        {
            src: ["Utils", "hash_func.ts"],
            dst: ["Utils", "hash_func.ts"]
        }
    ]
}

export default Lookup;