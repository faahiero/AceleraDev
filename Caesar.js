function caesarCipher(s, n) {
    s.toLowerCase();
    const arr = s.split('')
    var solved = "";
    arr.map((item) => {
        var asciiNum = item.charCodeAt();
        if (asciiNum < 97 || asciiNum > 97 + 25) {
            solved += item;
        } else {
            if (asciiNum - n < 97) {
                let v = (asciiNum - n) - 96;
                if (v < 0) v = -v;
                asciiNum = 97 + (25 - v);
                solved += String.fromCharCode(asciiNum);
            } else {
                solved += String.fromCharCode(asciiNum - n);
            }
        }
    });
    return solved;
}

module.exports = caesarCipher