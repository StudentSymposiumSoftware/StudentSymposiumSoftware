export function toTitleCase(input) {
    return input.toLowerCase().split(" ").map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1)) }).join(" ");
}

export function findSchoolLogo(text) {
    if (text.toLowerCase().indexOf("machias") !== -1) return "/StudentSymposiumSoftware/umaine-machias.png"
    else return "/StudentSymposiumSoftware/umaine-orono.png"
}