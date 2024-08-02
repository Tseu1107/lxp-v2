/* eslint-disable */
export const getFlatTreeData = (source, parentId = null) => {
    // Assuming object's unique identifier is 'key'.
    // Not fully tested with nested data.
    let array = [];
    for (const node of source) {
        const object = { ...node };
        object.parent = parentId;
        array = [...array, object];
        if (object.children?.length) {
            const children = getFlatTreeData(object.children, object.key);
            array = [...array, ...children];
        }
        delete object.children;
    }
    return array;
};

export const getLastOrderNumber = (array, key = 'ordering') => {
    let highestOrderNumber = 0;
    for (const item of array) {
        if (item[key] && item[key] > highestOrderNumber) {
            highestOrderNumber = item[key];
        }
    }
    return highestOrderNumber;
};

export const strTimeToMinutes = (time) => {
    let minutes = 0;
    if (time && typeof time === 'string' && time.length === 5) {
        const stringHour = time.substring(0, 2);
        const stringMinute = time.substring(3, 5);
        if (/^\d+$/.test(stringHour)) {
            minutes = Number(stringHour) * 60;
        }
        if (/^\d+$/.test(stringMinute)) {
            minutes += Number(stringMinute);
        }
    }
    return minutes;
};

export const dateFormat = (dateObj) => {
    if (dateObj) {
        let year = dateObj.getFullYear(),
            month = dateObj.getMonth() + 1,
            date = dateObj.getDate();

        return year + "-" + ("00" + month).slice(-2) + "-" + ("00" + date).slice(-2);
    } else {
        return null;
    }
};

export const timeDateFormat = (date) => {
    var month = "00" + (date.getMonth() + 1);
    var day = "00" + date.getDate();
    var hours = "00" + date.getHours();
    var minutes = "00" + date.getMinutes();
    var seconds = "00" + date.getSeconds();
    var dateValue = date.getFullYear() + '.' + month.slice(-2) + '.' + day.slice(-2) + " " + hours.slice(-2) + ':' + minutes.slice(-2) + ":" + seconds.slice(-2);
    return dateValue;
};


export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const isValidEmail = (email = '') => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const isValidDate = (str) => {
    var m = str.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
    return (m) ? new Date(m[1], m[2] - 1, m[3]) : null;
};

export const priceFormat = (price) => {
    if (price) {
        return Number.parseInt(price).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1\'');
    } else {
        return 0;
    }
};

export const numberFormat = (number) => {
    if (number) {
        return Number.parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return 0;
    }
};

export const numberReverseFormat = (str, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const floatFormat = (floatNumber, digit = 2) => {
    if (floatNumber) {
        let splitNumbers = floatNumber.toString().split(".");

        if (splitNumbers.length === 2) {
            return floatNumber.toFixed(digit);
        } else {
            return splitNumbers[0];
        }
    } else {
        return 0;
    }
};

export const isFloat = (number) => {
    if (typeof parseInt(number) === 'number') {
        if (number % 1 === 0) {
            // int
            return false;
        } else {
            // float
            return true;
        }
    } else {
        // not number
        return false;
    }
};

export const isValidURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
};

export const linkify = (inputText) => {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" style="color: white;">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" style="color: white;">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" style="color: white;">$1</a>');

    return replacedText;
};

export const queryUrl = (url) => {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
};

export const htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

const maxUploadSize = 25;
export const isLargerFile = (sizeInByte) => {
    if (sizeInByte && sizeInByte > 1024) {
        let kb = Math.floor(sizeInByte / 1024);
        let byte = sizeInByte - 1024 * kb;
        if (kb > 1024) {
            let mb = Math.floor(kb / 1024);
            if (mb > maxUploadSize) {
                // larger than 25
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false
    }
};


export const isNumberInput = (value) => {
    const re = /^[0-9\b]+$/;
    return value === '' || re.test(value);
};

export const capitalize = string => {
    if (typeof string === 'string' && string.length) {
        return `${string[0].toUpperCase()}${string.substring(1).toLowerCase()}`;
    } else {
        return string;
    }
};

export const replaceAnchors = string => {
    if (string && typeof string === 'string') {
        const re = /<a[^>]*>([^<]+)<\/a>/g;
        const href_re = /href="([^"]*)/;
        const absoluteUrlRe = /^https?:\/\/|^\/\//i;
        return string.replace(re, function (stringA) {
            return stringA.replace(href_re, function (stringHref, href) {
                const url = absoluteUrlRe.test(href) ? href : `https://${href}`;
                return `href="${url}" target="_blank" rel="noreferrer noopener"`;
            })
        });
    }
    return '';
};

export const reorderWithDrop = (array, drop, key = 'id') => {
    const cloneDeep = require('lodash/cloneDeep');
    const clone = cloneDeep(array);
    const { itemId, targetId, position } = drop;
    const ordered = [];
    for (const element of clone) {
        if (element[key] === targetId) {
            const item = clone.find(el => el[key] === itemId);
            const target = clone.find(el => el[key] === targetId);
            if (position === 'top') {
                ordered.push(item);
                ordered.push(target);
            } else {
                ordered.push(target);
                ordered.push(item);
            }
        } else if (itemId !== element[key]) {
            ordered.push(element);
        }
    }
    return ordered;
};

