export function toTitleCase(input) {
    return input.toLowerCase().split(" ").map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1)) }).join(" ");
}

export function findSchoolLogo(text) {
    if (text.toLowerCase().indexOf("machias") !== -1) return "/StudentSymposiumSoftware/umaine-machias.png"
    else return "/StudentSymposiumSoftware/umaine-orono.png"
}

export function abstractDataSearch(item, searchQuery) {
    const searchRegex = new RegExp(searchQuery, "i");
    return searchRegex.test(item.title) || 
           searchRegex.test(item.abstractNumber) || 
           searchRegex.test(item.allAuthors) || 
           searchRegex.test(item.keywords) ||
           searchRegex.test(item.school) ||
           searchRegex.test(item.professor) ||
           searchRegex.test(item.professor) ||
           searchRegex.test(item.abstract) ||
           searchRegex.test(item.major)
}