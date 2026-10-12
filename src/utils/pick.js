// pick(req.body, ["bio", "gender"]) -> only the allowed fields that were really sent.
// This stops people from changing fields they must not touch (like "role").
export const pick = (object, keys) => {
    const result = {};
    keys.forEach((key) => {
        if (object[key] !== undefined) result[key] = object[key];
    });
    return result;
};
