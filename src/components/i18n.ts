
const data = require("../locates.json") as Record<string, Record<string, string>>
export function geti18n(text: string, { lang = "en", context = {} }: { lang: string, context?: Record<string, string> }): string {
    let bas = data[lang as any][text] as string;

    if (bas) {
        for (const [key, value] of Object.entries(context)) {
            bas = bas.replace(RegExp("{" + key + "}"), value)
        }
    } else if (lang !== "en") {
        bas = geti18n(text, { lang: "en", context })
    }
    return bas
}