import React from "react";
const isElementWithChildren = (element) => {
    return (React.isValidElement(element) &&
        typeof element.props
            .children !== "undefined");
};
const isReactElement = (element) => {
    return React.isValidElement(element);
};
const getInitials = (name) => {
    const trimmedName = name.trim();
    // If the name is empty, a single character, or two characters (already initials)
    if (trimmedName.length === 0 ||
        trimmedName.length === 1 ||
        trimmedName.length === 2) {
        return trimmedName.toUpperCase();
    }
    const nameArray = trimmedName.split(" ");
    if (nameArray.length === 1) {
        return trimmedName.charAt(0).toUpperCase();
    }
    const firstName = nameArray[0]?.charAt(0).toUpperCase() ?? "";
    const lastName = nameArray[nameArray.length - 1]?.charAt(0).toUpperCase() ?? "";
    return firstName + lastName;
};
const stringToHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
    }
    return hash;
};
const getElementFromHash = (hash, strings) => {
    const index = Math.abs(hash) % strings.length;
    return strings[index];
};
export { isElementWithChildren, isReactElement, getInitials, stringToHash, getElementFromHash, };