export const getDatesBetweenDates = (start, end) => {
    let dates = [];
    const startDate = new Date(start);
    while (startDate <= end) {
        dates = [...dates, getDateByDateObject(new Date(startDate))];
        startDate.setDate(startDate.getDate() + 1)
    }
    return dates
};

export const getDateByDateObject = (dateObject) => {
    let d = new Date(dateObject);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    let date = year + "-" + month + "-" + day;

    return date;
};

export const toDropdownArray = (array = [], valueKey = '', textKey = '') => {
    const tempList = []

    array.map((obj, index) => {
        tempList.push({
            value: valueKey ? obj[valueKey] : index + 1,
            text: obj[textKey]
        })
    })

    return tempList
}

export const toTreeData = (array = [], valueKey = '', textKey = '', parentKey = '', activeOnly = true) => {
    const tempList = []

    array.map(obj => {
        if (activeOnly && !obj.isActive) {
            return;
        }
        tempList.push({
            key: parentKey ? obj[valueKey] + '@' + parentKey : obj[valueKey],
            title: obj[textKey],
            children: toTreeData(obj.children, valueKey, textKey, obj[valueKey])
        })
    })

    return tempList
}

export const toTime = (seconds = 0) => {
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds - (hour * 3600)) / 60);
    const sec = seconds - (hour * 3600) - (minute * 60);

    if (hour > 0) {
        return ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + sec).slice(-2)
    } else if (minute > 0) {
        return ('0' + minute).slice(-2) + ':' + ('0' + sec).slice(-2)
    }

    return ('0' + sec).slice(-2)
}

export const secondsToHms = (d) => {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? (h + ":") : "00:";
    var mDisplay = m > 0 ? (m + ":") : "00:";
    var sDisplay = s > 0 ? (s + "") : "00";

    return hDisplay + (parseInt(mDisplay) > 0 && parseInt(mDisplay) < 10 ? ('0' + mDisplay) : mDisplay) + (parseInt(sDisplay) > 0 && parseInt(sDisplay) < 10 ? ('0' + sDisplay) : sDisplay);
}

export const secondsToMs = (d) => {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "00:";
    var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "00:";
    var sDisplay = s > 0 ? s + (s == 1 ? ":" : "") : "00";

    return (hDisplay > 0 ? hDisplay : '') + (parseInt(mDisplay) > 0 && parseInt(mDisplay) < 10 ? ('0' + mDisplay) : mDisplay) + (parseInt(sDisplay) > 0 && parseInt(sDisplay) < 10 ? ('0' + sDisplay) : sDisplay);
}

export const toDropdownData = (array = [], valueKey = '', textKey = '', extra = false) => {
    const tempList = []

    array.map(obj => {
        if (extra) {
            tempList.push({
                value: obj[valueKey],
                text: obj[textKey],
                ...obj
            })
        } else {
            tempList.push({
                value: obj[valueKey],
                text: obj[textKey],
            })
        }

    })

    return tempList
}

export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export const dateObjectFormat = (dateObj = {}, showTime = false) => {
    if (dateObj.date) {
        if (showTime) {
            return dateObj.date?.substring(0, 19)
        }
        return dateObj.date?.substring(0, 10)
    }

    return null
}

export const takenPercent = (taken = 0, total = 0) => {
    if (total == 0 || taken == 0) {
        return 0
    }
    return ((taken / total) * 100).toFixed(2)
}

export const replaceHTMLEntities = (str = '') => {
    const htmlEntities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&ndash;': '-',
        '&nbsp;': '',
    };

    return str.replace(/&[\w#]+;/g, entity => {
        return htmlEntities[entity] || '';
    });
}

export const getAdminUrl = (hostUrl = null) => {
    if (hostUrl) {
        if (hostUrl.includes('-test.eschool.mn')) {
            return 'https://api-test.eschool.mn'
        } else {
            return 'https://api.eschool.mn'
        }
    } else {
        return 'https://api.eschool.mn'
    }
}

export const listToCrosswordObj = (array = [], isStudentResult) => {
    if (array && array.length > 0) {
        let across = {}
        let down = {}
        for (let i = 0; i < array.length; i++) {
            if (array[i].orientation == 'across') {
                let acrossObj = {
                    [array[i].position]: {
                        clue: array[i].clue,
                        // answer: isStudentResult ? array[i].studentAnswer : array[i].answer,
                        answer: array[i].answer,
                        row: parseInt(array[i].row),
                        col: parseInt(array[i].col),
                        className: 'wrong',
                        class: 'wrong',
                        correct: false,
                        complete: false,
                        solution: 'WRONGA',
                    }
                }

                across = Object.assign(across, acrossObj);
            } else if (array[i].orientation == 'down') {
                let downObj = {
                    [array[i].position]: {
                        clue: array[i].clue,
                        // answer: isStudentResult ? array[i].studentAnswer : array[i].answer,
                        answer: array[i].answer,
                        row: parseInt(array[i].row),
                        col: parseInt(array[i].col),
                        className: 'wrong',
                        class: 'wrong',
                        correct: false,
                        complete: false,
                    }
                }

                down = Object.assign(down, downObj);
            }
        }

        let crossData = {
            across: across,
            down: down
        }

        return crossData
    }
}